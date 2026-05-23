'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { updateDisplayName, updateUserPassword, signOut } from '@/firebase/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sun, Moon, Globe, LogOut, User, KeyRound, ShieldCheck, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfileSettings() {
  const { user, role } = useAuth();
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const router = useRouter();

  const [nameVal, setNameVal] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const initials = (user?.displayName || user?.email || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  async function handleSaveName() {
    if (!user || !nameVal.trim()) return;
    setSavingName(true);
    try {
      await updateDisplayName(user, nameVal.trim());
      toast.success('Name updated');
    } catch {
      toast.error('Failed to update name');
    } finally {
      setSavingName(false);
    }
  }

  async function handleSavePassword() {
    if (!user) return;
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSavingPw(true);
    try {
      await updateUserPassword(user, newPassword);
      toast.success('Password updated');
      setNewPassword('');
    } catch (err: unknown) {
      const msg = (err as Error).message || '';
      if (msg.includes('requires-recent-login')) {
        toast.error('Please sign out and sign back in before changing your password');
      } else {
        toast.error('Failed to update password');
      }
    } finally {
      setSavingPw(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    toast.success('Signed out');
    router.push('/login');
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-left" />
        }
      >
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-sidebar-foreground truncate leading-tight">
            {user?.displayName || 'Staff'}
          </p>
          <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
        </div>
        <span className={cn(
          'text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wide flex-shrink-0',
          role === 'admin'
            ? 'bg-primary/20 text-primary'
            : 'bg-muted text-muted-foreground'
        )}>
          {role ?? 'staff'}
        </span>
      </PopoverTrigger>

      <PopoverContent side="top" align="start" className="w-72 p-0 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{user?.displayName || 'Staff'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        <div className="px-4 py-3 space-y-4">

          {/* Display name */}
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1.5 text-muted-foreground">
              <User className="h-3 w-3" /> Display name
            </Label>
            <div className="flex gap-2">
              <Input
                value={nameVal}
                onChange={(e) => setNameVal(e.target.value)}
                className="h-8 text-sm"
                placeholder="Your name"
              />
              <Button size="sm" className="h-8 px-3 text-xs" onClick={handleSaveName} disabled={savingName}>
                {savingName ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1.5 text-muted-foreground">
              <KeyRound className="h-3 w-3" /> New password
            </Label>
            <div className="flex gap-2">
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-8 text-sm"
                placeholder="Min 6 characters"
              />
              <Button size="sm" variant="outline" className="h-8 px-3 text-xs" onClick={handleSavePassword} disabled={savingPw}>
                {savingPw ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Theme + Language row */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs gap-1.5"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark'
                ? <><Sun className="h-3 w-3" /> Light</>
                : <><Moon className="h-3 w-3" /> Dark</>
              }
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs gap-1.5 font-semibold"
              onClick={() => setLang(lang === 'en' ? 'th' : 'en')}
            >
              <Globe className="h-3 w-3" />
              <span className={lang === 'en' ? 'text-primary' : 'text-muted-foreground'}>EN</span>
              <span className="text-muted-foreground/40">|</span>
              <span className={lang === 'th' ? 'text-primary' : 'text-muted-foreground'}>TH</span>
            </Button>
          </div>

          <Separator />

          {/* Sign out */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
            onClick={handleSignOut}
          >
            <LogOut className="h-3 w-3" /> Sign out
          </Button>

        </div>
      </PopoverContent>
    </Popover>
  );
}
