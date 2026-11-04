'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import TopAnnouncement from './TopAnnouncement';
import Header from './Header';
import CategoryPillBar from './CategoryPillBar';
import MobileBottomNav from './MobileBottomNav';
import Footer from './Footer';
import WelcomeLeadModal from '@/components/ui/WelcomeLeadModal';
import PeriodicEngagementModal from '@/components/ui/PeriodicEngagementModal';
import AIAssistantWidget from '@/components/ui/AIAssistantWidget';
import UsernameSetupModal from '@/components/ui/UsernameSetupModal';

/**
 * Client-side wrapper that renders the standard store chrome
 * (header, category pills, footer, mobile nav) for customer-facing pages.
 * Completely hidden on admin routes so the admin portal has its own UI.
 */
export default function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/admin-portal') ||
    pathname?.startsWith('/adeadmin112');

  if (isAdmin) {
    // Admin pages get NO store chrome – they render their own layout
    return <>{children}</>;
  }

  return (
    <>
      <div>
        <TopAnnouncement />
        <Header />
        <Suspense fallback={<div className="h-11 bg-[#fafbf9] border-b border-brand-line-2" />}>
          <CategoryPillBar />
        </Suspense>
        <main className="pb-16 lg:pb-0">{children}</main>
      </div>
      <Footer />
      <MobileBottomNav />
      <WelcomeLeadModal />
      <PeriodicEngagementModal />
      <AIAssistantWidget />
      <UsernameSetupModal />
    </>
  );
}