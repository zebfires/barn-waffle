'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Phone, Sparkles, TrendingUp, ShieldCheck, Zap,
  CheckCircle2, Star, BarChart3, ShoppingCart, Package, Settings2,
  QrCode, LineChart, Menu, X, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#reviews', label: 'Reviews' },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track sales, profits, and customer trends as they happen with live dashboards',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast POS',
    description: 'Process orders in seconds with our intuitive, tap-and-go interface',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: 'Accept PromptPay QR payments with bank-level encryption and security',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Package,
    title: 'Smart Inventory',
    description: 'Auto stock alerts and AI-powered reorder predictions',
    color: 'from-purple-500 to-pink-500',
  },
];

const STATS = [
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
  { value: '<1s', label: 'Load Time' },
  { value: '100+', label: 'Shops' },
];

const STEPS = [
  {
    icon: Settings2,
    step: '01',
    title: 'Set up in minutes',
    description: 'Import your menu and connect PromptPay in under 10 minutes. No installs, no contracts, no tech headaches.',
  },
  {
    icon: ShoppingCart,
    step: '02',
    title: 'Serve with speed',
    description: 'Tap-and-go checkout, QR payment, and instant receipts keep your line moving — even at peak rush.',
  },
  {
    icon: TrendingUp,
    step: '03',
    title: 'Grow with data',
    description: 'Live dashboards reveal best sellers, peak hours, and stock alerts so you can decide with confidence.',
  },
];

const BENEFITS = [
  'No setup fees or hidden costs',
  'Free updates and new features',
  'Export your data anytime',
  'Works on any device',
  'Thai & English interface',
  'Dedicated support team',
];

const TESTIMONIALS = [
  {
    quote: 'We switched from a paper ledger in June. Now I see exactly what sells and when — revenue is up 22%.',
    name: 'สมหญิง · Som',
    role: 'Owner, Waffle Corner',
    initials: 'S',
  },
  {
    quote: 'PromptPay checkout is so fast my line moves twice as quickly. Customers genuinely love it.',
    name: 'ปุ้ย · Pui',
    role: 'Manager, Crunch Café',
    initials: 'P',
  },
  {
    quote: 'The low-stock alerts alone are worth it. We never run out of batter during peak hours anymore.',
    name: 'เจมส์ · James',
    role: 'Owner, Bangkok Bites',
    initials: 'J',
  },
];

const BARS = [38, 55, 42, 68, 58, 82, 50, 74, 92, 64, 78, 100];
const BAR_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F'];

const MOCK_ORDERS = [
  { id: '#1042', items: 'Classic Waffle ×2 · Matcha Latte', total: '฿240', time: '12:04' },
  { id: '#1041', items: 'Belgian Waffle · Thai Tea', total: '฿185', time: '11:52' },
  { id: '#1040', items: 'Chocolate Waffle ×3', total: '฿315', time: '11:41' },
];

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border bg-card/60',
        className ?? 'border-primary/20 text-primary'
      )}
    >
      {children}
    </span>
  );
}

