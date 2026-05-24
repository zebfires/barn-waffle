'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signUp } from '@/firebase/auth';
import { logAuthEvent } from '@/firebase/firestore';
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

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const { t, lang, setLang } = useLanguage();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (!turnstileToken) { toast.error('Please complete the verification'); return; }
    setLoading(true);
    try {
      const valid = await verifyTurnstile(turnstileToken);
      if (!valid) { toast.error('Verification failed. Please try again.'); setTurnstileKey(k => k + 1); setTurnstileToken(null); return; }
      const cred = await signUp(email, password, name);
      logAuthEvent(cred.user.uid, email, 'register');
      toast.success('Account created!');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Registration failed');
      setTurnstileKey(k => k + 1);
      setTurnstileToken(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
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
          <CardTitle className="text-lg">{t('create_account')}</CardTitle>
          <CardDescription>{t('create_account_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('full_name')}</Label>
              <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('email')}</Label>
              <Input id="email" type="email" placeholder="you@barnwaffles.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('password')}</Label>
              <Input id="password" type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
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
              {loading ? t('creating_account') : t('create_account')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground pt-0">
          {t('already_have_account')}{' '}
          <Link href="/login" className="ml-1 text-primary font-semibold hover:underline underline-offset-2">
            {t('sign_in_link')}
          </Link>
        </CardFooter>
      </Card>

      <p className="text-center text-xs text-muted-foreground/50 mt-6">
        {t('staff_portal')}
      </p>
    </motion.div>
  );
}
