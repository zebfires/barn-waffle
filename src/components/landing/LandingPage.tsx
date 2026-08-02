'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, Phone, Sparkles, TrendingUp, Shield, Zap, 
  CheckCircle2, Star 
} from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const FEATURES = [
  {
    icon: TrendingUp,
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
    icon: Shield,
    title: 'Secure Payments',
    description: 'Accept PromptPay QR payments with bank-level encryption and security',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Sparkles,
    title: 'Smart Inventory',
    description: 'Auto stock alerts and AI-powered reorder predictions',
    color: 'from-purple-500 to-pink-500',
  }
];

const STATS = [
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
  { value: '<1s', label: 'Load Time' },
  { value: '100+', label: 'Shops' }
];

const BENEFITS = [
  'No setup fees or hidden costs',
  'Free updates and new features',
  'Export your data anytime',
  'Works on any device',
  'Thai & English interface',
  'Dedicated support team'
];

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] text-white overflow-x-hidden">

      {/* Navigation */}
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
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
        
        {/* Background Grid */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 -left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[128px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[128px]"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
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
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-gray-300">Trusted by 100+ waffle shops in Thailand</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
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
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/login"
                className="group w-full sm:w-auto px-8 py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-lg text-black hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all"
              >
                <span className="flex items-center justify-center gap-3">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
              
              <a
                href="tel:0949969853"
                className="w-full sm:w-auto px-8 py-5 rounded-2xl border-2 border-white/10 font-semibold text-lg hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2"
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
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
        >
          <div className="w-6 h-10 rounded-full border-2 border-gray-700 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-gray-600"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold mb-6">
                POWERFUL FEATURES
              </span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                Everything You Need to
                <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Scale Your Business
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Built specifically for waffle shops, with features that save time and increase profits
              </p>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <FadeUp key={i} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
                  >
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold mb-6">
                WHY CHOOSE US
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                Built for Your Success
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                We understand the challenges of running a waffle shop. That's why we built a system that just works.
              </p>
              
              <div className="space-y-4">
                {BENEFITS.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-3xl" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10">
                <Image
                  src="/promo.jpg"
                  alt="บ้าน Waffle"
                  width={600}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeUp>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-7xl mb-8 inline-block"
            >
              🧇
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              Ready to Transform
              <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Your Waffle Shop?
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-12">
              Join 100+ successful waffle shops using Barn Waffles POS. Start free today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="group w-full sm:w-auto px-8 py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-lg text-black hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all"
              >
                <span className="flex items-center justify-center gap-3">
                  Start Free Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
              
              <a
                href="tel:0949969853"
                className="w-full sm:w-auto px-8 py-5 rounded-2xl border-2 border-white/10 font-semibold text-lg hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Talk to Us
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 px-6 py-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl overflow-hidden">
                <Image src="/logo.png" alt="Barn Waffles" width={40} height={40} className="object-cover" />
              </div>
              <div>
                <p className="font-bold">Barn Waffles</p>
                <p className="text-sm text-gray-500">บ้าน Waffles · Smart POS</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 text-center md:text-right">
              <p>© 2024 Barn Waffles. All rights reserved.</p>
              <p className="mt-1">Made with ❤️ for waffle lovers</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
