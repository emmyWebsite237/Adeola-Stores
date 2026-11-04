import type { Metadata } from 'next';
import './globals.css';
import StoreShell from '@/components/layout/StoreShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://ladydeeminimartstores.vercel.app'),
  title: 'Ladydee Minimart Stores — Fresh Nigerian Groceries Delivered Across Lagos',
  description:
    'Fresh sealed groceries and authentic Nigerian foodstuffs delivered across Lagos. Mama Gold Rice, Kings Oil, Yam tubers, Golden Penny Semovita, fresh peppers and household provisions with same-day doorstep delivery.',
  keywords: [
    'Ladydee Minimart',
    'Ladydee Minimart Stores',
    'Lagos groceries',
    'online supermarket Lagos',
    'Nigerian foodstuffs delivery',
    'Jollof rice ingredients',
    'Lekki grocery delivery',
    'Ikeja food market'
  ],
  openGraph: {
    title: 'Ladydee Minimart Stores — Fresh Nigerian Groceries Delivered Across Lagos 🛒🍅',
    description:
      'Order fresh food items, rice, oils, seasonings, and recipe bundles with Same-Day Lagos Delivery. Secure Paystack & Ladydee Wallet checkout.',
    url: 'https://ladydeeminimartstores.vercel.app',
    siteName: 'Ladydee Minimart Stores',
    images: [
      {
        url: '/images/scene-hero.png',
        width: 1200,
        height: 630,
        alt: 'Ladydee Minimart Stores Lagos Nigeria',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ladydee Minimart Stores — Lagos Online Grocery Market',
    description:
      'Authentic Nigerian food staples delivered to your doorstep in Lagos. Fast same-day dispatch and zero-hassle ordering.',
    images: ['/images/scene-hero.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between selection:bg-brand-green selection:text-white overflow-y-auto">
        <StoreShell>{children}</StoreShell>
      </body>
    </html>
  );
}