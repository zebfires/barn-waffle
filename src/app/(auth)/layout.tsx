import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.28_0.04_50/30%)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom-right,oklch(0.72_0.1_55/10%)_0%,transparent_50%)] pointer-events-none" />

      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border border-border bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-border/80 transition-all hover:scale-105 active:scale-95"
      >
        <ArrowLeft className="h-3 w-3" /> Home
      </Link>

      {children}
    </div>
  );
}
