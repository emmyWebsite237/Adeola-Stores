import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Clock, HelpCircle, FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Adeola Stores Lagos',
  description: 'Terms of service, grocery delivery timelines, and customer policies for Lady Dee Adeola Stores.',
};

export default function TermsPage() {
  return (
    <div className="bg-store-cream min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-store-forest">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Terms of Service</span>
        </div>

        {/* Title */}
        <div className="border-b border-slate-100 pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-store-forest text-xs font-semibold mb-3">
            <FileText className="w-3.5 h-3.5" />
            Legal & Customer Agreement
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Last Updated: October 2026 • Lady Dee Adeola Stores (Lagos, Nigeria)
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-store-forest text-xs flex items-center justify-center font-bold">1</span>
              Introduction & Operating Entities
            </h2>
            <p>
              Welcome to Lady Dee Adeola Stores (&ldquo;Adeola Stores&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing our website, mobile interface, or purchasing food items and household provisions from our platform, you agree to be legally bound by these Terms of Service.
            </p>
            <p className="mt-2">
              We operate fresh grocery procurement, bulk grains supply, frozen food distribution, and direct-to-doorstep fulfillment within designated delivery zones in Lagos State, Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-store-forest text-xs flex items-center justify-center font-bold">2</span>
              Grocery Pricing & Weight Variations
            </h2>
            <p>
              All prices are listed in Nigerian Naira (NGN, ₦) and include applicable statutory values unless explicitly stated. Due to the seasonal nature of fresh farm produce and open market fluctuations in Lagos (Mile 12, Oyingbo, and Trade Fair), prices on fresh tubers, peppers, and imported provisions may update periodically without prior personal notice.
            </p>
            <p className="mt-2">
              For weighed items (such as whole tubers of yam, fresh meat cuts, and live catfish), our dispatch team strives to match the listed nominal weight with standard ±5% market tolerance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-store-forest text-xs flex items-center justify-center font-bold">3</span>
              Order Placement, Payment & Paystack Settlement
            </h2>
            <p>
              Orders placed on our web platform are fulfilled upon confirmed electronic settlement through our certified payment partner, <strong>Paystack Payments Limited</strong> (licensed by the Central Bank of Nigeria), or verified Direct Bank Transfer to our registered business account.
            </p>
            <p className="mt-2">
              Your payment information is tokenized and processed through Paystack&apos;s bank-grade 256-bit SSL encrypted gateway. We do not store, view, or retain your 16-digit debit card numbers or bank PINs on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-store-forest text-xs flex items-center justify-center font-bold">4</span>
              Delivery Zones, Timelines & Dispatch Slots
            </h2>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-3">
              <p className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-store-forest" />
                Lagos Delivery Schedule & Cut-offs:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                <li><strong>Same-Day Delivery:</strong> Available for orders placed and confirmed before <strong>12:00 PM (WAT)</strong> across Mainland & Island.</li>
                <li><strong>Next-Day Standard:</strong> Orders confirmed after 12:00 PM are dispatched next morning between 8:00 AM and 2:00 PM.</li>
                <li><strong>Lagos Free Delivery Milestone:</strong> Applied automatically on checkout baskets reaching ₦35,000 or above within designated zones.</li>
              </ul>
            </div>
            <p>
              Our dispatched riders will attempt contact twice via your provided Nigerian mobile number. Please ensure someone is available at the delivery address to receive perishable items.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-store-forest text-xs flex items-center justify-center font-bold">5</span>
              Order Cancellation & Customer Support
            </h2>
            <p>
              Orders can be canceled free of charge before our warehouse packing team initiates dispatch (typically within 45 minutes of order placement). Once fresh perishable produce (e.g. freshly slaughtered chicken, blended pepper, fresh vegetables) has been sealed and loaded into delivery crates, cancellation is subject to restocking terms.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-950 text-xs">
              <strong>Need urgent assistance with an order?</strong>
              <div className="mt-1 flex flex-wrap gap-4">
                <span>WhatsApp: +234 802 345 6789</span>
                <span>Email: support@adeolastores.com</span>
                <span>Hours: Mon - Sat: 7:30 AM - 7:00 PM</span>
              </div>
            </div>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/" className="text-store-forest font-semibold hover:underline">
            &larr; Return to Shopping
          </Link>
          <div className="flex gap-4 text-slate-500">
            <Link href="/returns" className="hover:text-store-forest">Returns Policy</Link>
            <Link href="/privacy" className="hover:text-store-forest">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