/* ── Stylized dashboard preview built from pure divs ─────────────── */
function DashboardMockup() {
  return (
    <div className="relative select-none">
      {/* Glow */}
      <div className="absolute -inset-8 bg-gradient-to-r from-primary/25 via-amber-500/15 to-orange-500/25 rounded-[3rem] blur-3xl" aria-hidden />

      <div className="relative rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 overflow-hidden">
        {/* Window bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/40">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 text-[10px] font-semibold text-muted-foreground tracking-wide">Barn Waffles · Smart POS</span>
        </div>

        <div className="flex">
          {/* Fake sidebar */}
          <div className="hidden sm:flex flex-col items-center gap-3 w-12 py-4 border-r border-border bg-muted/20">
            <div className="h-6 w-6 rounded-lg bg-primary/90 flex items-center justify-center text-[10px] font-black text-primary-foreground">B</div>
            <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center"><BarChart3 className="h-4 w-4" /></div>
            <div className="h-8 w-8 rounded-lg text-muted-foreground/50 flex items-center justify-center"><ShoppingCart className="h-4 w-4" /></div>
            <div className="h-8 w-8 rounded-lg text-muted-foreground/50 flex items-center justify-center"><Package className="h-4 w-4" /></div>
            <div className="h-8 w-8 rounded-lg text-muted-foreground/50 flex items-center justify-center"><Settings2 className="h-4 w-4" /></div>
          </div>

          {/* Fake main panel */}
          <div className="flex-1 p-4 sm:p-5 space-y-4 min-w-0">
            {/* Header row */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-muted-foreground">Saturday, 15 Aug</p>
                <p className="text-sm font-bold tracking-tight">Today&apos;s revenue</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" /> +18.4%
              </span>
            </div>

            {/* KPI mini cards */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Sales', value: '฿12,480', color: 'bg-primary' },
                { label: 'Orders', value: '148', color: 'bg-amber-500' },
                { label: 'Avg order', value: '฿84', color: 'bg-emerald-500' },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-xl border border-border bg-muted/30 px-3 py-2.5">
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{kpi.label}</p>
                  <p className="text-sm font-black tracking-tight mt-0.5 tabular-nums">{kpi.value}</p>
                  <div className={cn('h-0.5 w-8 rounded-full mt-1.5', kpi.color)} />
                </div>
              ))}
            </div>

            {/* Chart + order ticket */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_150px] gap-3">
              <div className="rounded-xl border border-border bg-muted/30 p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Revenue · 12 days</p>
                  <span className="text-[9px] text-muted-foreground/60">฿ ฿ ฿</span>
                </div>
                <div className="flex items-end gap-1.5 h-24">
                  {BARS.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          'w-full rounded-t-sm',
                          i === BARS.length - 1
                            ? 'bg-gradient-to-t from-amber-500 to-orange-400'
                            : 'bg-primary/25 dark:bg-primary/30'
                        )}
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-[7px] text-muted-foreground/50">{BAR_DAYS[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order ticket */}
              <div className="hidden lg:block rounded-xl border border-border bg-muted/30 p-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Latest orders</p>
                <div className="space-y-2">
                  {MOCK_ORDERS.map((o) => (
                    <div key={o.id} className="rounded-lg bg-card border border-border/70 px-2 py-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-primary">{o.id}</span>
                        <span className="text-[8px] text-muted-foreground flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{o.time}</span>
                      </div>
                      <p className="text-[8px] text-muted-foreground truncate mt-0.5">{o.items}</p>
                      <p className="text-[10px] font-black tabular-nums mt-0.5">{o.total}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating chips */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-5 -right-2 sm:-right-6 will-change-transform"
      >
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-xl">
          <div className="h-7 w-7 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
            <QrCode className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold">PromptPay paid</p>
            <p className="text-[9px] text-muted-foreground">฿240 · just now</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute -bottom-5 -left-2 sm:-left-6 will-change-transform"
      >
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-xl">
          <div className="h-7 w-7 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold">Low stock alert</p>
            <p className="text-[9px] text-muted-foreground">Belgian Waffle · reorder now</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Page-wide scroll progress for the top progress bar
  const { scrollYProgress: pageProgress } = useScroll();
  const barScale = useTransform(pageProgress, [0, 1], [0, 1]);

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      // Hide nav while scrolling down past the hero, reveal on scroll up
      if (y > lastY + 6 && y > 300) setHidden(true);
      else if (y < lastY - 6 || y <= 300) setHidden(false);
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: barScale }}
        className="fixed top-0 inset-x-0 h-0.5 z-[60] origin-left bg-gradient-to-r from-amber-500 to-orange-500 will-change-transform"
        aria-hidden
      />

      {/* ── Navigation ─────────────────────────────────────────── */}
      <motion.header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,box-shadow] duration-300',
          scrolled ? 'bg-background/95 border-b border-border shadow-lg' : 'bg-transparent border-b border-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: hidden ? -112 : 0 }}
        transition={{ duration: hidden ? 0.3 : 0.5, ease }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur-lg opacity-40" />
                <div className="relative h-11 w-11 rounded-2xl overflow-hidden ring-1 ring-border">
                  <Image src="/logo.png" alt="Barn Waffles" width={44} height={44} className="object-cover" />
                </div>
              </div>
              <div>
                <p className="font-bold text-base tracking-tight leading-tight">Barn Waffles</p>
                <p className="text-[11px] text-muted-foreground">Smart POS System</p>
              </div>
            </motion.div>

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="group relative overflow-hidden hidden sm:inline-flex px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-semibold text-sm text-black transition-all hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.03] active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Staff Login
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden h-10 w-10 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-border bg-background/95"
          >
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-semibold text-sm text-black"
              >
                Staff Login <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.nav>
        )}
      </motion.header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-24 overflow-hidden">

        {/* Parallax background (grid + orbs) — kept on its own composited layer so
            scrolling never repaints the hero content above it */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,black,transparent)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

          <motion.div
            className="absolute top-1/4 -left-32 w-[28rem] h-[28rem] bg-amber-500/15 rounded-full blur-[128px] will-change-transform"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 9, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-32 w-[28rem] h-[28rem] bg-orange-500/15 rounded-full blur-[128px] will-change-transform"
            animate={{ scale: [1.15, 1, 1.15], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 9, repeat: Infinity, delay: 1 }}
          />
        </motion.div>

        <motion.div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="text-center space-y-7">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/70 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-muted-foreground">Trusted by <span className="text-foreground font-semibold">100+ waffle shops</span> in Thailand</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-5"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05]">
                <span className="block bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                  Run Your Waffle
                </span>
                <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                  Business Smarter
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                POS, inventory, analytics, and PromptPay payments — one beautiful platform for your café.{' '}
                <span className="text-foreground font-semibold">Everything you need, nothing you don&apos;t.</span>
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/login"
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-lg text-black hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-[1.03] active:scale-95 transition-all"
              >
                <span className="flex items-center justify-center gap-3">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>

              <a
                href="tel:0949969853"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-border bg-card/50 font-semibold text-lg hover:bg-muted transition-all flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                094-996-9853
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto"
            >
              {STATS.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent tabular-nums">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mt-2">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease }}
            className="mt-16 sm:mt-20"
          >
            <DashboardMockup />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50 will-change-transform"
        >
          <div className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section id="features" className="relative py-24 md:py-32 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="text-center mb-16 md:mb-20">
              <SectionBadge>Powerful features</SectionBadge>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 mt-6">
                Everything You Need to
                <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Scale Your Business
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Built specifically for waffle shops, with features that save time and increase profits
              </p>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <FadeUp key={i} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-colors duration-300"
                  >
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} aria-hidden />

                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="w-full h-full text-white" />
                      </div>

                      <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section id="how-it-works" className="relative py-24 md:py-32 px-6 bg-muted/30 border-y border-border scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="text-center mb-16 md:mb-20">
              <SectionBadge>How it works</SectionBadge>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mt-6">
                From First Waffle to
                <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Full-Speed Service
                </span>
              </h2>
            </div>
          </FadeUp>

          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />

            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <FadeUp key={i} delay={i * 0.15}>
                  <div className="relative text-center px-4">
                    <div className="relative inline-flex mb-6">
                      <div className="absolute inset-0 bg-amber-500/25 blur-2xl rounded-full" aria-hidden />
                      <div className="relative h-20 w-20 rounded-2xl bg-card border border-border shadow-lg flex items-center justify-center">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-black flex items-center justify-center shadow-lg">
                        {step.step.slice(1)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeUp>
            <div>
              <SectionBadge className="border-emerald-500/20 text-emerald-600 dark:text-emerald-400">Why choose us</SectionBadge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 mt-6">
                Built for Your Success
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We understand the challenges of running a waffle shop. That&apos;s why we built a system that just works.
              </p>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                {BENEFITS.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-muted-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-[2rem] blur-2xl" aria-hidden />
              <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl">
                <Image
                  src="/promo.jpg"
                  alt="บ้าน Waffles — fresh waffles"
                  width={600}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
              {/* Floating quote chip */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-5 left-6 right-6 sm:left-auto sm:-right-6 sm:w-64 rounded-xl border border-border bg-card px-4 py-3 shadow-xl will-change-transform"
              >
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-semibold">&quot;Best decision we made for the shop this year.&quot;</p>
                <p className="text-[10px] text-muted-foreground mt-1">— Waffle Corner, Chiang Mai</p>
              </motion.div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section id="reviews" className="relative py-24 md:py-32 px-6 bg-muted/30 border-y border-border scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="text-center mb-16 md:mb-20">
              <SectionBadge>Loved by owners</SectionBadge>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mt-6">
                Shop Owners
                <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Trust Barn Waffles
                </span>
              </h2>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <div className="h-full flex flex-col rounded-3xl bg-card border border-border p-7 hover:border-primary/30 transition-colors duration-300">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed flex-1">&quot;{t.quote}&quot;</p>
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-black text-sm font-black flex items-center justify-center flex-shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <div className="relative rounded-[2.5rem] border border-border bg-card px-8 py-16 md:py-20 text-center overflow-hidden">
              {/* Decorative */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40" aria-hidden />
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[36rem] bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-3xl rounded-full" aria-hidden />

              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-7xl mb-6 inline-block"
                  aria-hidden
                >
                  🧇
                </motion.div>

                <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-5">
                  Ready to Transform
                  <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    Your Waffle Shop?
                  </span>
                </h2>

                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Join 100+ successful waffle shops using Barn Waffles POS. Start free today.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/login"
                    className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-lg text-black hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-[1.03] active:scale-95 transition-all"
                  >
                    <span className="flex items-center justify-center gap-3">
                      Start Free Now
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Link>

                  <a
                    href="tel:0949969853"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-border bg-background/50 font-semibold text-lg hover:bg-muted transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="h-5 w-5" />
                    Talk to Us
                  </a>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="relative border-t border-border px-6 py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl overflow-hidden ring-1 ring-border">
                <Image src="/logo.png" alt="Barn Waffles" width={40} height={40} className="object-cover" />
              </div>
              <div>
                <p className="font-bold">Barn Waffles</p>
                <p className="text-sm text-muted-foreground">บ้าน Waffles · Smart POS</p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </a>
              ))}
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Staff Login
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="tel:0949969853"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" /> 094-996-9853
              </a>
              <LineChart className="h-4 w-4 text-primary/70" aria-hidden />
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">© 2026 Barn Waffles. All rights reserved.</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              Made with <span className="text-amber-500">❤</span> for waffle lovers
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
