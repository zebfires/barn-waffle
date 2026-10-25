import type { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

// Real origin for OpenGraph URLs; Vercel and a custom env var both work.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'บ้าน Waffles · Barn Waffles — Warm waffles, made to order',
  description:
    'Golden, butter-rich waffles with real pearl sugar, pressed after you order. Pick your waffles, send the order on LINE, and collect them warm.',
  openGraph: {
    title: 'บ้าน Waffles · Barn Waffles',
    description:
      'Golden, butter-rich waffles with real pearl sugar, pressed after you order. Order on LINE.',
    type: 'website',
    images: ['/promo.jpg'],
  },
};

export default function RootPage() {
  return <LandingPage />;
}
