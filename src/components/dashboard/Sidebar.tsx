'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calculator,
  UtensilsCrossed,
  Package,
  ShoppingCart,
} from 'lucide-react';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import { useLanguage } from '@/hooks/useLanguage';
import { useLowStock } from '@/hooks/useLowStock';

const mainItems = [
  { href: '/dashboard', key: 'nav_dashboard' as const, icon: LayoutDashboard },
  { href: '/orders', key: 'nav_orders' as const, icon: ShoppingCart },
  { href: '/menu', key: 'nav_menu' as const, icon: UtensilsCrossed },
  { href: '/inventory', key: 'nav_inventory' as const, icon: Package },
  { href: '/calculator', key: 'nav_calculator' as const, icon: Calculator },
];


interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { totalAlerts, outItems } = useLowStock();

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl overflow-hidden flex-shrink-0">
            <Image src="/logo.png" alt="Barn Waffles Logo" width={36} height={36} className="object-cover w-full h-full" />
          </div>
          <div>
            <p className="font-bold text-sidebar-foreground leading-tight tracking-tight">Barn Waffles</p>
            <p className="text-xs text-muted-foreground">บ้าน Waffles · Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 pt-1 pb-2">
          {t('nav_main_menu')}
        </p>
        {mainItems.map(({ href, key, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={onClose}>
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className={cn('h-4 w-4 flex-shrink-0', active ? 'opacity-100' : 'opacity-70')} />
                <span className="flex-1">{t(key)}</span>
                {href === '/inventory' && totalAlerts > 0 && (
                  <span className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none',
                    outItems.length > 0
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-amber-500 text-white'
                  )}>
                    {totalAlerts}
                  </span>
                )}
                {active && href !== '/inventory' && (
                  <span className="h-1.5 w-1.5 rounded-full bg-sidebar-primary-foreground opacity-70" />
                )}
              </motion.div>
            </Link>
          );
        })}

      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <ProfileSettings />
      </div>
    </div>
  );
}
