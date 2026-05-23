'use client';

import dynamic from 'next/dynamic';

const Scene3D = dynamic(() => import('@/components/auth/Scene3D'), { ssr: false });

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* 3D background */}
      <Scene3D />

      {/* Subtle radial vignette to keep form readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_30%,var(--background)_100%)] pointer-events-none z-10 opacity-70" />

      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}
