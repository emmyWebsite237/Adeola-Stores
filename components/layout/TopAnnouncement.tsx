'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck, Phone, Sparkles, ChefHat, ShieldCheck, Tag } from 'lucide-react';
import { useSiteSettings } from '@/lib/useSiteSettings';

export default function TopAnnouncement() {
  const pathname = usePathname();
  const { settings } = useSiteSettings();

  // Hide on admin routes
  if (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/admin-portal') ||
    pathname?.startsWith('/adeadmin112')
  ) {
    return null;
  }

  const cleanPhone = (settings.phone || '').replace(/[^0-9+]/g, '');

  const tickerItems = [
    {
      icon: <Truck className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />,
      text: settings.announcement || 'Free delivery on orders over ₦50,000 across Lagos',
      link: '/terms',
    },
    {
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />,
      text: 'Same-Day Lagos Doorstep Delivery on orders before 12:00 PM',
      link: '/shop',
    },
    {
      icon: <ChefHat className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />,
      text: 'Cook Tonight: Explore authentic Nigerian recipes & one-click ingredient bundles',
      link: '/cook',
    },
    {
      icon: <Tag className="w-3.5 h-3.5 text-coral-400 flex-shrink-0" />,
      text: 'Wallet Payments Now Live! Top up & pay securely with your 4-digit PIN',
      link: '/account',
    },
    {
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />,
      text: '100% Guaranteed Freshness & Fair Open-Market Prices across Lagos',
      link: '/terms',
    },
  ];

  return (
    <div className="bg-[#0f291e] text-[#c3d6c9] text-xs font-medium py-2 px-3 border-b border-white/10 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* News Ticker Marquee Container */}
        <div className="flex-1 overflow-hidden relative">
          <div className="inline-flex gap-8 whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-pointer">
            {/* First sequence */}
            {tickerItems.map((item, idx) => (
              <Link
                key={`t1-${idx}`}
                href={item.link}
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                {item.icon}
                <span className="font-semibold">{item.text}</span>
                <span className="text-white/20 ml-4">&bull;</span>
              </Link>
            ))}

            {/* Repeated sequence for seamless loop */}
            {tickerItems.map((item, idx) => (
              <Link
                key={`t2-${idx}`}
                href={item.link}
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                {item.icon}
                <span className="font-semibold">{item.text}</span>
                <span className="text-white/20 ml-4">&bull;</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right side contact links */}
        <div className="hidden md:flex items-center gap-4 text-[11px] flex-shrink-0 pl-3 border-l border-white/10">
          <Link href="/terms" className="hover:text-white transition-colors">
            18+ &bull; Delivery Terms
          </Link>
          <a
            href={`tel:${cleanPhone || '+2348000000000'}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors font-bold text-amber-300"
          >
            <Phone className="w-3 h-3 text-brand-amber" />
            <span>{settings.phone || '080 000 0000'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}