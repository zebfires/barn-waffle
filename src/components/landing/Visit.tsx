'use client';

import { Clock, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { copy } from './copy';
import {
  SHOP,
  directionsUrl,
  hasAddress,
  hasPhone,
  lineChatUrl,
  telHref,
} from './site';
import { FadeUp, SectionHeading } from './primitives';

export function Visit() {
  const { lang } = useLanguage();
  const c = copy[lang];
  const hasHours = SHOP.hours.length > 0;

  return (
    <section id="visit" className="relative scroll-mt-24 px-5 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <SectionHeading
              align="left"
              eyebrow={c.visit.eyebrow}
              title={c.visit.title}
              className="max-w-xl"
            />
            <p className="text-base text-muted-foreground text-pretty md:pb-1">{c.visit.subtitle}</p>
          </div>
        </FadeUp>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <FadeUp>
            <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                {c.visit.hoursTitle}
              </h3>

              {hasHours ? (
                <dl className="mt-4 divide-y divide-border/70">
                  {SHOP.hours.map((row) => (
                    <div key={row.day.en} className="flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="text-sm text-muted-foreground">{row.day[lang]}</dt>
                      <dd className="text-sm font-medium tabular-nums">
                        {row.open}–{row.close}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {c.visit.hoursEmpty}
                </p>
              )}
            </div>
          </FadeUp>

          <FadeUp delay={0.06}>
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
              <dl className="space-y-4">
                {hasAddress ? (
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <div className="min-w-0">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {c.visit.addressTitle}
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed">{SHOP.address}</dd>
                    </div>
                  </div>
                ) : null}

                {hasPhone ? (
                  <div className="flex gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <div className="min-w-0">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {c.visit.phoneTitle}
                      </dt>
                      <dd className="mt-1 text-sm">
                        <a
                          href={telHref()}
                          className="font-medium underline-offset-4 hover:underline"
                        >
                          {SHOP.phone}
                        </a>
                      </dd>
                    </div>
                  </div>
                ) : null}

                <div className="flex gap-3">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <div className="min-w-0">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {c.visit.lineTitle}
                    </dt>
                    <dd className="mt-1 text-sm">
                      <a
                        href={lineChatUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline-offset-4 hover:underline"
                      >
                        {SHOP.lineId || c.visit.lineValue}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                {hasAddress ? (
                  <a
                    href={directionsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 touch-manipulation"
                  >
                    <Navigation className="h-4 w-4" aria-hidden="true" />
                    {c.visit.directions}
                  </a>
                ) : null}

                {hasPhone ? (
                  <a
                    href={telHref()}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary touch-manipulation"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {c.visit.call}
                  </a>
                ) : null}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
