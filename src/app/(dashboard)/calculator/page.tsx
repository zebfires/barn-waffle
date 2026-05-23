'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calculator, Plus, Trash2, Save, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { onMenusSnapshot, saveCalculation, onCalculationsSnapshot, deleteCalculation } from '@/firebase/firestore';
import type { MenuItem, CalculatorItem } from '@/types';

const schema = z.object({
  menuId: z.string().min(1, 'Select a menu'),
  ingredientCost: z.coerce.number().min(0),
  packagingCost: z.coerce.number().min(0),
  deliveryFee: z.coerce.number().min(0),
  laborCost: z.coerce.number().min(0),
  electricityCost: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0.01, 'Selling price required'),
});

type FormData = {
  menuId: string;
  ingredientCost: number;
  packagingCost: number;
  deliveryFee: number;
  laborCost: number;
  electricityCost: number;
  sellingPrice: number;
};

function getMarginColor(margin: number) {
  if (margin >= 50) return 'text-emerald-600';
  if (margin >= 30) return 'text-amber-600';
  return 'text-red-500';
}

export default function CalculatorPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [calcs, setCalcs] = useState<CalculatorItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      ingredientCost: 0,
      packagingCost: 0,
      deliveryFee: 0,
      laborCost: 0,
      electricityCost: 0,
      sellingPrice: 0,
    },
  });

  useEffect(() => {
    const u1 = onMenusSnapshot(setMenus);
    const u2 = onCalculationsSnapshot(setCalcs);
    return () => { u1(); u2(); };
  }, []);

  const values = watch();
  const totalCost =
    (values.ingredientCost || 0) +
    (values.packagingCost || 0) +
    (values.deliveryFee || 0) +
    (values.laborCost || 0) +
    (values.electricityCost || 0);
  const profit = (values.sellingPrice || 0) - totalCost;
  const margin = values.sellingPrice ? (profit / values.sellingPrice) * 100 : 0;

  async function onSubmit(data: FormData) {
    const menu = menus.find((m) => m.id === data.menuId);
    if (!menu) return;
    setSaving(true);
    try {
      await saveCalculation({
        menuId: data.menuId,
        menuName: menu.name,
        ingredientCost: data.ingredientCost,
        packagingCost: data.packagingCost,
        deliveryFee: data.deliveryFee,
        laborCost: data.laborCost,
        electricityCost: data.electricityCost,
        totalCost,
        sellingPrice: data.sellingPrice,
        profitMargin: margin,
      });
      toast.success('Calculation saved!');
      reset();
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function loadCalc(c: CalculatorItem) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue('menuId', c.menuId as any);
    setValue('ingredientCost', c.ingredientCost);
    setValue('packagingCost', c.packagingCost);
    setValue('deliveryFee', c.deliveryFee);
    setValue('laborCost', c.laborCost);
    setValue('electricityCost', c.electricityCost);
    setValue('sellingPrice', c.sellingPrice);
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Profit Calculator</h1>
        <p className="text-muted-foreground text-sm">Calculate cost breakdown and profit margin per menu item</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calculator className="h-5 w-5 text-primary" /> Cost Calculator
              </CardTitle>
              <CardDescription>Enter costs for a menu item</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Menu Item</Label>
                  <Select onValueChange={(v) => setValue('menuId', String(v ?? ''))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a menu item..." />
                    </SelectTrigger>
                    <SelectContent>
                      {menus.length === 0 && (
                        <SelectItem value="none" disabled>No menus yet — add one first</SelectItem>
                      )}
                      {menus.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.menuId && <p className="text-xs text-destructive">{errors.menuId.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'ingredientCost', label: 'Ingredient Cost' },
                    { key: 'packagingCost', label: 'Packaging Cost' },
                    { key: 'deliveryFee', label: 'Delivery Fee' },
                    { key: 'laborCost', label: 'Labor Cost' },
                    { key: 'electricityCost', label: 'Electricity Cost' },
                    { key: 'sellingPrice', label: 'Selling Price ★' },
                  ].map(({ key, label }) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs">{label} (฿)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register(key as keyof FormData)}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>

                <Button type="submit" className="w-full" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Calculation'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Results */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Live Results</CardTitle>
              <CardDescription>Updates as you type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Ingredient', value: values.ingredientCost || 0 },
                  { label: 'Packaging', value: values.packagingCost || 0 },
                  { label: 'Delivery', value: values.deliveryFee || 0 },
                  { label: 'Labor', value: values.laborCost || 0 },
                  { label: 'Electricity', value: values.electricityCost || 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">฿{Number(value).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between font-semibold">
                  <span>Total Cost</span>
                  <span className="text-foreground">฿{totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Selling Price</span>
                  <span className="text-primary">฿{Number(values.sellingPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Net Profit</span>
                  <span className={profit >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                    ฿{profit.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Profit Margin</span>
                  <span className={`text-lg font-bold ${getMarginColor(margin)}`}>
                    {margin.toFixed(1)}%
                  </span>
                </div>
                <Progress value={Math.max(0, Math.min(100, margin))} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {margin >= 50 ? '✅ Excellent margin' : margin >= 30 ? '⚠️ Acceptable margin' : '❌ Low margin — review costs'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Saved Calculations */}
      {calcs.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Saved Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {calcs.map((c) => (
                  <div key={c.id} className="p-3 rounded-lg border border-border bg-muted/30 space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-sm">{c.menuName}</p>
                      <Badge
                        variant={c.profitMargin >= 50 ? 'default' : c.profitMargin >= 30 ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {c.profitMargin.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>Cost: ฿{c.totalCost.toFixed(2)} · Sell: ฿{c.sellingPrice.toFixed(2)}</p>
                      <p>Profit: ฿{(c.sellingPrice - c.totalCost).toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs h-7" onClick={() => loadCalc(c)}>
                        <Edit2 className="h-3 w-3 mr-1" /> Load
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 w-7 p-0"
                        onClick={() => setDeleteId(c.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {calcs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Calculator className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No saved calculations yet. Fill in the form above and save!</p>
        </div>
      )}

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Calculation?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (deleteId) {
                  await deleteCalculation(deleteId);
                  toast.success('Deleted');
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
