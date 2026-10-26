import React from 'react';
import Link from 'next/link';
import { Shield, Lock, EyeOff, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Adeola Stores Lagos',
  description: 'How Lady Dee Adeola Stores protects customer data, payment credentials, and delivery addresses.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-store-cream min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-store-forest">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Privacy Policy</span>
        </div>

        {/* Title */}
        <div className="border-b border-slate-100 pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-store-forest text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" />
            Nigeria Data Protection Regulation (NDPR) Compliant
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Lady Dee Adeola Stores (&ldquo;Adeola Stores&rdquo;) respects your privacy and is dedicated to keeping your personal data secure.
          </p>
        </div>

        {/* Privacy Content */}
        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-store-forest text-xs flex items-center justify-center font-bold">1</span>
              Information We Collect
            </h2>
            <p>
              When you purchase groceries from Adeola Stores, we collect information required exclusively to fulfill your doorstep dispatch:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 mt-2">
              <li><strong>Contact Information:</strong> Full name, email address, and active Nigerian telephone number for dispatch driver coordination.</li>
              <li><strong>Delivery Information:</strong> Physical street address, landmark notes, and delivery zone in Lagos.</li>
              <li><strong>Order Data:</strong> Selected groceries, recipe bundles, order date, and total order volume.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-store-forest text-xs flex items-center justify-center font-bold">2</span>
              Payment Security (Paystack Gateway)
            </h2>
            <p>
              We prioritize the highest security standard for financial transactions:
            </p>
            <div className="mt-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Lock className="w-4 h-4 text-store-forest" />
                Zero Card Storage on Our Servers
              </div>
              <p>
                All electronic card transactions, USSD payments, and bank transfers are processed directly via <strong>Paystack Payments Limited</strong> (a PCI-DSS Level 1 certified processor). Adeola Stores does not retain, process, or view your debit card CVV, expiry dates, or banking credentials.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-store-forest text-xs flex items-center justify-center font-bold">3</span>
              Third-Party Service Disclosures
            </h2>
            <p>
              We do not sell, rent, or trade your personal data to marketing brokers. We share necessary details strictly with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 mt-2">
              <li><strong>Designated Dispatch Logistics Riders:</strong> Providing your phone number and drop-off address for successful drop-off.</li>
              <li><strong>Payment Processors:</strong> Paystack for validating successful settlement.</li>
              <li><strong>Cloud Storage & Database:</strong> Supabase (PostgreSQL with row-level security and TLS encryption).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-store-forest text-xs flex items-center justify-center font-bold">4</span>
              Your Rights & Data Retention
            </h2>
            <p>
              In compliance with the Nigeria Data Protection Act (NDPA), you have the right to request access to your stored order history, modify outdated delivery addresses, or request full deletion of your contact profile by emailing our data officer at <code>privacy@adeolastores.com</code>.
            </p>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/" className="text-store-forest font-semibold hover:underline">
            &larr; Back to Adeola Stores
          </Link>
          <div className="flex gap-4 text-slate-500">
            <Link href="/terms" className="hover:text-store-forest">Terms</Link>
            <Link href="/returns" className="hover:text-store-forest">Returns</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
