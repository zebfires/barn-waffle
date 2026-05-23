'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, UtensilsCrossed } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { onMenusSnapshot, addMenu, updateMenu, deleteMenu } from '@/firebase/firestore';
import type { MenuItem } from '@/types';

const CATEGORIES = ['Classic', 'Chocolate', 'Fruit', 'Matcha', 'Savory', 'Special', 'Beverage'];

const SEED_MENUS = [
  { name: 'Classic Waffle', category: 'Classic', price: 89, cost: 28, image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&q=80' },
  { name: 'Chocolate Waffle', category: 'Chocolate', price: 109, cost: 35, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80' },
  { name: 'Matcha Waffle', category: 'Matcha', price: 119, cost: 40, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80' },
  { name: 'Strawberry Waffle', category: 'Fruit', price: 119, cost: 38, image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80' },
];

type MenuForm = { name: string; category: string; price: number; cost: number; image: string };
const emptyForm: MenuForm = { name: '', category: 'Classic', price: 0, cost: 0, image: '' };

export default function MenuPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<MenuForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const unsub = onMenusSnapshot(setMenus);
    return unsub;
  }, []);

  const filtered = menus.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || m.category === categoryFilter;
    return matchSearch && matchCat;
  });

  function openAdd() {
    setEditItem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(item: MenuItem) {
    setEditItem(item);
    setForm({ name: item.name, category: item.category, price: item.price, cost: item.cost, image: item.image });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.category || form.price <= 0) {
      toast.error('Please fill in name, category, and price');
      return;
    }
    setSaving(true);
    const profit = form.price - form.cost;
    try {
      if (editItem) {
        await updateMenu(editItem.id, { ...form, profit });
        toast.success('Menu updated!');
      } else {
        await addMenu({ ...form, profit });
        toast.success('Menu added!');
      }
      setDialogOpen(false);
    } catch {
      toast.error('Failed to save menu');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    await deleteMenu(deleteId);
    toast.success('Menu deleted');
    setDeleteId(null);
  }

  async function handleSeedData() {
    setSeeding(true);
    try {
      for (const item of SEED_MENUS) {
        await addMenu({ ...item, profit: item.price - item.cost });
      }
      toast.success('Sample menus added!');
    } catch {
      toast.error('Failed to seed data');
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground text-sm">{menus.length} items · Manage your waffle menu</p>
        </div>
        <div className="flex gap-2">
          {menus.length === 0 && (
            <Button variant="outline" onClick={handleSeedData} disabled={seeding}>
              {seeding ? 'Adding...' : '🧇 Add Sample Menus'}
            </Button>
          )}
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add Menu
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menus..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? 'All')}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <UtensilsCrossed className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No menus found</p>
          <p className="text-sm">Add your first waffle menu or try sample data</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="overflow-hidden border-border/60 hover:shadow-md transition-shadow group">
                  <div className="relative h-44 bg-muted overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🧇</div>
                    )}
                    <Badge className="absolute top-2 left-2 text-xs">{item.category}</Badge>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => openEdit(item)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3 space-y-1">
                    <p className="font-semibold text-sm truncate">{item.name}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold">฿{item.price}</span>
                      <span className="text-xs text-muted-foreground">Cost: ฿{item.cost}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Profit:</span>
                      <span className={`text-xs font-medium ${item.profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        ฿{item.profit} ({item.price > 0 ? ((item.profit / item.price) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                placeholder="e.g. Matcha Waffle"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v ?? 'Classic' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Selling Price (฿)</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Cost (฿)</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Paste any image URL (Unsplash, etc.)</p>
            </div>
            {form.price > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <span className="text-muted-foreground">Profit: </span>
                <span className={`font-semibold ${form.price - form.cost >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  ฿{(form.price - form.cost).toFixed(2)} ({form.price > 0 ? (((form.price - form.cost) / form.price) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editItem ? 'Update' : 'Add Menu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Menu Item?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
