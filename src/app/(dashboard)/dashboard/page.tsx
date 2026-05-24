'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, Receipt, Clock, AlertCircle, CalendarRange } from 'lucide-react';
import KpiCard from '@/components/dashboard/KpiCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { onOrdersSnapshot } from '@/firebase/firestore';
import type { Order } from '@/types';
import { format, subDays, startOfDay, endOfDay, parseISO, differenceInDays, eachDayOfInterval } from 'date-fns';
import { cn } from '@/lib/utils';

const C = ['oklch(0.75_0.14_52)', 'oklch(0.68_0.11_66)', 'oklch(0.62_0.12_32)', 'oklch(0.78_0.13_56)', 'oklch(0.8_0.09_84)'];

function thb(n: number) { return `฿${n.toLocaleString('th-TH', { maximumFractionDigits: 0 })}`; }

type Preset = 'today' | '7d' | '30d' | '90d' | 'custom';

interface Range { from: Date; to: Date; }

function buildDailySeries(orders: Order[], from: Date, to: Date) {
  const days = eachDayOfInterval({ start: from, end: to });
  const map: Record<string, number> = {};
  days.forEach((d) => { map[format(d, 'yyyy-MM-dd')] = 0; });
  orders.forEach((o) => {
    try {
      const key = format(parseISO(o.createdAt), 'yyyy-MM-dd');
      if (key in map) map[key] = (map[key] || 0) + o.total;
    } catch { /* skip */ }
  });
  const span = differenceInDays(to, from);
  const labelFmt = span <= 14 ? 'd MMM' : span <= 60 ? 'dd/MM' : 'MMM yy';
  return Object.entries(map).map(([date, sales]) => ({
    date: format(parseISO(date), labelFmt),
    sales,
  }));
}

function buildHourly(orders: Order[]) {
  const map: Record<number, number> = {};
  orders.forEach((o) => { try { const h = parseISO(o.createdAt).getHours(); map[h] = (map[h] || 0) + 1; } catch { /* skip */ } });
  return Object.entries(map).filter(([, v]) => v > 0)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([h, orders]) => ({ hour: `${h}h`, orders }));
}

function buildPaymentSplit(orders: Order[]) {
  const map: Record<string, number> = {};
  orders.forEach((o) => { map[o.paymentMethod] = (map[o.paymentMethod] || 0) + 1; });
  return Object.entries(map).map(([name, value]) => ({ name: name.toUpperCase(), value }));
}

function toDateInput(d: Date) { return format(d, 'yyyy-MM-dd'); }

const PRESETS: { key: Preset; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: '7d',    label: '7 days' },
  { key: '30d',   label: '30 days' },
  { key: '90d',   label: '90 days' },
  { key: 'custom', label: 'Custom' },
];

