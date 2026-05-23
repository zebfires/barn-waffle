'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signIn, signInWithGoogle } from '@/firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, Globe } from 'lucide-react';
import Image from 'next/image';
import { Turnstile } from '@marsidev/react-turnstile';
import { verifyTurnstile } from '@/actions/verifyTurnstile';
import { useLanguage } from '@/hooks/useLanguage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const { t, lang, setLang } = useLanguage();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!turnstileToken) { toast.error('Please complete the verification'); return; }
    setLoading(true);
    try {
      const valid = await verifyTurnstile(turnstileToken);
      if (!valid) { toast.error('Verification failed. Please try again.'); setTurnstileKey(k => k + 1); setTurnstileToken(null); return; }
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Sign-in failed');
      setTurnstileKey(k => k + 1);
      setTurnstileToken(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (!turnstileToken) { toast.error('Please complete the verification'); return; }
    setGoogleLoading(true);
    try {
      const valid = await verifyTurnstile(turnstileToken);
      if (!valid) { toast.error('Verification failed. Please try again.'); setTurnstileKey(k => k + 1); setTurnstileToken(null); return; }
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Google sign-in failed');
      setTurnstileKey(k => k + 1);
      setTurnstileToken(null);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full max-w-sm px-4"
    >
      {/* Language switcher */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => setLang(lang === 'en' ? 'th' : 'en')}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-border bg-card hover:bg-accent transition-colors"
        >
          <Globe className="h-3 w-3" />
          <span className={lang === 'en' ? 'text-primary' : 'text-muted-foreground'}>EN</span>
          <span className="text-muted-foreground/40">|</span>
          <span className={lang === 'th' ? 'text-primary' : 'text-muted-foreground'}>TH</span>
        </button>
      </div>

      {/* Brand header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, type: 'spring' }}
          className="inline-flex items-center justify-center h-20 w-20 rounded-full overflow-hidden mb-4 shadow-lg ring-2 ring-border"
        >
          <Image src="/logo.png" alt="Barn Waffles" width={80} height={80} className="object-cover w-full h-full" />
        </motion.div>
        <h1 className="text-2xl font-bold tracking-tight">Barn Waffles</h1>
        <p className="text-muted-foreground text-sm mt-1">บ้าน Waffles · Smart Dashboard</p>
      </div>

      <Card className="shadow-2xl border-border/40">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{t('welcome_back')}</CardTitle>
          <CardDescription>{t('sign_in_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSignIn} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@barnwaffles.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {/* Turnstile widget */}
            <div className="flex flex-col items-center gap-2">
              <Turnstile
                key={turnstileKey}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={setTurnstileToken}
                onExpire={() => setTurnstileToken(null)}
                onError={() => { toast.error('Verification error, please refresh'); setTurnstileToken(null); }}
                options={{ theme: 'dark', size: 'flexible' }}
              />
              {turnstileToken && (
                <p className="text-xs text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> {t('verified')}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full h-10 font-semibold" disabled={loading || !turnstileToken}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? t('signing_in') : t('sign_in')}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">{t('or_continue_with')}</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-10"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <svg className="h-4 w-4 mr-2 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Google
          </Button>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground pt-0">
          {t('no_account')}{' '}
          <Link href="/register" className="ml-1 text-primary font-semibold hover:underline underline-offset-2">
            {t('register_here')}
          </Link>
        </CardFooter>
      </Card>

      <p className="text-center text-xs text-muted-foreground/50 mt-6">
        {t('staff_portal')}
      </p>
    </motion.div>
  );
}
