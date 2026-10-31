import type { Metadata } from 'next';
import './globals.css';
import StoreShell from '@/components/layout/StoreShell';

export const metadata: Metadata = {
  title: 'Ladydee Minimart Store — Everyday Groceries Delivered Across Nigeria',
  description:
    'Fresh sealed groceries delivered across Lagos and Nigeria. Rice, noodles, cooking oil, canned goods, breakfast cereals, beverages and baby essentials.',
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
