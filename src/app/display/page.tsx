'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import generatePayload from 'promptpay-qr';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, QrCode } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { onPaymentSessionSnapshot } from '@/firebase/firestore';
import type { PaymentSession } from '@/types';

const PAID_HOLD_MS = 8000;

export default function DisplayPage() {
  const { user, loading } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [paidDismissed, setPaidDismissed] = useState(false);
  const th = lang === 'th';

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    return onPaymentSessionSnapshot(setSession);
  }, [user]);

  // After showing "payment received", drop back to the idle screen.
  useEffect(() => {
    if (session?.status !== 'paid') {
      setPaidDismissed(false);
      return;
    }
    setPaidDismissed(false);
    const timer = setTimeout(() => setPaidDismissed(true), PAID_HOLD_MS);
    return () => clearTimeout(timer);
  }, [session?.status, session?.paidAt]);

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

  const showingQr = session?.status === 'awaiting' && !!session.promptPayId;
  // Ignore an old "paid" doc (e.g. page opened long after the sale) so a fresh
  // display doesn't greet the next customer with a payment confirmation.
  const paidAtMs = session?.paidAt ? Date.parse(session.paidAt) : NaN;
  const paidIsFresh = Number.isFinite(paidAtMs) && Date.now() - paidAtMs < PAID_HOLD_MS;
  const showingPaid = session?.status === 'paid' && !paidDismissed && paidIsFresh;

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
      <header className="flex items-center justify-center gap-2 pt-6 pb-2 flex-shrink-0">
        <Image src="/logo.png" alt="Barn Waffles" width={28} height={28} className="rounded-full" />
        <span className="text-sm font-semibold tracking-tight">Barn Waffles · บ้าน Waffles</span>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 pb-10">
        <AnimatePresence mode="wait">
          {showingQr && session ? (
            <motion.div
              key={`qr-${session.orderId}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="w-full max-w-lg flex flex-col items-center gap-5 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {th ? 'สแกนเพื่อชำระเงิน' : 'Scan to pay'}
              </p>

              <div className="text-5xl font-bold text-primary tabular-nums">
                ฿{session.total.toLocaleString()}
              </div>

              <div className="bg-white rounded-3xl p-4 shadow-xl w-[min(80vw,26rem)] [&_svg]:block [&_svg]:w-full [&_svg]:h-auto">
                <QRCodeSVG
                  value={generatePayload(session.promptPayId, { amount: session.total })}
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
                  {th ? 'PromptPay' : 'PromptPay'} · {session.promptPayId}
                </p>
              </div>

              {session.items.length > 0 && (
                <p className="text-xs text-muted-foreground max-w-sm truncate">
                  {session.items.map((i) => `${i.name} ×${i.quantity}`).join(' · ')}
                </p>
              )}
            </motion.div>
          ) : showingPaid && session ? (
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
              <p className="text-4xl font-bold tabular-nums">฿{session.total.toLocaleString()}</p>
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
                  : 'Leave this page open on the customer-facing phone — the QR appears as soon as an order is placed.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
