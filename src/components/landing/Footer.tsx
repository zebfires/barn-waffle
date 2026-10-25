'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { copy } from './copy';
import { SHOP, hasPhone, lineChatUrl, telHref } from './site';

const NAV = [
  { href: '#menu', key: 'menu' as const },
  { href: '#story', key: 'story' as const },
  { href: '#visit', key: 'visit' as const },
];

export function Footer() {
  const { lang } = useLanguage();
  const c = copy[lang];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40 px-5 pb-8 pt-14 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
                <Image
                  src="/logo.png"
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-tight">
                  {lang === 'th' ? SHOP.nameTh : SHOP.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {lang === 'th' ? SHOP.name : SHOP.nameTh}
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {c.footer.tagline}
            </p>
          </div>

          <nav aria-label={c.footer.explore}>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {c.footer.explore}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {c.nav[link.key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {c.footer.contact}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={lineChatUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {SHOP.lineId || 'LINE'}
                </a>
              </li>
              {hasPhone ? (
                <li>
                  <a
                    href={telHref()}
                    className="inline-flex items-center gap-2 text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    <span className="tabular-nums">{SHOP.phone}</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SHOP.name} · {c.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>{c.footer.made}</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-muted-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {c.footer.staff}
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
