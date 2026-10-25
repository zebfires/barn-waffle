'use client';

import { MessageCircle, Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';
import { copy } from './copy';
import { SHOP, copyText, formatPrice, lineChatUrl, type StoreMenuItem } from './site';

export interface TrayLine {
  item: StoreMenuItem;
  qty: number;
}

export function OrderTray({
  lines,
  count,
  onInc,
  onDec,
  onClear,
}: {
  lines: TrayLine[];
  count: number;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onClear: () => void;
}) {
  const { lang } = useLanguage();
  const c = copy[lang];
  const total = lines.reduce((sum, line) => sum + line.item.price * line.qty, 0);

  if (count === 0) return null;

  const countLabel = `${count} ${count === 1 ? c.tray.itemOne : c.tray.itemMany}`;

  async function send() {
    const message = [
      `${c.tray.title} · ${countLabel}`,
      ...lines.map(
        (line) =>
          `${line.qty} × ${line.item.name[lang]} — ${formatPrice(line.item.price * line.qty, lang)}`
      ),
      `${c.tray.total}: ${formatPrice(total, lang)}`,
    ].join('\n');

    if (SHOP.lineId) {
      window.open(lineChatUrl(message), '_blank', 'noopener,noreferrer');
      return;
    }

    const copied = await copyText(message);
    window.open('https://line.me/', '_blank', 'noopener,noreferrer');

    if (copied) toast.success(c.tray.copied, { description: c.tray.copiedHint });
    else toast.error(c.tray.copyFailed, { description: c.tray.copyFailedHint });
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-[0_20px_50px_-30px_rgba(70,40,20,0.6)] sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-semibold">
          {c.tray.title}
          <span className="ml-2 text-xs font-medium text-muted-foreground">{countLabel}</span>
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline touch-manipulation"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          {c.tray.clear}
        </button>
      </div>

      <ul className="mt-3 hidden max-h-56 space-y-2 overflow-y-auto overscroll-contain pr-1 sm:block">
        {lines.map((line) => (
          <li key={line.item.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate">
              <span className="tabular-nums text-muted-foreground">{line.qty} ×</span>{' '}
              {line.item.name[lang]}
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="tabular-nums text-muted-foreground">
                {formatPrice(line.item.price * line.qty, lang)}
              </span>
              <span className="flex items-center rounded-full border border-border bg-background">
                <button
                  type="button"
                  onClick={() => onDec(line.item.id)}
                  aria-label={`${c.tray.removeItem}: ${line.item.name[lang]}`}
                  className="flex h-9 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground touch-manipulation"
                >
                  <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <span className="min-w-5 text-center text-xs font-semibold tabular-nums">
                  {line.qty}
                </span>
                <button
                  type="button"
                  onClick={() => onInc(line.item.id)}
                  aria-label={`${c.menu.add}: ${line.item.name[lang]}`}
                  className="flex h-9 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground touch-manipulation"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div
        aria-live="polite"
        className="mt-3 flex items-baseline justify-between gap-3 border-t border-border/80 pt-3 text-sm"
      >
        <span className="text-muted-foreground">{c.tray.total}</span>
        <span className="text-lg font-semibold tabular-nums">{formatPrice(total, lang)}</span>
      </div>

      <button
        type="button"
        onClick={send}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 touch-manipulation"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        {c.tray.send}
      </button>

      <p className="mt-2 text-center text-[11px] leading-snug text-muted-foreground">
        {SHOP.lineId ? c.tray.readyHint : c.tray.copiedHint}
      </p>
    </div>
  );
}