function rangeFor(preset: Preset, customFrom?: Date, customTo?: Date): Range {
  const now = new Date();
  if (preset === 'today')  return { from: startOfDay(now), to: endOfDay(now) };
  if (preset === '7d')     return { from: startOfDay(subDays(now, 6)), to: endOfDay(now) };
  if (preset === '30d')    return { from: startOfDay(subDays(now, 29)), to: endOfDay(now) };
  if (preset === '90d')    return { from: startOfDay(subDays(now, 89)), to: endOfDay(now) };
  return { from: customFrom ?? startOfDay(subDays(now, 6)), to: customTo ?? endOfDay(now) };
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [preset, setPreset] = useState<Preset>('7d');
  const [customFrom, setCustomFrom] = useState<Date>(startOfDay(subDays(new Date(), 6)));
  const [customTo, setCustomTo]     = useState<Date>(endOfDay(new Date()));
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => { const u = onOrdersSnapshot((d) => { setOrders(d); setLoading(false); }); return u; }, []);

  const range = useMemo(() => rangeFor(preset, customFrom, customTo), [preset, customFrom, customTo]);

  const rangeOrders = useMemo(() =>
    orders.filter((o) => {
      try { const d = parseISO(o.createdAt); return d >= range.from && d <= range.to; } catch { return false; }
    }),
    [orders, range]
  );

  const totalSales   = useMemo(() => rangeOrders.reduce((s, o) => s + o.total, 0), [rangeOrders]);
  const avgOrder     = useMemo(() => rangeOrders.length ? totalSales / rangeOrders.length : 0, [totalSales, rangeOrders]);
  const todaySales   = useMemo(() => {
    const s = startOfDay(new Date()).toISOString();
    const e = endOfDay(new Date()).toISOString();
    return orders.filter((o) => o.createdAt >= s && o.createdAt <= e).reduce((acc, o) => acc + o.total, 0);
  }, [orders]);

  const itemCounts = useMemo(() => {
    const map: Record<string, number> = {};
    rangeOrders.forEach((o) => o.items.forEach((item) => { map[item.name] = (map[item.name] || 0) + item.quantity; }));
    return map;
  }, [rangeOrders]);

  const topItems   = useMemo(() => Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 5), [itemCounts]);
  const dailyData  = useMemo(() => buildDailySeries(rangeOrders, range.from, range.to), [rangeOrders, range]);
  const hourlyData = useMemo(() => buildHourly(rangeOrders), [rangeOrders]);
  const paymentData = useMemo(() => buildPaymentSplit(rangeOrders), [rangeOrders]);
  const peakHour   = useMemo(() => hourlyData.length ? [...hourlyData].sort((a, b) => b.orders - a.orders)[0].hour : null, [hourlyData]);

  const rangeLabel = useMemo(() => {
    if (preset !== 'custom') return '';
    return `${format(range.from, 'd MMM yyyy')} – ${format(range.to, 'd MMM yyyy')}`;
  }, [preset, range]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="space-y-2 text-center">
          <div className="text-4xl animate-bounce">🧇</div>
          <p className="text-sm text-muted-foreground">Loading analytics…</p>
        </div>
      </div>
    );
  }

  const fade = (delay: number) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay, ease: [0, 0, 0.2, 1] as [number,number,number,number] } });

  return (
    <div className="space-y-6">

      {/* Page header + date range picker */}
      <motion.div {...fade(0)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            {format(new Date(), 'EEEE, d MMMM yyyy')}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        </div>

        {/* Preset pills + custom picker */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {PRESETS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setPreset(key);
                  setShowCustom(key === 'custom');
                }}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150',
                  preset === key
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {key === 'custom' ? <span className="flex items-center gap-1"><CalendarRange className="h-3 w-3" />{label}</span> : label}
              </button>
            ))}
          </div>

          {/* Custom date inputs */}
          {showCustom && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2"
            >
              <input
                type="date"
                value={toDateInput(customFrom)}
                max={toDateInput(customTo)}
                onChange={(e) => setCustomFrom(startOfDay(new Date(e.target.value)))}
              />
              <span className="text-muted-foreground text-xs font-medium">→</span>
              <input
                type="date"
                value={toDateInput(customTo)}
                min={toDateInput(customFrom)}
                max={toDateInput(new Date())}
                onChange={(e) => setCustomTo(endOfDay(new Date(e.target.value)))}
              />
            </motion.div>
          )}
          {preset !== 'today' && (
            <p className="text-[10px] text-muted-foreground">
              {preset === 'custom' ? rangeLabel : `${format(range.from, 'd MMM')} – ${format(range.to, 'd MMM yyyy')}`}
            </p>
          )}
        </div>
      </motion.div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard title="Today" value={thb(todaySales)} icon={DollarSign} color="brown" delay={0.05} />
        <KpiCard title="Range Total" value={thb(totalSales)} icon={TrendingUp} color="green" delay={0.1} />
        <KpiCard title="Orders" value={rangeOrders.length.toString()} icon={Receipt} color="amber" delay={0.15} />
        <KpiCard title="Avg Order" value={thb(avgOrder)} icon={ShoppingBag} color="blue" delay={0.2} />
      </div>

      {/* Insight strip */}
      <motion.div {...fade(0.25)} className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
        <div className="bg-card px-5 py-4">
          <p className="text-xs text-muted-foreground mb-1">Orders in range</p>
          <p className="text-2xl font-bold">{rangeOrders.length}</p>
          <p className="text-xs text-muted-foreground mt-1">{orders.length} total all-time</p>
        </div>
        <div className="bg-card px-5 py-4">
          <p className="text-xs text-muted-foreground mb-1">Best seller</p>
          <p className="text-2xl font-bold truncate">{topItems[0]?.[0] ?? '—'}</p>
          <p className="text-xs text-muted-foreground mt-1">{topItems[0]?.[1] ?? 0} sold in range</p>
        </div>
        <div className="bg-card px-5 py-4">
          <p className="text-xs text-muted-foreground mb-1">Peak hour</p>
          <p className="text-2xl font-bold">{peakHour ?? '—'}</p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Busiest time</p>
        </div>
      </motion.div>

      {/* Main chart + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div {...fade(0.3)} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-0 pt-5 px-6">
              <CardTitle className="text-sm font-semibold">Revenue by day</CardTitle>
              <CardDescription className="text-xs">
                {format(range.from, 'd MMM')} – {format(range.to, 'd MMM yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 pb-3">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={dailyData} barSize={Math.max(4, Math.min(28, Math.floor(600 / dailyData.length)))}>
                  <CartesianGrid vertical={false} stroke="currentColor" opacity={0.07} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.5 }} axisLine={false} tickLine={false} tickFormatter={(v) => `฿${v}`} width={52} />
                  <Tooltip
                    cursor={{ fill: 'currentColor', opacity: 0.05 }}
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: 12 }}
                    formatter={(v: unknown) => [thb(Number(v)), 'Sales']}
                  />
                  <Bar dataKey="sales" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fade(0.35)} className="space-y-4">
          {/* Payment split */}
          <Card>
            <CardHeader className="pb-0 pt-5 px-5">
              <CardTitle className="text-sm font-semibold">Payment split</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pt-3 pb-4">
              {paymentData.length > 0 ? (
                <div className="space-y-2.5">
                  {paymentData.map((p, i) => {
                    const pct = Math.round((p.value / rangeOrders.length) * 100);
                    return (
                      <div key={p.name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{p.name}</span>
                          <span className="font-semibold">{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: C[i % C.length].replace(/_/g, ' ') }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-4 text-center">No data yet</p>
              )}
            </CardContent>
          </Card>

          {/* Top items */}
          <Card>
            <CardHeader className="pb-0 pt-5 px-5">
              <CardTitle className="text-sm font-semibold">Top items</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pt-3 pb-4">
              {topItems.length > 0 ? (
                <ol className="space-y-2">
                  {topItems.map(([name, count], i) => (
                    <li key={name} className="flex items-center gap-2.5 text-sm">
                      <span className="text-xs font-bold text-muted-foreground w-4 text-right">{i + 1}</span>
                      <span className="flex-1 truncate">{name}</span>
                      <span className="text-xs font-semibold text-primary">{count}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-xs text-muted-foreground py-4 text-center">No items sold yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom row: hourly + recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div {...fade(0.4)} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-0 pt-5 px-6">
              <CardTitle className="text-sm font-semibold">Orders by hour</CardTitle>
              <CardDescription className="text-xs">When customers visit</CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 pb-3">
              {hourlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={hourlyData}>
                    <CartesianGrid vertical={false} stroke="currentColor" opacity={0.07} />
                    <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip
                      contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: 12 }}
                      formatter={(v: unknown) => [Number(v), 'orders']}
                    />
                    <Line type="monotone" dataKey="orders" stroke="var(--primary)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-44 text-muted-foreground">
                  <AlertCircle className="h-6 w-6 mb-2 opacity-30" />
                  <p className="text-xs">No data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fade(0.45)} className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-0 pt-5 px-6">
              <div>
                <CardTitle className="text-sm font-semibold">Recent orders</CardTitle>
                <CardDescription className="text-xs">{Math.min(rangeOrders.length, 6)} latest in range</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-6 pt-4 pb-4">
              {rangeOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <ShoppingBag className="h-7 w-7 mb-2 opacity-30" />
                  <p className="text-xs">No orders in this range</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {rangeOrders.slice(0, 6).map((o) => (
                    <div key={o.id} className="flex items-center justify-between py-2.5 gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{o.items.map((i) => i.name).join(', ')}</p>
                        <p className="text-xs text-muted-foreground">
                          {(() => { try { return format(parseISO(o.createdAt), 'd MMM HH:mm'); } catch { return '—'; } })()}
                          {' · '}{o.paymentMethod.toUpperCase()}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-primary flex-shrink-0">{thb(o.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

    </div>
  );
}
