'use client';

import { useEffect, useState } from 'react';
import { getShopConfig, setShopConfig } from '@/firebase/firestore';

export function usePromptPay() {
  const [promptPayId, setPromptPayId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getShopConfig().then((cfg) => {
      setPromptPayId(cfg.promptPayId ?? '');
      setLoading(false);
    });
  }, []);

  async function savePromptPayId(id: string) {
    await setShopConfig({ promptPayId: id.trim() });
    setPromptPayId(id.trim());
  }

  return { promptPayId, loading, savePromptPayId };
}
