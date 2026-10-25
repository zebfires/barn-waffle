'use client';

import { MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { copy } from './copy';
import { hasPhone, lineChatUrl, telHref } from './site';
import { FadeUp } from './primitives';

export function ClosingCta() {
  const { lang } = useLanguage();
  const c = copy[lang];

  return (
    <section className="px-5 pb-20 sm:px-6 lg:pb-28">
      <FadeUp>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-border bg-card px-6 py-14 text-center shadow-[0_30px_70px_-50px_rgba(70,40,20,0.7)] sm:px-12">
          <div className="landing-grid absolute inset-0 opacity-60" aria-hidden="true" />
          <div
            className="absolute -top-40 left-1/2 h-[26rem] w-[40rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_70%)]"
            aria-hidden="true"
          />

          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              {c.cta.eyebrow}
            </p>
            <h2
              className={`font-display mx-auto mt-3 max-w-2xl text-3xl font-semibold text-balance sm:text-4xl lg:text-5xl ${
                lang === 'th' ? 'leading-[1.32]' : 'leading-[1.12]'
              }`}
            >
              {c.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground text-pretty">
              {c.cta.subtitle}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={lineChatUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 touch-manipulation sm:w-auto"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                {c.cta.primary}
              </a>

              {hasPhone ? (
                <a
                  href={telHref()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-7 py-4 text-base font-semibold transition-colors hover:bg-secondary touch-manipulation sm:w-auto"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  {c.cta.secondary}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
