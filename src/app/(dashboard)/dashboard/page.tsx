'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  TrendingDown,
  Clock,
  Star,
  AlertCircle,
  Receipt,
} from 'lucide-react';
import KpiCard from '@/components/dashboard/KpiCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { onOrdersSnapshot } from '@/firebase/firestore';
import type { Order } from '@/types';
import { format, subDays, startOfDay, parseISO } from 'date-fns';

const CHART_COLORS = ['#7c5c3a', '#b88a5e', '#d4a874', '#e8c99a', '#f5e6d3'];

function formatThb(n: number) {
  return `฿${n.toLocaleString('th-TH', { maximumFractionDigits: 0 })}`;
}

function buildDailySales(orders: Order[], days = 7) {
  const map: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    map[format(subDays(new Date(), i), 'MM/dd')] = 0;
  }
  orders.forEach((o) => {
    try {
      const d = format(parseISO(o.createdAt), 'MM/dd');
      if (d in map) map[d] = (map[d] || 0) + o.total;
    } catch { /* skip */ }
  });
  return Object.entries(map).map(([date, sales]) => ({ date, sales }));
}

function buildHourly(orders: Order[]) {
  const map: Record<number, number> = {};
  for (let h = 0; h < 24; h++) map[h] = 0;
  orders.forEach((o) => {
    try {
      const h = parseISO(o.createdAt).getHours();
      map[h] = (map[h] || 0) + o.total;
    } catch { /* skip */ }
  });
  return Object.entries(map)
    .filter(([, v]) => v > 0)
    .map(([hour, sales]) => ({ hour: `${hour}:00`, sales }));
}

function buildPaymentSplit(orders: Order[]) {
  const map: Record<string, number> = {};
  orders.forEach((o) => {
    map[o.paymentMethod] = (map[o.paymentMethod] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onOrdersSnapshot((data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const today = startOfDay(new Date()).toISOString();

  const dailySales = useMemo(
    () => orders.filter((o) => o.createdAt >= today).reduce((s, o) => s + o.total, 0),
    [orders, today]
  );
  const weeklyOrders = useMemo(
    () => orders.filter((o) => o.createdAt >= subDays(new Date(), 7).toISOString()),
    [orders]
  );
  const weeklySales = useMemo(() => weeklyOrders.reduce((s, o) => s + o.total, 0), [weeklyOrders]);
  const monthlySales = useMemo(
    () =>
      orders
        .filter((o) => o.createdAt >= subDays(new Date(), 30).toISOString())
        .reduce((s, o) => s + o.total, 0),
    [orders]
  );
  const avgOrder = useMemo(
    () => (weeklyOrders.length ? weeklySales / weeklyOrders.length : 0),
    [weeklySales, weeklyOrders]
  );

  const itemCounts = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) =>
      o.items.forEach((item) => {
        map[item.name] = (map[item.name] || 0) + item.quantity;
      })
    );
    return map;
  }, [orders]);

  const bestItem = useMemo(() => {
    const entries = Object.entries(itemCounts);
    return entries.length ? entries.sort((a, b) => b[1] - a[1])[0][0] : 'N/A';
  }, [itemCounts]);

  const worstItem = useMemo(() => {
    const entries = Object.entries(itemCounts);
    return entries.length ? entries.sort((a, b) => a[1] - b[1])[0][0] : 'N/A';
  }, [itemCounts]);

  const dailyData = useMemo(() => buildDailySales(orders), [orders]);
  const hourlyData = useMemo(() => buildHourly(orders), [orders]);
  const paymentData = useMemo(() => buildPaymentSplit(orders), [orders]);
  const peakHour = useMemo(
    () => (hourlyData.length ? hourlyData.sort((a, b) => b.sales - a.sales)[0].hour : 'N/A'),
    [hourlyData]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-3">🧇</div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          {format(new Date(), 'EEEE, MMMM d, yyyy')} · Barn Waffles Analytics
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Today's Sales" value={formatThb(dailySales)} icon={DollarSign} color="brown" delay={0} />
        <KpiCard title="Weekly Sales" value={formatThb(weeklySales)} icon={TrendingUp} color="green" delay={0.05} />
        <KpiCard title="Monthly Sales" value={formatThb(monthlySales)} icon={Receipt} color="amber" delay={0.1} />
        <KpiCard title="Avg Order Value" value={formatThb(avgOrder)} subtitle="Last 7 days" icon={ShoppingBag} color="blue" delay={0.15} />
      </div>

      {/* Best/Worst + Peak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <Star className="h-8 w-8 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Best Seller</p>
                <p className="font-bold text-foreground">{bestItem}</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {itemCounts[bestItem] || 0} sold
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Worst Seller</p>
                <p className="font-bold text-foreground">{worstItem}</p>
                <Badge variant="destructive" className="text-xs mt-1">
                  {itemCounts[worstItem] || 0} sold
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Peak Sales Time</p>
                <p className="font-bold text-foreground">{peakHour}</p>
                <Badge variant="outline" className="text-xs mt-1">Busiest hour</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Daily Sales (7 Days)</CardTitle>
              <CardDescription>Revenue trend this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `฿${v}`} />
                  <Tooltip formatter={(v: unknown) => formatThb(Number(v))} />
                  <Bar dataKey="sales" fill="#7c5c3a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Hourly Sales Pattern</CardTitle>
              <CardDescription>Revenue by hour of day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `฿${v}`} />
                  <Tooltip formatter={(v: unknown) => formatThb(Number(v))} />
                  <Line type="monotone" dataKey="sales" stroke="#b88a5e" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Payment Methods</CardTitle>
              <CardDescription>Order split by payment type</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {paymentData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {paymentData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-sm">No order data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent Orders</CardTitle>
              <CardDescription>Latest {Math.min(orders.length, 5)} transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <ShoppingBag className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-sm">No orders yet. Create one in POS!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{o.items.map((i) => i.name).join(', ')}</p>
                        <p className="text-xs text-muted-foreground">
                          {(() => {
                            try { return format(parseISO(o.createdAt), 'MMM d, HH:mm'); } catch { return '—'; }
                          })()}
                          {' · '}
                          {o.paymentMethod.toUpperCase()}
                        </p>
                      </div>
                      <span className="font-semibold text-primary">{formatThb(o.total)}</span>
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
