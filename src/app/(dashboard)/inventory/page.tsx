'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertTriangle, Package, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { onInventorySnapshot, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '@/firebase/firestore';
import type { InventoryItem } from '@/types';

type InventoryForm = {
  ingredient: string;
  stock: number;
  cost: number;
  unit: string;
  lowStockAlert: number;
  expiry: string;
  supplier: string;
};

const emptyForm: InventoryForm = {
  ingredient: '',
  stock: 0,
  cost: 0,
  unit: 'kg',
  lowStockAlert: 1,
  expiry: '',
  supplier: '',
};

const SEED_INVENTORY = [
  { ingredient: 'Flour', stock: 10, cost: 25, unit: 'kg', lowStockAlert: 2, expiry: '', supplier: 'Local Market' },
  { ingredient: 'Eggs', stock: 60, cost: 5, unit: 'pcs', lowStockAlert: 12, expiry: '', supplier: 'Farm Fresh' },
  { ingredient: 'Butter', stock: 5, cost: 85, unit: 'kg', lowStockAlert: 1, expiry: '', supplier: 'Dairy Co.' },
  { ingredient: 'Milk', stock: 8, cost: 40, unit: 'L', lowStockAlert: 2, expiry: '', supplier: 'Dairy Co.' },
  { ingredient: 'Sugar', stock: 6, cost: 22, unit: 'kg', lowStockAlert: 1, expiry: '', supplier: 'Local Market' },
  { ingredient: 'Chocolate Syrup', stock: 3, cost: 120, unit: 'bottle', lowStockAlert: 1, expiry: '', supplier: 'Wholesaler' },
  { ingredient: 'Matcha Powder', stock: 0.5, cost: 350, unit: 'kg', lowStockAlert: 0.2, expiry: '', supplier: 'Tea Supplier' },
  { ingredient: 'Strawberry Jam', stock: 4, cost: 95, unit: 'jar', lowStockAlert: 1, expiry: '', supplier: 'Wholesaler' },
];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<InventoryForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const unsub = onInventorySnapshot(setItems);
    return unsub;
  }, []);

  const lowStockItems = items.filter((i) => i.stock <= i.lowStockAlert);

  function openAdd() {
    setEditItem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(item: InventoryItem) {
    setEditItem(item);
    setForm({
      ingredient: item.ingredient,
      stock: item.stock,
      cost: item.cost,
      unit: item.unit,
      lowStockAlert: item.lowStockAlert,
      expiry: item.expiry || '',
      supplier: item.supplier || '',
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.ingredient) { toast.error('Ingredient name required'); return; }
    setSaving(true);
    try {
      if (editItem) {
        await updateInventoryItem(editItem.id, form);
        toast.success('Updated!');
      } else {
        await addInventoryItem(form);
        toast.success('Item added!');
      }
      setDialogOpen(false);
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleSeedData() {
    setSeeding(true);
    try {
      for (const item of SEED_INVENTORY) {
        await addInventoryItem(item);
      }
      toast.success('Sample inventory added!');
    } catch {
      toast.error('Failed to seed data');
    } finally {
      setSeeding(false);
    }
  }

  function f(key: keyof InventoryForm, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-muted-foreground text-sm">{items.length} ingredients tracked</p>
        </div>
        <div className="flex gap-2">
          {items.length === 0 && (
            <Button variant="outline" onClick={handleSeedData} disabled={seeding}>
              {seeding ? 'Adding...' : '📦 Add Sample Inventory'}
            </Button>
          )}
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add Ingredient
          </Button>
        </div>
      </motion.div>

      {/* Low stock alerts */}
      {lowStockItems.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" /> Low Stock Alerts ({lowStockItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map((i) => (
                  <Badge key={i.id} variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-400 text-xs">
                    {i.ingredient}: {i.stock} {i.unit} left
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Table */}
      {items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No inventory yet</p>
          <p className="text-sm">Add ingredients to track stock levels</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Stock Levels</CardTitle>
              <CardDescription>Click edit to update stock after delivery</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ingredient</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Cost/Unit</TableHead>
                      <TableHead>Alert At</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => {
                      const isLow = item.stock <= item.lowStockAlert;
                      const isOut = item.stock === 0;
                      return (
                        <TableRow key={item.id} className={isLow ? 'bg-amber-50/50 dark:bg-amber-950/10' : ''}>
                          <TableCell className="font-medium">{item.ingredient}</TableCell>
                          <TableCell className={isOut ? 'text-red-500 font-bold' : isLow ? 'text-amber-600 font-semibold' : ''}>
                            {item.stock}
                          </TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>฿{item.cost}</TableCell>
                          <TableCell>{item.lowStockAlert}</TableCell>
                          <TableCell className="text-muted-foreground">{item.supplier || '—'}</TableCell>
                          <TableCell className="text-muted-foreground">{item.expiry || '—'}</TableCell>
                          <TableCell>
                            {isOut ? (
                              <Badge variant="destructive" className="text-xs">Out of stock</Badge>
                            ) : isLow ? (
                              <Badge variant="outline" className="border-amber-400 text-amber-600 text-xs">Low</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">OK</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(item)}>
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setDeleteId(item.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Ingredient' : 'Add Ingredient'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Ingredient Name</Label>
              <Input placeholder="e.g. Flour" value={form.ingredient} onChange={(e) => f('ingredient', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Stock</Label>
              <Input type="number" min="0" step="0.01" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Input placeholder="kg / pcs / L" value={form.unit} onChange={(e) => f('unit', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Cost per Unit (฿)</Label>
              <Input type="number" min="0" step="0.01" value={form.cost} onChange={(e) => setForm((p) => ({ ...p, cost: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Low Stock Alert</Label>
              <Input type="number" min="0" step="0.01" value={form.lowStockAlert} onChange={(e) => setForm((p) => ({ ...p, lowStockAlert: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Supplier</Label>
              <Input placeholder="Supplier name" value={form.supplier} onChange={(e) => f('supplier', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Expiry Date</Label>
              <Input type="date" value={form.expiry} onChange={(e) => f('expiry', e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editItem ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Ingredient?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={async () => { if (deleteId) { await deleteInventoryItem(deleteId); toast.success('Deleted'); setDeleteId(null); } }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
