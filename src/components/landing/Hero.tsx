'use client';

import Image from 'next/image';
import { ArrowDown, Clock, MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { copy } from './copy';
import { SHOP, hasPhone, lineChatUrl, telHref } from './site';

export function Hero() {
  const { lang } = useLanguage();
  const c = copy[lang];
  const accentItalic = lang === 'en' ? 'italic' : '';
  // Thai stacks tone marks above the line, so it needs more leading than Latin.
  const displayLeading = lang === 'th' ? 'leading-[1.3]' : 'leading-[1.05]';

  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36">
      {/* Decorative backdrop: waffle-iron grid and two warm glows. Static on purpose. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="landing-grid absolute inset-0 opacity-70" />
        {/* Radial gradients instead of blur filters: same glow, far cheaper to paint. */}
        <div className="absolute -left-40 -top-56 h-[34rem] w-[34rem] bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_70%)]" />
        <div className="absolute -right-32 top-16 h-[30rem] w-[30rem] bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="max-w-2xl">
          {/* Hero copy renders server-side and stays visible: no entrance opacity, so the
              headline and order button never wait on hydration. */}
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            {c.hero.eyebrow}
          </p>

          <h1
            className={`font-display mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[4.1rem] ${displayLeading}`}
          >
            {c.hero.titleBefore}{' '}
            <span className="relative inline-block text-primary">
              <span className={accentItalic}>{c.hero.titleAccent}</span>
              <svg
                className="absolute -bottom-2 left-0 h-3 w-full text-accent/70"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 8c34-6 66-6 98-2 32 4 62 4 98-3"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            {c.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={lineChatUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 touch-manipulation"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              {c.hero.primary}
            </a>
            <a
              href="#menu"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-7 py-4 text-base font-semibold text-foreground transition-colors hover:bg-secondary touch-manipulation"
            >
              {c.hero.secondary}
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          {hasPhone ? (
            <p className="mt-5 text-sm text-muted-foreground">
              {c.hero.callPrefix}{' '}
              <a
                href={telHref()}
                className="inline-flex items-center gap-1.5 font-semibold text-foreground underline-offset-4 hover:underline"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {SHOP.phone}
              </a>
            </p>
          ) : null}
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            className="absolute -inset-8 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_70%)]"
            aria-hidden="true"
          />
          <figure className="relative overflow-hidden rounded-[2rem] rounded-t-[13rem] border-[6px] border-card bg-muted shadow-[0_36px_80px_-40px_rgba(70,40,20,0.55)]">
            {/* promo.jpg is a portrait poster with a headline band across the top; keep the
                crop below it so the arch frames waffles, not half a sentence. */}
            <Image
              src="/promo.jpg"
              alt={c.hero.photoAlt}
              width={941}
              height={1672}
              priority
              sizes="(min-width: 1024px) 42vw, 90vw"
              className="h-[clamp(19rem,44vh,29rem)] w-full object-cover object-[50%_65%]"
            />
          </figure>

          <div className="absolute -bottom-6 left-2 max-w-[15rem] rotate-[-3deg] rounded-2xl border border-border bg-card px-4 py-3 shadow-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {c.hero.noteTitle}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold leading-snug">
              <Clock className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
              {c.hero.noteBody}
            </p>
          </div>

          <div className="absolute -right-1 top-6 flex h-20 w-20 rotate-6 flex-col items-center justify-center rounded-full border border-dashed border-primary/40 bg-card text-center shadow-md">
            <span className="px-2 text-[9px] font-bold uppercase leading-tight tracking-[0.12em] text-primary">
              {c.hero.stamp}
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}
