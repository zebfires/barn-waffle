'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { signOut } from '@/firebase/auth';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Calculator,
  UtensilsCrossed,
  Package,
  ShoppingCart,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import { useLanguage } from '@/hooks/useLanguage';

const navItems = [
  { href: '/dashboard', key: 'nav_dashboard' as const, icon: LayoutDashboard },
  { href: '/calculator', key: 'nav_calculator' as const, icon: Calculator },
  { href: '/menu', key: 'nav_menu' as const, icon: UtensilsCrossed },
  { href: '/inventory', key: 'nav_inventory' as const, icon: Package },
  { href: '/orders', key: 'nav_orders' as const, icon: ShoppingCart },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();

  async function handleSignOut() {
    await signOut();
    toast.success('Signed out');
    router.push('/login');
  }

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
        {navItems.map(({ href, key, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
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
                {active && (
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
