import Link from 'next/link';
import { Truck, Phone } from 'lucide-react';

export default function TopAnnouncement() {
  return (
    <div className="bg-brand-ink text-[#c3d6c9] text-xs font-medium py-2 px-4 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Truck className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />
          <span className="truncate">
            Free delivery on orders over <strong className="text-white font-bold">₦50,000</strong> across Lagos
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px]">
          <Link href="/terms" className="hover:text-white transition-colors">
            Delivery &amp; Returns
          </Link>
          <a href="tel:+2348000000000" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone className="w-3 h-3 text-brand-amber" />
            <span>080 000 0000</span>
          </a>
        </div>
      </div>
    </div>
  );
}
