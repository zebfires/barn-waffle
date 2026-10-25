'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { copy } from './copy';
import { FadeUp, SectionHeading } from './primitives';

export function HowToOrder() {
  const { lang } = useLanguage();
  const c = copy[lang];

  return (
    <section className="relative border-y border-border/70 bg-secondary/40 px-5 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <SectionHeading eyebrow={c.how.eyebrow} title={c.how.title} />
        </FadeUp>

        <div className="relative mt-12">
          <div
            className="absolute left-[14%] right-[14%] top-9 hidden border-t border-dashed border-border md:block"
            aria-hidden="true"
          />
          <ol className="relative grid gap-6 md:grid-cols-3 md:gap-8">
            {c.how.steps.map((step, index) => (
              <li key={step.title} className="h-full">
                <FadeUp delay={index * 0.08} className="h-full">
                  <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
                    <span className="font-display mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-xl font-semibold text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  </div>
                </FadeUp>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
