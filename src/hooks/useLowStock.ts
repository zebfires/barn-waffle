'use client';

import { useEffect, useState, useRef } from 'react';
import { onInventorySnapshot } from '@/firebase/firestore';
import { toast } from 'sonner';
import type { InventoryItem } from '@/types';

export function useLowStock() {
  const [lowItems, setLowItems] = useState<InventoryItem[]>([]);
  const [outItems, setOutItems] = useState<InventoryItem[]>([]);
  const alerted = useRef(false);

  useEffect(() => {
    const unsub = onInventorySnapshot((items) => {
      const low = items.filter((i) => i.stock > 0 && i.stock <= i.lowStockAlert);
      const out = items.filter((i) => i.stock === 0);

      setLowItems(low);
      setOutItems(out);

      if (!alerted.current && (low.length > 0 || out.length > 0)) {
        alerted.current = true;

        if (out.length > 0) {
          toast.error(
            `${out.length} item${out.length > 1 ? 's' : ''} out of stock: ${out.map((i) => i.ingredient).join(', ')}`,
            { duration: 6000, id: 'out-of-stock' }
          );
        }

        if (low.length > 0) {
          toast.warning(
            `${low.length} item${low.length > 1 ? 's' : ''} running low: ${low.map((i) => i.ingredient).join(', ')}`,
            { duration: 6000, id: 'low-stock' }
          );
        }
      }
    });

    return unsub;
  }, []);

  return {
    lowItems,
    outItems,
    totalAlerts: lowItems.length + outItems.length,
  };
}
