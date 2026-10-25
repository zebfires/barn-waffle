'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}) {
  const { lang } = useLanguage();

  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          'font-display mt-3 text-3xl font-semibold text-balance sm:text-4xl lg:text-5xl',
          lang === 'th' ? 'leading-[1.32]' : 'leading-[1.12]'
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base text-muted-foreground text-pretty sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}

/** Slow decorative strip. Decorative by design, so it is hidden from assistive tech. */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items, ...items];

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-border/70 bg-secondary/60 py-3.5"
    >
      <div className="marquee-track flex w-max items-center gap-8 pr-8 hover:[animation-play-state:paused]">
        {[0, 1].map((group) => (
          <div key={group} className="flex items-center gap-8">
            {row.map((item, i) => (
              <span
                key={`${group}-${i}`}
                className="flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap"
              >
                {item}
                <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Scalloped edge in `currentColor`, used to soften section boundaries. */
export function Scallop({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('scallop', className)} />;
}
