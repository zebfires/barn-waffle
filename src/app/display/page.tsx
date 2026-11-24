'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import generatePayload from 'promptpay-qr';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, QrCode, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { usePromptPay } from '@/hooks/usePromptPay';
import { onOrdersSnapshot } from '@/firebase/firestore';
import type { Order } from '@/types';

const PAID_HOLD_MS = 8000;

export default function DisplayPage() {
  const { user, loading } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();
  const { promptPayId: myPromptPayId } = usePromptPay();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const th = lang === 'th';

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // The display is driven by the same orders the POS writes — no extra collection.
  useEffect(() => {
    if (!user) return;
    return onOrdersSnapshot(setOrders, (err) => {
      setError(err.code || err.message || 'read failed');
    });
  }, [user]);

  // Re-render each second so the "payment received" screen expires by itself.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keep the customer-facing screen awake while this page is open.
  useEffect(() => {
    const nav = navigator as unknown as {
      wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> };
    };
    if (!nav.wakeLock) return;

    let released = false;
    let sentinel: { release: () => Promise<void> } | null = null;

    nav.wakeLock
      .request('screen')
      .then((lock) => {
        if (released) lock.release().catch(() => {});
        else sentinel = lock;
      })
      .catch(() => {});

    return () => {
      released = true;
      sentinel?.release().catch(() => {});
    };
  }, []);

  const awaiting = orders.find((o) => o.status === 'awaiting_payment');
  const justPaid = orders.find(
    (o) => o.status === 'paid' && !!o.paidAt && now - Date.parse(o.paidAt) < PAID_HOLD_MS
  );
  const qrId = awaiting?.promptPayId || myPromptPayId;
  const showingQr = !!awaiting && !!qrId;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Image src="/logo.png" alt="Barn Waffles" width={64} height={64} className="rounded-full animate-pulse" />
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="flex flex-col items-center gap-1 pt-6 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Barn Waffles" width={28} height={28} className="rounded-full" />
          <span className="text-sm font-semibold tracking-tight">Barn Waffles · บ้าน Waffles</span>
        </div>
        {error && (
          <p className="flex items-center gap-1.5 text-[11px] text-destructive">
            <AlertTriangle className="h-3 w-3" />
            {th ? 'อ่านคำสั่งซื้อไม่ได้' : 'Cannot read orders'}: {error}
          </p>
        )}
      </header>

      <div className="flex-1 flex items-center justify-center px-6 pb-10">
        <AnimatePresence mode="wait">
          {showingQr && awaiting && qrId ? (
            <motion.div
              key={`qr-${awaiting.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="w-full max-w-lg flex flex-col items-center gap-5 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {th ? 'สแกนเพื่อชำระเงิน' : 'Scan to pay'}
              </p>

              <div className="text-5xl font-bold text-primary tabular-nums">
                ฿{awaiting.total.toLocaleString()}
              </div>

              <div className="bg-white rounded-3xl p-4 shadow-xl w-[min(80vw,26rem)] [&_svg]:block [&_svg]:w-full [&_svg]:h-auto">
                <QRCodeSVG
                  value={generatePayload(qrId, { amount: awaiting.total })}
                  size={420}
                  bgColor="#ffffff"
                  fgColor="#1a1a1a"
                  level="M"
                  imageSettings={{
                    src: '/logo.png',
                    height: 52,
                    width: 52,
                    excavate: true,
                  }}
                />
              </div>

              <div className="space-y-1">
                <p className="text-lg font-semibold">
                  {th ? 'สแกนจ่ายด้วยแอปธนาคาร' : 'Scan with any banking app'}
                </p>
                <p className="text-sm text-muted-foreground">
                  PromptPay · {qrId}
                </p>
              </div>

              {awaiting.items.length > 0 && (
                <p className="text-xs text-muted-foreground max-w-sm truncate">
                  {awaiting.items.map((i) => `${i.name} ×${i.quantity}`).join(' · ')}
                </p>
              )}
            </motion.div>
          ) : justPaid ? (
            <motion.div
              key="paid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <CheckCircle2 className="h-24 w-24 text-emerald-500" />
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {th ? 'ชำระเงินเรียบร้อย' : 'Payment received'}
              </p>
              <p className="text-4xl font-bold tabular-nums">฿{justPaid.total.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                {th ? 'ขอบคุณที่อุดหนุน 🧇' : 'Thank you! 🧇'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center">
                <QrCode className="h-10 w-10 text-muted-foreground opacity-60" />
              </div>
              <p className="text-2xl font-semibold">{th ? 'พร้อมรับออเดอร์ถัดไป' : 'Ready for the next order'}</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                {th
                  ? 'เปิดหน้านี้ค้างไว้ที่มือถือฝั่งลูกค้า QR จะขึ้นเองเมื่อพนักงานวางออเดอร์'
                  : 'Leave this page open on the customer-facing phone — the QR appears as soon as a QR order is placed.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
