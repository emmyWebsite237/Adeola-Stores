import React from 'react';
import Link from 'next/link';
import { RotateCcw, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export const metadata = {
  title: 'Return & Refund Policy | Adeola Stores Lagos',
  description: 'Easy returns, inspection on delivery, and Paystack refund policies for Lady Dee Adeola Stores.',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-store-cream min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-store-forest">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Return & Refund Policy</span>
        </div>

        {/* Title */}
        <div className="border-b border-slate-100 pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-3">
            <RotateCcw className="w-3.5 h-3.5" />
            100% Quality Guarantee
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Return & Refund Policy
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Clear guidelines on doorstep inspection, perishable replacements, and Paystack refund timelines.
          </p>
        </div>

        {/* Core Policy Points */}
        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-store-forest text-xs flex items-center justify-center font-bold">1</span>
              Doorstep Inspection Guarantee
            </h2>
            <p>
              At Lady Dee Adeola Stores, we treat every food item as if it were going onto our own family table. We encourage all customers to inspect perishable goods (fresh tomatoes, scotch bonnets, leafy vegetables, meat, and frozen poultry) immediately upon rider delivery.
            </p>
            <div className="mt-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-950">
              <div className="flex items-center gap-2 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-store-forest" />
                Spot Issue at the Door? Instant Rider Return!
              </div>
              <p>
                If an item is bruised, damaged, or does not meet your quality expectations, you can return it directly with the delivery rider. We will dispatch a fresh replacement or issue an immediate refund.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-store-forest text-xs flex items-center justify-center font-bold">2</span>
              Eligible vs Non-Eligible Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                <h3 className="font-bold text-emerald-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Eligible for 48-Hour Return:
                </h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Unopened packaged provisions (Peak Milk, Milo, Golden Morn)</li>
                  <li>Canned goods and cooking oils with seals intact</li>
                  <li>Wrong item dispatched by warehouse packing error</li>
                  <li>Factory-defective seals or punctured bags</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
                <h3 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  Conditions for Perishables:
                </h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Fresh greens (Ugwu, Waterleaf) must be reported within <strong>4 hours</strong></li>
                  <li>Frozen seafood / poultry must be stored frozen and reported within <strong>2 hours</strong></li>
                  <li>Items damaged due to customer post-delivery mishandling are non-refundable</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-store-forest text-xs flex items-center justify-center font-bold">3</span>
              Refund Processing via Paystack
            </h2>
            <p>
              When a refund is approved by our support team, funds are processed through the original method of payment:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 mt-2">
              <li><strong>Paystack Card/Bank Transfer:</strong> Refunds take <strong>24 to 72 hours</strong> depending on your issuing Nigerian commercial bank (Access, GTCO, Zenith, UBA, Kuda, etc.).</li>
              <li><strong>Store Credit / Wallet:</strong> Credited instantly to your phone number for your subsequent grocery basket.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-store-forest text-xs flex items-center justify-center font-bold">4</span>
              How to Lodge a Claim
            </h2>
            <p>
              Snap a quick photo or short video of the damaged item along with your order reference number (e.g. <code>ADEOLA-123456</code>) and message our resolution team via:
            </p>
            <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div><strong>WhatsApp Priority:</strong> +234 802 345 6789</div>
              <div><strong>Email:</strong> complaints@adeolastores.com</div>
              <div><strong>Response SLA:</strong> Within 30 minutes during store operational hours.</div>
            </div>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/terms" className="text-store-forest font-semibold hover:underline">
            &larr; View Terms of Service
          </Link>
          <Link href="/" className="hover:text-store-forest">
            Back to Marketplace &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
