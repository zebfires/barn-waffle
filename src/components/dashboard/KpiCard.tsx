'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  color?: 'brown' | 'green' | 'amber' | 'red' | 'blue';
  delay?: number;
}

const accentMap = {
  brown: 'bg-primary',
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  blue: 'bg-sky-500',
};

const iconMap = {
  brown: 'text-primary',
  green: 'text-emerald-500',
  amber: 'text-amber-500',
  red: 'text-red-500',
  blue: 'text-sky-500',
};

export default function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'brown',
  delay = 0,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0, 0, 0.2, 1] }}
      className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
        <Icon className={cn('h-4 w-4 opacity-70', iconMap[color])} />
      </div>

      <div>
        <p className="text-2xl font-bold tracking-tight leading-none tabular-nums">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        <div className={cn('h-0.5 flex-1 rounded-full opacity-40', accentMap[color])} />
        {trend !== undefined && (
          <span className={cn('text-xs font-semibold', trend >= 0 ? 'text-emerald-500' : 'text-red-500')}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
