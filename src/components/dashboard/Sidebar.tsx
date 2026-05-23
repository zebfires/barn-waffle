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
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

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
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-sidebar-accent/40">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-sidebar-foreground truncate leading-tight">
              {user?.displayName || 'Staff'}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-1.5 px-1">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground text-xs h-8 px-2"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </Button>
          {/* Language toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-center text-xs h-8 px-2 font-semibold gap-1"
            onClick={() => setLang(lang === 'en' ? 'th' : 'en')}
          >
            <span className={lang === 'en' ? 'text-primary' : 'text-muted-foreground'}>EN</span>
            <span className="text-muted-foreground/40">|</span>
            <span className={lang === 'th' ? 'text-primary' : 'text-muted-foreground'}>TH</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="h-8 w-8 p-0 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
            title={t('sign_out')}
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
