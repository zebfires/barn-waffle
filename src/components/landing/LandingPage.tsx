'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Phone, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';

const Waffle3D = dynamic(() => import('./Waffle3D'), { ssr: false });

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

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 4,
}));

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

  // Nav blur on scroll
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Promo image tilt on mouse move
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 120, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 120, damping: 20 });

  function handlePromoMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateX.set(((e.clientY - cy) / rect.height) * -10);
    rotateY.set(((e.clientX - cx) / rect.width) * 10);
  }
  function handlePromoLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div className="min-h-screen bg-[oklch(0.14_0.022_45)] text-[oklch(0.93_0.012_72)] overflow-x-hidden">

      {/* Nav — blurs in on scroll */}
      <motion.header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-300"
        animate={{
          backgroundColor: scrolled ? 'oklch(0.14 0.022 45 / 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'blur(0px)',
          borderBottom: scrolled ? '1px solid oklch(1 0 0 / 0.06)' : '1px solid transparent',
        }}
      >
        <motion.div
          className="flex items-center gap-2.5"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-white/10">
            <Image src="/logo.png" alt="Barn Waffles" width={32} height={32} className="object-cover w-full h-full" />
          </div>
          <span className="font-bold text-sm tracking-tight">Barn Waffles</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-[oklch(0.75_0.12_56)] text-[oklch(0.14_0.022_45)] hover:bg-[oklch(0.8_0.13_56)] transition-all hover:scale-105 active:scale-95"
          >
            Staff Login <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>
      </motion.header>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pt-20">

        {/* 3D Waffle Background */}
        <Waffle3D />

        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[oklch(0.75_0.12_56)]/20 to-transparent blur-[120px]"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[oklch(0.68_0.13_52)]/15 to-transparent blur-[100px]"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
        </div>
              style={{ 
                left: `${10 + i * 12}%`, 
                top: `${20 + (i % 3) * 25}%`,
        </div>

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }} 
          className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full py-20"
        >
          
          {/* Left: Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[oklch(0.75_0.12_56)]/10 border border-[oklch(0.75_0.12_56)]/20 backdrop-blur-sm">
                <span className="text-xl">🧇</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[oklch(0.75_0.12_56)]">
                  บ้าน Waffles
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95]">
                <span className="block">Smart</span>
                <span className="block text-[oklch(0.75_0.12_56)]">Café</span>
                <span className="block text-[oklch(0.62_0.038_58)] text-4xl md:text-5xl mt-2">Management</span>
              </h1>

              <p className="text-lg md:text-xl text-[oklch(0.62_0.038_58)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Complete POS system with orders, inventory, QR payments, and real-time analytics. Built for waffle shops that want to scale.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/login"
                className="group relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-2xl bg-[oklch(0.75_0.12_56)] text-[oklch(0.14_0.022_45)] font-bold text-base hover:bg-[oklch(0.8_0.13_56)] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-[oklch(0.75_0.12_56)]/30"
              >
                <span>Staff Dashboard</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/10 text-base font-semibold hover:border-[oklch(0.75_0.12_56)]/50 hover:bg-white/5 transition-all backdrop-blur-sm"
              >
                Learn more
                <ChevronDown className="h-4 w-4" />
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease }}
              className="flex items-center gap-8 justify-center lg:justify-start pt-4"
            >
              <div>
                <p className="text-3xl font-black text-[oklch(0.75_0.12_56)]">100%</p>
                <p className="text-xs text-[oklch(0.55_0.03_56)] uppercase tracking-wider">Cloud-based</p>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <p className="text-3xl font-black text-[oklch(0.75_0.12_56)]">24/7</p>
                <p className="text-xs text-[oklch(0.55_0.03_56)] uppercase tracking-wider">Access</p>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <p className="text-3xl font-black text-[oklch(0.75_0.12_56)]">∞</p>
                <p className="text-xs text-[oklch(0.55_0.03_56)] uppercase tracking-wider">Orders</p>
              </div>
            </motion.div>
          </div>

          {/* Right: Visual Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Logo Card - Large */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.75_0.12_56)] to-[oklch(0.68_0.13_52)] p-8 shadow-2xl"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[oklch(0.14_0.022_45)] uppercase tracking-wider mb-2">Barn Waffles</p>
                    <p className="text-2xl font-black text-[oklch(0.14_0.022_45)]">Smart POS</p>
                  </div>
                  <div className="h-20 w-20 rounded-2xl overflow-hidden ring-4 ring-[oklch(0.14_0.022_45)]/20 shadow-xl">
                    <Image src="/logo.png" alt="Barn Waffles" width={80} height={80} className="object-cover w-full h-full" />
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 text-8xl opacity-10">🧇</div>
              </motion.div>

              {/* Feature Cards */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative overflow-hidden rounded-2xl bg-[oklch(0.19_0.028_46)] border border-white/[0.08] p-6 backdrop-blur-sm"
              >
                <div className="text-3xl mb-3">📊</div>
                <p className="font-bold text-sm mb-1">Analytics</p>
                <p className="text-xs text-[oklch(0.55_0.03_56)]">Real-time insights</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative overflow-hidden rounded-2xl bg-[oklch(0.19_0.028_46)] border border-white/[0.08] p-6 backdrop-blur-sm"
              >
                <div className="text-3xl mb-3">💳</div>
                <p className="font-bold text-sm mb-1">QR Payments</p>
                <p className="text-xs text-[oklch(0.55_0.03_56)]">PromptPay ready</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative overflow-hidden rounded-2xl bg-[oklch(0.19_0.028_46)] border border-white/[0.08] p-6 backdrop-blur-sm"
              >
                <div className="text-3xl mb-3">📦</div>
                <p className="font-bold text-sm mb-1">Inventory</p>
                <p className="text-xs text-[oklch(0.55_0.03_56)]">Stock tracking</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative overflow-hidden rounded-2xl bg-[oklch(0.19_0.028_46)] border border-white/[0.08] p-6 backdrop-blur-sm"
              >
                <div className="text-3xl mb-3">🧮</div>
                <p className="font-bold text-sm mb-1">Calculator</p>
                <p className="text-xs text-[oklch(0.55_0.03_56)]">Profit margins</p>
              </motion.div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[oklch(0.75_0.12_56)]/20 to-[oklch(0.68_0.13_52)]/20 blur-3xl -z-10 opacity-50" />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#features"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
        >
          <span className="text-xs uppercase tracking-wider font-semibold">Scroll</span>
          <ChevronDown className="h-5 w-5" />
        </motion.a>
      </section>

      {/* Promo photo + brand pillars */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Promo image with 3D tilt */}
          <FadeUp>
            <motion.div
              style={{ rotateX: springX, rotateY: springY, transformPerspective: 800 }}
              onMouseMove={handlePromoMove}
              onMouseLeave={handlePromoLeave}
              className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/[0.06] mx-auto max-w-sm lg:max-w-full cursor-pointer"
            >
              <Image
                src="/promo.jpg"
                alt="บ้าน Waffle — แป้งนุ่ม อร่อยทุกค่ำ ทำสดใหม่ทุกวัน"
                width={540}
                height={960}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Sheen overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
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
                  <motion.div
                    whileHover={{ scale: 1.04, borderColor: 'oklch(0.75 0.12 56 / 0.35)' }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl bg-[oklch(0.19_0.028_46)] border border-white/[0.06] cursor-default"
                  >
                    <span className="text-2xl block mb-2">{emoji}</span>
                    <p className="font-bold text-sm leading-tight">{th}</p>
                    <p className="text-[oklch(0.55_0.03_56)] text-xs mt-0.5">{en}</p>
                  </motion.div>
                </FadeUp>
              ))}
            </div>

            {/* Phone CTA */}
            <FadeUp delay={0.45}>
              <motion.a
                href="tel:0949969853"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[oklch(0.19_0.028_46)] border border-white/[0.08] hover:border-[oklch(0.75_0.12_56)]/40 transition-colors group"
              >
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-8 w-8 rounded-full bg-[oklch(0.75_0.12_56)]/10 flex items-center justify-center group-hover:bg-[oklch(0.75_0.12_56)]/20 transition-colors"
                >
                  <Phone className="h-4 w-4 text-[oklch(0.75_0.12_56)]" />
                </motion.span>
                <span>
                  <span className="block text-[10px] uppercase tracking-widest text-[oklch(0.55_0.03_56)] font-semibold">โทรสั่ง / Call us</span>
                  <span className="block font-black text-lg tracking-wide">094-996-9853</span>
                </span>
              </motion.a>
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

          <div className="space-y-1">
            {MENU_ITEMS.map(({ name, price, tag }, i) => (
              <FadeUp key={name} delay={i * 0.07}>
                <motion.div
                  whileHover={{ x: 6, backgroundColor: 'oklch(0.19 0.028 46 / 0.6)' }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between py-4 px-3 rounded-xl border-b border-white/[0.05] cursor-default"
                >
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
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-[oklch(0.52_0.14_48)] blur-[100px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.14, 0.08] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <FadeUp className="relative z-10 max-w-xl mx-auto space-y-6">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
            className="text-6xl inline-block"
          >
            🧇
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Ready to run a<br />smarter shop?
          </h2>
          <p className="text-[oklch(0.62_0.038_58)] text-base">
            Log in to your staff dashboard and start taking orders.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/login"
              className="shimmer-btn relative overflow-hidden inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[oklch(0.75_0.12_56)] text-[oklch(0.14_0.022_45)] font-bold text-base hover:bg-[oklch(0.8_0.13_56)] transition-colors shadow-xl shadow-[oklch(0.52_0.14_48)]/20"
            >
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
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
