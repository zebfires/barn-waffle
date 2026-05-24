'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, MapPin, Clock, QrCode } from 'lucide-react';
import Link from 'next/link';

const ease = [0, 0, 0.2, 1] as [number, number, number, number];

const HIGHLIGHTS = [
  {
    title: 'Hong Kong Waffles',
    desc: 'Classic grid squares, crispy outside, fluffy inside. Plain or with toppings.',
    tag: 'Signature',
  },
  {
    title: 'Bubble Waffles',
    desc: 'Egg puff style, golden and hollow. Perfect with ice cream or fresh fruit.',
    tag: 'Popular',
  },
  {
    title: 'Seasonal Specials',
    desc: 'Rotating flavours made with local ingredients. Ask about today\'s special.',
    tag: 'Limited',
  },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Nav ─────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4">
        <span className="text-base font-bold tracking-tight">🧇 Barn Waffles</span>
        <Link
          href="/login"
          className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Staff Login
        </Link>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">

        {/* Photo */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1528736839-2b6b39d73028?auto=format&fit=crop&w=1600&q=85"
            alt="Golden waffles fresh off the iron, close-up texture"
            className="w-full h-full object-cover"
          />
          {/* Gradient: transparent top to warm-dark bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.03_45/0.95)] via-[oklch(0.12_0.03_45/0.4)] to-transparent" />
        </div>

        {/* Hero text */}
        <div className="relative z-10 px-6 pb-16 sm:px-12 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[oklch(0.85_0.1_60)] mb-4"
          >
            บ้าน Waffles
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55, ease }}
            className="text-5xl sm:text-6xl font-bold leading-[1.05] tracking-tight text-[oklch(0.97_0.01_75)]"
          >
            Waffles worth<br />coming back for.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-5 text-[oklch(0.78_0.04_65)] text-base leading-relaxed max-w-md"
          >
            Handmade Hong Kong and bubble waffles, fresh every day. Crispy, warm, and unapologetically good.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.4, ease }}
            className="mt-8 flex items-center gap-3"
          >
            <a
              href="#menu"
              className="px-6 py-3 rounded-xl bg-[oklch(0.75_0.12_56)] text-[oklch(0.15_0.025_45)] font-bold text-sm hover:brightness-105 active:scale-[0.97] transition-all"
            >
              See the Menu
            </a>
            <a
              href="#info"
              className="px-6 py-3 rounded-xl border border-[oklch(1_0_0/25%)] text-[oklch(0.92_0.01_72)] font-semibold text-sm hover:bg-[oklch(1_0_0/8%)] active:scale-[0.97] transition-all"
            >
              Find Us
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Menu highlights ─────────────────────────────────── */}
      <section id="menu" className="px-6 sm:px-12 py-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-2">What we make</h2>
          <p className="text-muted-foreground text-sm mb-10">Every waffle is made to order. No reheats, no shortcuts.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {HIGHLIGHTS.map(({ title, desc, tag }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45, ease }}
              className="bg-card px-7 py-8"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{tag}</span>
              <h3 className="text-lg font-bold mt-2 mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Divider photo strip ──────────────────────────────── */}
      <div className="h-56 sm:h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519915028121-7d3463d5b1ff?auto=format&fit=crop&w=1600&q=80"
          alt="Bubble waffle with fresh strawberries and cream"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ── Info ────────────────────────────────────────────── */}
      <section id="info" className="px-6 sm:px-12 py-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-3 text-primary">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Hours</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Monday – Friday<br />
              <span className="text-foreground font-semibold">10:00 – 20:00</span><br /><br />
              Saturday – Sunday<br />
              <span className="text-foreground font-semibold">09:00 – 21:00</span>
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3 text-primary">
              <MapPin className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Location</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Thailand<br />
              <span className="text-foreground font-semibold">Barn Waffles · บ้าน Waffles</span>
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3 text-primary">
              <QrCode className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Payment</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cash or PromptPay QR.<br />
              <span className="text-foreground font-semibold">Scan, enter amount, done.</span>
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-border px-6 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <span>🧇 Barn Waffles · บ้าน Waffles · © {new Date().getFullYear()}</span>
        <Link href="/login" className="font-semibold text-foreground hover:text-primary transition-colors">
          Staff Login →
        </Link>
      </footer>

    </div>
  );
}
