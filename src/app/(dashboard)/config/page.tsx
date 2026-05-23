'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Download, Upload, FileJson, CheckCircle2, AlertTriangle,
  Package, UtensilsCrossed, Trash2, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllMenus, getAllInventory, addMenu, addInventoryItem, deleteMenu, deleteInventoryItem } from '@/firebase/firestore';
import type { MenuItem, InventoryItem } from '@/types';

interface ConfigFile {
  version: 1;
  exportedAt: string;
  menus: Omit<MenuItem, 'id'>[];
  inventory: Omit<InventoryItem, 'id'>[];
}

type ImportMode = 'merge' | 'replace';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay },
});

export default function ConfigPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState<ConfigFile | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('merge');

  /* ── Export ────────────────────────────────────────────────────────── */
  async function handleExport() {
    setExporting(true);
    try {
      const [menus, inventory] = await Promise.all([getAllMenus(), getAllInventory()]);

      const config: ConfigFile = {
        version: 1,
        exportedAt: new Date().toISOString(),
        menus: menus.map(({ id, ...rest }) => rest),
        inventory: inventory.map(({ id, ...rest }) => rest),
      };

      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `barn-waffles-config-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`Exported ${menus.length} menu items + ${inventory.length} inventory items`);
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  }

  /* ── File pick → preview ───────────────────────────────────────────── */
  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as ConfigFile;
        if (parsed.version !== 1 || !Array.isArray(parsed.menus) || !Array.isArray(parsed.inventory)) {
          toast.error('Invalid config file format');
          return;
        }
        setPreview(parsed);
      } catch {
        toast.error('Could not parse file — make sure it is a valid JSON config');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  /* ── Import ────────────────────────────────────────────────────────── */
  async function handleImport() {
    if (!preview) return;
    setImporting(true);
    try {
      if (importMode === 'replace') {
        const [existingMenus, existingInventory] = await Promise.all([getAllMenus(), getAllInventory()]);
        await Promise.all([
          ...existingMenus.map((m) => deleteMenu(m.id)),
          ...existingInventory.map((i) => deleteInventoryItem(i.id)),
        ]);
      }

      await Promise.all([
        ...preview.menus.map((m) => addMenu(m as Omit<MenuItem, 'id' | 'createdAt'>)),
        ...preview.inventory.map((i) => addInventoryItem(i as Omit<InventoryItem, 'id'>)),
      ]);

      toast.success(`Imported ${preview.menus.length} menu items + ${preview.inventory.length} inventory items`);
      setPreview(null);
    } catch {
      toast.error('Import failed — check your Firestore rules');
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">

      {/* Header */}
      <motion.div {...fade(0)}>
        <h1 className="text-2xl font-bold tracking-tight">Config Transfer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Export your menu and inventory to a file, then import it into another account.
        </p>
      </motion.div>

      {/* Export card */}
      <motion.div {...fade(0.1)} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-lg">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Export Config</h2>
            <p className="text-xs text-muted-foreground">Downloads a <code className="bg-muted px-1 rounded text-[11px]">.json</code> file with all your menu items and inventory stock</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2.5">
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            <span>Menu items</span>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2.5">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>Inventory + stock levels</span>
          </div>
        </div>

        <Button onClick={handleExport} disabled={exporting} className="w-full gap-2">
          {exporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileJson className="h-4 w-4" />}
          {exporting ? 'Exporting…' : 'Download Config File'}
        </Button>
      </motion.div>

      {/* Import card */}
      <motion.div {...fade(0.2)} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 rounded-lg">
            <Upload className="h-5 w-5 text-sky-500" />
          </div>
          <div>
            <h2 className="font-semibold">Import Config</h2>
            <p className="text-xs text-muted-foreground">Load a config file exported from another account</p>
          </div>
        </div>

        {/* Import mode toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden text-sm">
          <button
            onClick={() => setImportMode('merge')}
            className={`flex-1 px-4 py-2 font-medium transition-colors ${importMode === 'merge' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}
          >
            Merge
          </button>
          <button
            onClick={() => setImportMode('replace')}
            className={`flex-1 px-4 py-2 font-medium transition-colors ${importMode === 'replace' ? 'bg-destructive text-destructive-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}
          >
            Replace all
          </button>
        </div>
        <p className="text-xs text-muted-foreground -mt-2">
          {importMode === 'merge'
            ? 'Adds imported items alongside existing ones. Safe to use.'
            : '⚠️ Deletes ALL current menu and inventory data first, then imports. Cannot be undone.'}
        </p>

        {/* File picker */}
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFilePick} />

        {!preview ? (
          <Button variant="outline" className="w-full gap-2" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> Choose Config File
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Preview summary */}
            <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> File loaded successfully
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Exported: {new Date(preview.exportedAt).toLocaleString()}</p>
                <p className="flex items-center gap-1.5">
                  <UtensilsCrossed className="h-3 w-3" /> {preview.menus.length} menu items
                </p>
                <p className="flex items-center gap-1.5">
                  <Package className="h-3 w-3" /> {preview.inventory.length} inventory items
                </p>
              </div>

              {/* Item names */}
              {preview.menus.length > 0 && (
                <div className="pt-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Menu</p>
                  <div className="flex flex-wrap gap-1">
                    {preview.menus.map((m, i) => (
                      <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{m.name}</span>
                    ))}
                  </div>
                </div>
              )}
              {preview.inventory.length > 0 && (
                <div className="pt-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Inventory</p>
                  <div className="flex flex-wrap gap-1">
                    {preview.inventory.map((inv, i) => (
                      <span key={i} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{inv.ingredient}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {importMode === 'replace' && (
              <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                Replace mode will permanently delete all current menu and inventory data before importing.
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { setPreview(null); }}>
                <Trash2 className="h-3.5 w-3.5" /> Cancel
              </Button>
              <Button
                size="sm"
                className="flex-1 gap-1.5"
                variant={importMode === 'replace' ? 'destructive' : 'default'}
                onClick={handleImport}
                disabled={importing}
              >
                {importing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                {importing ? 'Importing…' : `Import (${importMode})`}
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

    </div>
  );
}
