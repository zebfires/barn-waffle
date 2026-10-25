'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { copy } from './copy';
import { CATEGORIES, MENU, formatPrice, type MenuCategory } from './site';
import { FadeUp, SectionHeading } from './primitives';
import { OrderTray, type TrayLine } from './OrderTray';

type Filter = MenuCategory | 'All';

const FILTERS: Filter[] = ['All', ...CATEGORIES];

export function MenuSection() {
  const { lang } = useLanguage();
  const c = copy[lang];
  const [active, setActive] = useState<Filter>('All');
  const [tray, setTray] = useState<Record<string, number>>({});

  const visible = active === 'All' ? MENU : MENU.filter((item) => item.category === active);
  const lines: TrayLine[] = MENU.filter((item) => tray[item.id]).map((item) => ({
    item,
    qty: tray[item.id],
  }));
  const count = lines.reduce((sum, line) => sum + line.qty, 0);

  function add(id: string) {
    setTray((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  }

  function remove(id: string) {
    setTray((current) => {
      const next = { ...current };
      const qty = (next[id] ?? 0) - 1;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  return (
    <section id="menu" className="relative scroll-mt-24 px-5 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <SectionHeading eyebrow={c.menu.eyebrow} title={c.menu.title} subtitle={c.menu.subtitle} />
        </FadeUp>

        <FadeUp delay={0.05}>
          <div
            role="group"
            aria-label={c.menu.title}
            className="-mx-5 mt-8 flex snap-x gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
          >
            {FILTERS.map((filter) => {
              const selected = active === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActive(filter)}
                  aria-pressed={selected}
                  className={cn(
                    'snap-start whitespace-nowrap rounded-full border px-4 py-3 text-sm font-medium transition-colors touch-manipulation',
                    selected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  {filter === 'All' ? c.menu.all : c.menu.categories[filter]}
                </button>
              );
            })}
          </div>
        </FadeUp>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            {visible.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
                {c.menu.empty}
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {visible.map((item, index) => {
                  const qty = tray[item.id] ?? 0;
                  const other: 'en' | 'th' = lang === 'en' ? 'th' : 'en';

                  return (
                    <FadeUp key={item.id} delay={index * 0.06}>
                      <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none">
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                          <Image
                            src={item.image}
                            alt={item.name[lang]}
                            width={900}
                            height={675}
                            loading="lazy"
                            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:transform-none"
                          />
                          <span className="absolute left-3 top-3 rounded-full border border-border/60 bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground shadow-sm">
                            {c.menu.categories[item.category]}
                          </span>
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="font-display text-xl font-semibold leading-snug">
                            {item.name[lang]}
                          </h3>
                          <p className="mt-0.5 text-xs text-muted-foreground">{item.name[other]}</p>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {item.description[lang]}
                          </p>

                          <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                            <p className="text-lg font-semibold tabular-nums">
                              {formatPrice(item.price, lang)}
                            </p>

                            {qty === 0 ? (
                              <button
                                type="button"
                                onClick={() => add(item.id)}
                                aria-label={`${c.menu.add}: ${item.name[lang]}`}
                                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground touch-manipulation"
                              >
                                <Plus className="h-4 w-4" aria-hidden="true" />
                                {c.menu.add}
                              </button>
                            ) : (
                              <div className="flex items-center rounded-full border border-border bg-background">
                                <button
                                  type="button"
                                  onClick={() => remove(item.id)}
                                  aria-label={`${c.menu.remove}: ${item.name[lang]}`}
                                  className="flex h-11 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground touch-manipulation"
                                >
                                  <Minus className="h-4 w-4" aria-hidden="true" />
                                </button>
                                <span className="min-w-6 text-center text-sm font-semibold tabular-nums">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => add(item.id)}
                                  aria-label={`${c.menu.add}: ${item.name[lang]}`}
                                  className="flex h-11 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground touch-manipulation"
                                >
                                  <Plus className="h-4 w-4" aria-hidden="true" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    </FadeUp>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="sticky bottom-4 z-30 lg:top-28">
            {count > 0 ? (
              <OrderTray
                lines={lines}
                count={count}
                onInc={add}
                onDec={remove}
                onClear={() => setTray({})}
              />
            ) : (
              // Desktop keeps the column occupied so the grid never reflows mid-shop.
              <div className="hidden rounded-3xl border border-dashed border-border bg-card/70 p-6 lg:block">
                <p className="font-display text-lg font-semibold">{c.tray.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {c.tray.empty}
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
