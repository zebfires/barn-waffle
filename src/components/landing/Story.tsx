'use client';

import Image from 'next/image';
import { Flame, Package, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { copy } from './copy';
import { FadeUp } from './primitives';

const VALUE_ICONS = [Flame, Sparkles, Package];

export function Story() {
  const { lang } = useLanguage();
  const c = copy[lang];

  return (
    <section id="story" className="relative scroll-mt-24 px-5 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeUp>
          <div className="relative mx-auto max-w-sm lg:max-w-none">
            <div
              className="absolute -inset-6 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_70%)]"
              aria-hidden="true"
            />
            <figure className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-[0_28px_60px_-40px_rgba(70,40,20,0.6)] sm:p-12">
              <div className="landing-grid absolute inset-0 opacity-60" aria-hidden="true" />
              <Image
                src="/logo.png"
                alt={c.story.photoAlt}
                width={1024}
                height={1024}
                loading="lazy"
                sizes="(min-width: 1024px) 32vw, 70vw"
                className="relative mx-auto aspect-square w-full max-w-[16rem] rounded-[1.5rem] object-cover"
              />
              <figcaption className="relative mt-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {lang === 'th' ? 'บ้าน Waffles' : 'Barn Waffles'}
              </figcaption>
            </figure>
          </div>
        </FadeUp>

        <FadeUp delay={0.08}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              {c.story.eyebrow}
            </p>
            <h2
              className={`font-display mt-3 text-3xl font-semibold text-balance sm:text-4xl lg:text-[2.75rem] ${
                lang === 'th' ? 'leading-[1.32]' : 'leading-[1.12]'
              }`}
            >
              {c.story.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              {c.story.p1}
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
              {c.story.p2}
            </p>

            <ul className="mt-8 space-y-5">
              {c.story.values.map((value, index) => {
                const Icon = VALUE_ICONS[index] ?? Sparkles;
                return (
                  <li key={value.title} className="flex gap-4">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{value.title}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                        {value.body}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
