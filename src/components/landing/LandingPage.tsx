'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { copy } from './copy';
import { Header } from './Header';
import { Hero } from './Hero';
import { Marquee, Scallop } from './primitives';
import { MenuSection } from './MenuSection';
import { Story } from './Story';
import { HowToOrder } from './HowToOrder';
import { Visit } from './Visit';
import { ClosingCta } from './ClosingCta';
import { Footer } from './Footer';

export default function LandingPage() {
  const { lang } = useLanguage();
  const c = copy[lang];

  // Keep the document language in sync so screen readers switch voice with the page,
  // and restore it on the way out so the English dashboard is not marked Thai.
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = 'en';
    };
  }, [lang]);

  return (
    <div className="landing-warm min-h-screen overflow-x-hidden bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        {c.skip}
      </a>

      <Header />

      <main id="main" tabIndex={-1}>
        <Hero />
        {/* The scalloped edge belongs to the tinted strip: parchment bumps hanging into it. */}
        <div className="relative">
          <Marquee items={c.marquee} />
          <Scallop className="absolute inset-x-0 bottom-0 text-background" />
        </div>
        <MenuSection />
        <Story />
        <HowToOrder />
        <Visit />
        <ClosingCta />
      </main>

      <Footer />
    </div>
  );
}
