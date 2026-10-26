import Link from 'next/link';
import { ShoppingBasket, ShieldCheck, Truck, RefreshCw, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-ink text-gray-300 pt-16 pb-24 lg:pb-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-green/20 text-brand-green flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Same-Day Lagos Delivery</h4>
              <p className="text-xs text-gray-400 mt-1">Dispatched fresh from our central Lagos warehouse hub.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-amber/20 text-brand-amber flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Sealed &amp; Authentic</h4>
              <p className="text-xs text-gray-400 mt-1">Original factory-sealed packs with extended shelf life.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-green/20 text-brand-green flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">48-Hour Return Guarantee</h4>
              <p className="text-xs text-gray-400 mt-1">Hassle-free replacement for any damaged package.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Direct WhatsApp Support</h4>
              <p className="text-xs text-gray-400 mt-1">Need special food items? Chat directly with staff.</p>
            </div>
          </div>
        </div>

        {/* Links Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-green text-white flex items-center justify-center">
                <ShoppingBasket className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base">Ladydee Minimart</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Your market run, done in minutes. Rice, noodles, cooking oils, beverages, and baby essentials delivered across Nigeria.
            </p>
            <div className="text-xs text-gray-400 space-y-1.5">
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-brand-amber" /> Lagos, Nigeria</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-brand-amber" /> 080 000 0000</p>
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-brand-amber" /> support@ladydeestores.com</p>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Shop Categories</h5>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link href="/shop?cat=pantry-grains" className="hover:text-white transition-colors">Rice &amp; Pantry Grains</Link></li>
              <li><Link href="/shop?cat=breakfast-cereals" className="hover:text-white transition-colors">Breakfast &amp; Cereals</Link></li>
              <li><Link href="/shop?cat=milk-dairy" className="hover:text-white transition-colors">Milk &amp; Dairy</Link></li>
              <li><Link href="/shop?cat=condiments-canned" className="hover:text-white transition-colors">Condiments &amp; Canned Foods</Link></li>
              <li><Link href="/shop?cat=baby-care" className="hover:text-white transition-colors">Baby Care &amp; Nutrition</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Features &amp; Hubs</h5>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link href="/cook" className="hover:text-white transition-colors">Cook Tonight (Recipe-to-Cart)</Link></li>
              <li><Link href="/bundles" className="hover:text-white transition-colors">Household Bundles &amp; Packs</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Free Lagos Delivery Meter</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Staff &amp; Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Legal &amp; Security</h5>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Return &amp; Refund Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
            <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-gray-400 block font-semibold mb-1">Secured by Paystack</span>
              <p className="text-[10px] text-gray-500">256-bit bank grade encryption. Accepts Verve, Mastercard, Visa, and direct bank transfers.</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Ladydee Minimart Store. All rights reserved.</p>
          <p>Powered by Next.js &amp; TypeScript</p>
        </div>
      </div>
    </footer>
  );
}
