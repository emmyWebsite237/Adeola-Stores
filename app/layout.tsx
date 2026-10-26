import type { Metadata } from 'next';
import './globals.css';
import TopAnnouncement from '@/components/layout/TopAnnouncement';
import Header from '@/components/layout/Header';
import CategoryPillBar from '@/components/layout/CategoryPillBar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Footer from '@/components/layout/Footer';

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
      <body className="min-h-screen flex flex-col justify-between selection:bg-brand-green selection:text-white">
        <div>
          <TopAnnouncement />
          <Header />
          <CategoryPillBar />
          <main className="pb-16 lg:pb-0">{children}</main>
        </div>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
