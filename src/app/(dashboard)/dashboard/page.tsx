'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, Receipt, Clock, AlertCircle } from 'lucide-react';
import KpiCard from '@/components/dashboard/KpiCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { onOrdersSnapshot } from '@/firebase/firestore';
import type { Order } from '@/types';
import { format, subDays, startOfDay, parseISO } from 'date-fns';

const C = ['oklch(0.75_0.14_52)', 'oklch(0.68_0.11_66)', 'oklch(0.62_0.12_32)', 'oklch(0.78_0.13_56)', 'oklch(0.8_0.09_84)'];

function thb(n: number) { return `฿${n.toLocaleString('th-TH', { maximumFractionDigits: 0 })}`; }

function buildDailySales(orders: Order[], days = 7) {
  const map: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) map[format(subDays(new Date(), i), 'EEE')] = 0;
  orders.forEach((o) => {
    try { const d = format(parseISO(o.createdAt), 'EEE'); if (d in map) map[d] = (map[d] || 0) + o.total; } catch { /* skip */ }
  });
  return Object.entries(map).map(([date, sales]) => ({ date, sales }));
}

function buildHourly(orders: Order[]) {
  const map: Record<number, number> = {};
  orders.forEach((o) => { try { const h = parseISO(o.createdAt).getHours(); map[h] = (map[h] || 0) + 1; } catch { /* skip */ } });
  return Object.entries(map).filter(([, v]) => v > 0).map(([h, orders]) => ({ hour: `${h}h`, orders }));
}

function buildPaymentSplit(orders: Order[]) {
  const map: Record<string, number> = {};
  orders.forEach((o) => { map[o.paymentMethod] = (map[o.paymentMethod] || 0) + 1; });
  return Object.entries(map).map(([name, value]) => ({ name: name.toUpperCase(), value }));
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const u = onOrdersSnapshot((d) => { setOrders(d); setLoading(false); }); return u; }, []);

  const today = startOfDay(new Date()).toISOString();

  const dailySales = useMemo(() => orders.filter((o) => o.createdAt >= today).reduce((s, o) => s + o.total, 0), [orders, today]);
  const weeklyOrders = useMemo(() => orders.filter((o) => o.createdAt >= subDays(new Date(), 7).toISOString()), [orders]);
  const weeklySales = useMemo(() => weeklyOrders.reduce((s, o) => s + o.total, 0), [weeklyOrders]);
  const monthlySales = useMemo(() => orders.filter((o) => o.createdAt >= subDays(new Date(), 30).toISOString()).reduce((s, o) => s + o.total, 0), [orders]);
  const avgOrder = useMemo(() => (weeklyOrders.length ? weeklySales / weeklyOrders.length : 0), [weeklySales, weeklyOrders]);

  const itemCounts = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => o.items.forEach((item) => { map[item.name] = (map[item.name] || 0) + item.quantity; }));
    return map;
  }, [orders]);

  const topItems = useMemo(() => Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 5), [itemCounts]);
  const dailyData = useMemo(() => buildDailySales(orders), [orders]);
  const hourlyData = useMemo(() => buildHourly(orders), [orders]);
  const paymentData = useMemo(() => buildPaymentSplit(orders), [orders]);
  const peakHour = useMemo(() => hourlyData.length ? [...hourlyData].sort((a, b) => b.orders - a.orders)[0].hour : null, [hourlyData]);

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
    <div className="space-y-8">

      {/* Page header */}
      <motion.div {...fade(0)}>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          {format(new Date(), 'EEEE, d MMMM yyyy')}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
      </motion.div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard title="Today" value={thb(dailySales)} icon={DollarSign} color="brown" delay={0.05} />
        <KpiCard title="This Week" value={thb(weeklySales)} icon={TrendingUp} color="green" delay={0.1} />
        <KpiCard title="This Month" value={thb(monthlySales)} icon={Receipt} color="amber" delay={0.15} />
        <KpiCard title="Avg Order" value={thb(avgOrder)} subtitle="7-day avg" icon={ShoppingBag} color="blue" delay={0.2} />
      </div>

      {/* Insight strip */}
      <motion.div {...fade(0.25)} className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
        <div className="bg-card px-5 py-4">
          <p className="text-xs text-muted-foreground mb-1">Total orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
          <p className="text-xs text-muted-foreground mt-1">{weeklyOrders.length} this week</p>
        </div>
        <div className="bg-card px-5 py-4">
          <p className="text-xs text-muted-foreground mb-1">Best seller</p>
          <p className="text-2xl font-bold truncate">{topItems[0]?.[0] ?? '—'}</p>
          <p className="text-xs text-muted-foreground mt-1">{topItems[0]?.[1] ?? 0} sold total</p>
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
              <CardTitle className="text-sm font-semibold">Revenue — last 7 days</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pt-4 pb-3">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={dailyData} barSize={28}>
                  <CartesianGrid vertical={false} stroke="currentColor" opacity={0.07} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.5 }} axisLine={false} tickLine={false} />
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
                    const pct = Math.round((p.value / orders.length) * 100);
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
            <CardHeader className="pb-0 pt-5 px-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Recent orders</CardTitle>
                <CardDescription className="text-xs">{Math.min(orders.length, 6)} latest transactions</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-6 pt-4 pb-4">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <ShoppingBag className="h-7 w-7 mb-2 opacity-30" />
                  <p className="text-xs">No orders yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {orders.slice(0, 6).map((o) => (
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
