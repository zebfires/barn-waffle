'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Menu, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { copy } from './copy';
import { SHOP, lineChatUrl } from './site';

const NAV = [
  { href: '#menu', key: 'menu' as const },
  { href: '#story', key: 'story' as const },
  { href: '#visit', key: 'visit' as const },
];

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  const c = copy[lang];

  return (
    <div
      role="group"
      aria-label={c.nav.language}
      className={cn(
        'flex items-center rounded-full border border-border bg-card p-1 shadow-sm',
        className
      )}
    >
      {(['en', 'th'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={cn(
            'h-9 w-10 rounded-full text-[11px] font-bold uppercase tracking-wide transition-colors touch-manipulation',
            lang === code
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { lang } = useLanguage();
  const c = copy[lang];
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      if (y > lastY + 8 && y > 280) setHidden(true);
      else if (y < lastY - 8 || y <= 280) setHidden(false);
      lastY = y;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none',
        hidden && !open ? '-translate-y-full' : 'translate-y-0',
        scrolled || open
          ? 'border-b border-border/80 bg-background shadow-[0_10px_30px_-26px_rgba(80,45,20,0.55)]'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <Image
              src="/logo.png"
              alt=""
              width={44}
              height={44}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-bold leading-tight tracking-tight">
              {lang === 'th' ? SHOP.nameTh : SHOP.name}
            </span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              {lang === 'th' ? SHOP.name : SHOP.nameTh}
            </span>
          </span>
        </Link>

        <nav aria-label={c.nav.menu} className="hidden items-center gap-7 md:flex">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground underline-offset-[6px] transition-colors hover:text-foreground hover:underline"
            >
              {c.nav[link.key]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Always visible: Thai customers should not have to open the menu to switch. */}
          <LanguageToggle />

          <a
            href={lineChatUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 touch-manipulation sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {c.nav.order}
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="landing-mobile-nav"
            aria-label={open ? c.nav.closeMenu : c.nav.menuToggle}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground touch-manipulation md:hidden"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="landing-mobile-nav"
          aria-label={c.nav.menu}
          className="border-t border-border/80 bg-background px-5 pb-6 pt-3 md:hidden"
        >
          <ul className="space-y-1">
            {NAV.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {c.nav[link.key]}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-3 border-t border-border/80 pt-4">
            <a
              href={lineChatUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground touch-manipulation"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {c.nav.order}
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
