'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBasket, ChefHat, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const totalCount = useCartStore((s) => s.getTotalCount());

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: ShoppingBasket },
    { label: 'Cook', href: '/cook', icon: ChefHat, badge: 'New' },
    { label: 'Cart', href: '/cart', icon: ShoppingBag, count: totalCount },
    { label: 'Account', href: '/account', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-line shadow-nav pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-colors ${
                isActive ? 'text-brand-green' : 'text-brand-muted hover:text-brand-ink'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-brand-green text-white text-[10px] font-extrabold flex items-center justify-center">
                    {item.count > 99 ? '99+' : item.count}
                  </span>
                )}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 px-1 py-0.2 rounded-full bg-brand-amber text-brand-ink text-[9px] font-extrabold leading-tight">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 font-semibold ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
