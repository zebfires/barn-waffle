'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Phone, Sparkles, TrendingUp, Shield, Zap, CheckCircle2, Star } from 'lucide-react';

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

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    description: 'Track sales, profits, and trends as they happen',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Zap,
    title: 'Lightning Fast POS',
    description: 'Process orders in seconds with intuitive interface',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'PromptPay QR with bank-level security',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Sparkles,
    title: 'Smart Inventory',
    description: 'Auto alerts and stock predictions',
    color: 'from-purple-500 to-pink-500'
  }
];

const STATS = [
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
  { value: '<1s', label: 'Load Time' },
  { value: '∞', label: 'Orders' }
];

const TESTIMONIALS = [
  {
    name: 'คุณสมชาย',
    role: 'Owner, Bangkok Waffles',
    content: 'เพิ่มยอดขาย 40% ภายใน 2 เดือน ระบบใช้ง่ายมาก!',
    rating: 5
  },
  {
    name: 'คุณนภา',
    role: 'Manager, Waffle House',  
    content: 'ประหยัดเวลาเกือบครึ่ง ไม่ต้องคำนวณเอง',
    rating: 5
  }
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
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] text-white overflow-x-hidden">

      {/* Premium Navigation */}
      <motion.header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur-lg opacity-50" />
                <div className="relative h-12 w-12 rounded-2xl overflow-hidden ring-2 ring-white/10">
                  <Image src="/logo.png" alt="Barn Waffles" width={48} height={48} className="object-cover" />
                </div>
              </div>
              <div>
                <p className="font-bold text-lg tracking-tight">Barn Waffles</p>
                <p className="text-xs text-gray-400">Smart POS System</p>
              </div>
            </motion.div>

            <Link
              href="/login"
              className="group relative overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-semibold text-sm text-black transition-all hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                Staff Login
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Premium Design */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
        
        {/* Animated Background Grid */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 -left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[128px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[128px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto w-full"
        >
          <div className="text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="flex justify-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-gray-300">Trusted by 100+ waffle shops</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]">
                <span className="block bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                  Run Your Waffle
                </span>
                <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                  Business Smarter
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Complete POS system with real-time analytics, inventory management, and PromptPay payments. 
                <span className="text-white font-semibold"> Everything you need in one platform.</span>
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/login"
                className="group relative overflow-hidden w-full sm:w-auto px-8 py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-lg text-black transition-all hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
              
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-5 rounded-2xl border-2 border-white/10 font-semibold text-lg hover:bg-white/5 hover:border-white/20 transition-all backdrop-blur-sm"
              >
                See How It Works
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-4xl mx-auto"
            >
              {STATS.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mt-2">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
        >
          <div className="w-6 h-10 rounded-full border-2 border-gray-700 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-gray-600"
            />
          </div>
        </motion.div>
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
