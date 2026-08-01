'use client';

import { useEffect, useState } from 'react';
import { getUserPromptPayId, setUserPromptPayId } from '@/firebase/firestore';
import { useAuth } from './useAuth';

export function usePromptPay() {
  const { user } = useAuth();
  const [promptPayId, setPromptPayId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserPromptPayId(user.uid).then((id) => {
        setPromptPayId(id);
        setLoading(false);
      });
    } else {
      setPromptPayId('');
      setLoading(false);
    }
  }, [user]);

  async function savePromptPayId(id: string) {
    if (!user) {
      throw new Error('User not authenticated');
    }
    try {
      await setUserPromptPayId(user.uid, id.trim());
      setPromptPayId(id.trim());
    } catch (error) {
      console.error('Failed to save PromptPay ID:', error);
      throw error; // Re-throw so the UI can handle it
    }
  }

  return { promptPayId, loading, savePromptPayId };
}
