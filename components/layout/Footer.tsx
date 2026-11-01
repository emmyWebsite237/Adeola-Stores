'use client';

import Link from 'next/link';
import { ShoppingBasket, ShieldCheck, Truck, RefreshCw, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { useSiteSettings } from '@/lib/useSiteSettings';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 2c-5.514 0-10 4.486-10 10 0 1.761.46 3.477 1.334 4.996l-1.365 4.987 5.12-1.343c1.472.802 3.125 1.226 4.911 1.226 5.514 0 10-4.486 10-10s-4.486-10-10-10zm5.955 14.195c-.247.696-1.436 1.33-1.977 1.416-.514.077-1.164.108-1.877-.118-.433-.138-.988-.321-1.698-.627-2.989-1.29-4.938-4.298-5.087-4.496-.149-.199-1.217-1.615-1.217-3.081 0-1.466.77-2.187 1.043-2.484.273-.297.595-.372.793-.372l.571.012c.182.009.428-.069.67.514.247.596.844 2.06.918 2.21.074.15.124.323.025.522-.099.199-.149.323-.297.497l-.446.522c-.149.148-.304.31-.131.606.173.297.773 1.277 1.66 2.066 1.14 1.015 2.102 1.328 2.399 1.477.297.149.471.124.646-.074.173-.199.743-.868.941-1.165.198-.297.396-.248.669-.149.273.099 1.734.817 2.031.966.297.149.495.223.57.347.075.124.075.72-.172 1.416z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.02 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.14 1.1 2.11 2.22 2.45.69.23 1.45.22 2.15-.02.93-.32 1.68-1.02 2.05-1.93.2-.49.27-1.01.27-1.54V.02h.67z" />
    </svg>
  );
}

export default function Footer() {
  const { settings } = useSiteSettings();

  // Format clean whatsapp number link
  const cleanWhatsAppNumber = (settings.whatsapp || '').replace(/[^0-9]/g, '');
  const cleanPhone = (settings.phone || '').replace(/[^0-9+]/g, '');

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
            <div className="text-xs text-gray-400 space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                <span>{settings.address || 'Lagos, Nigeria'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                <a href={`tel:${cleanPhone || '+2348000000000'}`} className="hover:text-white transition-colors">
                  {settings.phone || '080 000 0000'}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                <a href={`mailto:${settings.email || 'support@ladydeestores.com'}`} className="hover:text-white transition-colors">
                  {settings.email || 'support@ladydeestores.com'}
                </a>
              </p>
            </div>

            {/* Social Media Channels (Set dynamically from Admin Portal) */}
            <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* WhatsApp */}
                {cleanWhatsAppNumber && (
                  <a
                    href={`https://wa.me/${cleanWhatsAppNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-emerald-950/80 hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center transition-all border border-emerald-800/40"
                    title="Chat on WhatsApp"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                )}

                {/* Instagram */}
                {settings.instagram && (
                  <a
                    href={settings.instagram.startsWith('http') ? settings.instagram : `https://instagram.com/${settings.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-pink-950/80 hover:bg-pink-600 text-pink-400 hover:text-white flex items-center justify-center transition-all border border-pink-800/40"
                    title="Follow on Instagram"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}

                {/* Facebook */}
                {settings.facebook && (
                  <a
                    href={settings.facebook.startsWith('http') ? settings.facebook : `https://facebook.com/${settings.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-blue-950/80 hover:bg-blue-600 text-blue-400 hover:text-white flex items-center justify-center transition-all border border-blue-800/40"
                    title="Follow on Facebook"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}

                {/* Twitter / X */}
                {settings.twitter && (
                  <a
                    href={settings.twitter.startsWith('http') ? settings.twitter : `https://twitter.com/${settings.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/60"
                    title="Follow on X (Twitter)"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}

                {/* TikTok */}
                {settings.tiktok && (
                  <a
                    href={settings.tiktok.startsWith('http') ? settings.tiktok : `https://tiktok.com/@${settings.tiktok.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-black text-zinc-300 hover:text-white flex items-center justify-center transition-all border border-zinc-700/60"
                    title="Follow on TikTok"
                    aria-label="TikTok"
                  >
                    <TikTokIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
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
              <li><Link href="/contact" className="hover:text-white transition-colors">Suggestions &amp; Contact Desk</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Free Lagos Delivery Meter</Link></li>
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
          <p suppressHydrationWarning>&copy; {new Date().getFullYear()} Ladydee Minimart Store. All rights reserved.</p>
          <p>Powered by Next.js &amp; TypeScript</p>
        </div>
      </div>
    </footer>
  );
}
