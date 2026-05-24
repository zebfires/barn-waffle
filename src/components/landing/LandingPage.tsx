'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Phone, ChevronDown } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const PILLARS = [
  { emoji: '🌾', th: 'แป้งนุ่ม', en: 'Soft dough' },
  { emoji: '✨', th: 'วัตถุดิบคุณภาพดี', en: 'Quality ingredients' },
  { emoji: '🔥', th: 'ทำสดใหม่ทุกออเดอร์', en: 'Fresh every order' },
  { emoji: '🏠', th: 'อร่อยเหมือนกินที่บ้าน', en: 'Tastes like home' },
];

const MENU_ITEMS = [
  { name: 'Classic Waffle', price: '59', tag: 'Staff fave' },
  { name: 'Cheese Waffle', price: '69', tag: null },
  { name: 'Nutella Waffle', price: '79', tag: 'Best seller' },
  { name: 'Waffle + Drink Set', price: '99', tag: 'Value' },
];

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-[oklch(0.14_0.022_45)] text-[oklch(0.93_0.012_72)] overflow-x-hidden">

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-white/10">
            <Image src="/logo.png" alt="Barn Waffles" width={32} height={32} className="object-cover w-full h-full" />
          </div>
          <span className="font-bold text-sm tracking-tight">Barn Waffles</span>
        </div>
        <Link
          href="/login"
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-[oklch(0.75_0.12_56)] text-[oklch(0.14_0.022_45)] hover:bg-[oklch(0.8_0.13_56)] transition-colors"
        >
          Staff Login <ArrowRight className="h-3 w-3" />
        </Link>
      </header>

      {/* Hero */}
      <section ref={heroRef} className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Warm glow bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[oklch(0.52_0.14_48)] opacity-[0.12] blur-[120px]" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[oklch(0.68_0.13_52)] opacity-[0.07] blur-[80px]" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 flex flex-col items-center gap-6">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease }}
            className="relative"
          >
            <div className="h-24 w-24 rounded-full overflow-hidden ring-2 ring-[oklch(0.75_0.12_56)]/40 shadow-2xl">
              <Image src="/logo.png" alt="Barn Waffles" width={96} height={96} className="object-cover w-full h-full" />
            </div>
            <div className="absolute -bottom-1 -right-1 text-2xl">🧇</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease }}
            className="space-y-3"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[oklch(0.75_0.12_56)]">
              บ้าน Waffles · Smart POS
            </p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
              Barn<br />
              <span className="text-[oklch(0.75_0.12_56)]">Waffles</span>
            </h1>
            <p className="text-[oklch(0.62_0.038_58)] text-base md:text-lg max-w-md mx-auto leading-relaxed">
              The complete shop management system for your waffle business. Orders, inventory, QR payments and analytics all in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease }}
            className="flex items-center gap-3"
          >
            <Link
              href="/login"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[oklch(0.75_0.12_56)] text-[oklch(0.14_0.022_45)] font-bold text-sm hover:bg-[oklch(0.8_0.13_56)] transition-all hover:scale-105 active:scale-95"
            >
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-sm font-medium text-[oklch(0.62_0.038_58)] hover:border-white/20 hover:text-[oklch(0.93_0.012_72)] transition-colors"
            >
              Learn more
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </section>

      {/* Promo photo + brand pillars */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Promo image */}
          <FadeUp>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/[0.06] mx-auto max-w-sm lg:max-w-full">
              <Image
                src="/promo.jpg"
                alt="บ้าน Waffle — แป้งนุ่ม อร่อยทุกค่ำ ทำสดใหม่ทุกวัน"
                width={540}
                height={960}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </FadeUp>

          {/* Brand info */}
          <div className="space-y-8">
            <FadeUp delay={0.1}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[oklch(0.75_0.12_56)] mb-2">บ้าน Waffle</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                อร่อยทุกค่ำ<br />
                <span className="text-[oklch(0.75_0.12_56)]">ทำสดใหม่ทุกวัน</span>
              </h2>
              <p className="text-[oklch(0.62_0.038_58)] mt-3 text-base leading-relaxed">
                ความอร่อย ที่อบอุ่นเหมือนบ้าน — Homemade flavour, baked fresh for every order.
              </p>
            </FadeUp>

            {/* 4 pillars */}
            <div className="grid grid-cols-2 gap-3">
              {PILLARS.map(({ emoji, th, en }, i) => (
                <FadeUp key={th} delay={0.15 + i * 0.07}>
                  <div className="p-4 rounded-2xl bg-[oklch(0.19_0.028_46)] border border-white/[0.06]">
                    <span className="text-2xl block mb-2">{emoji}</span>
                    <p className="font-bold text-sm leading-tight">{th}</p>
                    <p className="text-[oklch(0.55_0.03_56)] text-xs mt-0.5">{en}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* Phone CTA */}
            <FadeUp delay={0.45}>
              <a
                href="tel:0949969853"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[oklch(0.19_0.028_46)] border border-white/[0.08] hover:border-[oklch(0.75_0.12_56)]/40 transition-all group"
              >
                <span className="h-8 w-8 rounded-full bg-[oklch(0.75_0.12_56)]/10 flex items-center justify-center group-hover:bg-[oklch(0.75_0.12_56)]/20 transition-colors">
                  <Phone className="h-4 w-4 text-[oklch(0.75_0.12_56)]" />
                </span>
                <span>
                  <span className="block text-[10px] uppercase tracking-widest text-[oklch(0.55_0.03_56)] font-semibold">โทรสั่ง / Call us</span>
                  <span className="block font-black text-lg tracking-wide">094-996-9853</span>
                </span>
              </a>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Menu showcase */}
      <section className="py-24 px-6 bg-[oklch(0.17_0.026_46)]">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[oklch(0.75_0.12_56)] mb-3">เมนู / Menu</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Warm, crispy,<br />made to order.</h2>
          </FadeUp>

          <div className="space-y-3">
            {MENU_ITEMS.map(({ name, price, tag }, i) => (
              <FadeUp key={name} delay={i * 0.07}>
                <div className="flex items-center justify-between py-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🧇</span>
                    <span className="font-semibold text-base">{name}</span>
                    {tag && (
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[oklch(0.75_0.12_56)]/15 text-[oklch(0.75_0.12_56)]">
                        {tag}
                      </span>
                    )}
                  </div>
                  <span className="font-black text-xl text-[oklch(0.75_0.12_56)]">฿{price}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-[oklch(0.52_0.14_48)] opacity-[0.1] blur-[100px]" />
        </div>
        <FadeUp className="relative z-10 max-w-xl mx-auto space-y-6">
          <div className="text-6xl">🧇</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Ready to run a<br />smarter shop?
          </h2>
          <p className="text-[oklch(0.62_0.038_58)] text-base">
            Log in to your staff dashboard and start taking orders.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[oklch(0.75_0.12_56)] text-[oklch(0.14_0.022_45)] font-bold text-base hover:bg-[oklch(0.8_0.13_56)] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[oklch(0.52_0.14_48)]/20"
          >
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeUp>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[oklch(0.45_0.025_52)]">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full overflow-hidden">
            <Image src="/logo.png" alt="" width={20} height={20} className="object-cover w-full h-full" />
          </div>
          <span>Barn Waffles · บ้าน Waffles</span>
        </div>
        <span>Staff portal — authorised access only</span>
      </footer>

    </div>
  );
}
