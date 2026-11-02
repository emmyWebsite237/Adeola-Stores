import React from 'react';
import Link from 'next/link';
import { Shield, Lock, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy & Age Policy | Ladydee Minimart Stores Lagos',
  description: 'How Ladydee Minimart Stores protects customer data, Date of Birth privacy, payment tokens, and delivery addresses.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f7faf7] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-emerald-100 p-6 sm:p-10">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-700">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Privacy Policy</span>
        </div>

        {/* Title */}
        <div className="border-b border-slate-100 pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" />
            Nigeria Data Protection Regulation (NDPR) Compliant
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy &amp; Data Protection
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Last Updated: November 2026 &bull; Ladydee Minimart Stores (Adeola Stores, Lagos, Nigeria)
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">1</span>
              Information We Collect &amp; Age Verification
            </h2>
            <p>
              When you create an account or order groceries through Ladydee Minimart Stores, we collect details strictly required to process and dispatch your food items:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 mt-2">
              <li><strong>Personal Identity:</strong> Full name, chosen username, and <strong>Date of Birth</strong> (to verify you meet the mandatory 18+ age threshold).</li>
              <li><strong>Contact &amp; Delivery:</strong> Active Nigerian telephone number, email address, physical delivery address, and landmark notes in Lagos.</li>
              <li><strong>Wallet Information:</strong> Stored balance and encrypted 4-digit security PIN for authorizing wallet payouts.</li>
              <li><strong>Order History:</strong> Product items, recipe bundles, order timestamps, and fulfillment progress.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">2</span>
              Age Verification &amp; Minors Policy
            </h2>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs sm:text-sm">
              <p className="font-bold flex items-center gap-2 mb-1 text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                Children &amp; Under-18 Privacy Notice
              </p>
              Our platform does not intentionally collect or solicit personal information from individuals under the age of 18. If we discover an account was registered by an individual under 18 years old without verified legal guardian consent, the account and personal records will be promptly terminated.
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">3</span>
              Payment &amp; Financial Security (Zero Card Storage)
            </h2>
            <p>
              Online payments are processed through <strong>Paystack Payments Limited</strong> (licensed by the Central Bank of Nigeria) using PCI-DSS Level 1 bank-grade encryption.
            </p>
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 mt-3 flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-950">
                <strong>We never store your card credentials:</strong> Ladydee Minimart Stores never sees, handles, or saves your 16-digit debit card number, CVV code, or banking token passwords. All transactions are securely handled directly between your banking app and Paystack.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">4</span>
              Data Protection &amp; Third Parties
            </h2>
            <p>
              We do not sell, rent, or trade your personal data to marketing brokers. Your delivery information is shared strictly with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 mt-2">
              <li><strong>Designated Dispatch Drivers:</strong> Receiving your phone number and address solely for direct order delivery in Lagos.</li>
              <li><strong>Transactional Email Relays:</strong> Brevo / Supabase for sending official email receipts and verification links.</li>
            </ul>
          </section>

          {/* Privacy Disclaimer */}
          <section className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200">
            <h2 className="text-base font-extrabold text-slate-900 mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-700" />
              Privacy &amp; Security Disclaimer
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              While Ladydee Minimart Stores implements robust industry security practices, HTTPS encryption, and modern database access controls, no internet transmission is 100% immune from external hazards. We urge you to safeguard your account password, never disclose your 4-digit wallet payment PIN to anyone (including staff), and log out when using public shared devices.
            </p>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/" className="text-emerald-700 font-semibold hover:underline">
            &larr; Return to Store
          </Link>
          <div className="flex gap-4 text-slate-500">
            <Link href="/terms" className="hover:text-emerald-700 font-medium">Terms of Service</Link>
            <Link href="/contact" className="hover:text-emerald-700 font-medium">Customer Desk</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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
