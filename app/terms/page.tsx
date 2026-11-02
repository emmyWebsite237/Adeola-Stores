import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service & Age Agreement | Ladydee Minimart Stores Lagos',
  description: 'Terms of service, age eligibility (18+), grocery delivery timelines, and legal disclaimers for Ladydee Minimart Stores.',
};

export default function TermsPage() {
  return (
    <div className="bg-[#f7faf7] min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-emerald-100 p-6 sm:p-10">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-700">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Terms of Service</span>
        </div>

        {/* Title */}
        <div className="border-b border-slate-100 pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
            <FileText className="w-3.5 h-3.5" />
            Legal &amp; Customer Agreement
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service &amp; Conditions of Use
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Last Updated: November 2026 &bull; Ladydee Minimart Stores (Adeola Stores, Lagos, Nigeria)
          </p>
        </div>

        {/* Age Restriction Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 mb-8 flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <strong className="font-extrabold block text-amber-950 mb-1">
              Strict Age Eligibility Requirement (18 Years &amp; Above)
            </strong>
            By creating an account or placing an order on Ladydee Minimart Stores, you certify that you are at least 18 years of age. We require Date of Birth verification upon registration. Individuals under the age of 18 are not permitted to execute purchase transactions independently on this platform.
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">1</span>
              Operating Entity &amp; Acceptance
            </h2>
            <p>
              Welcome to Ladydee Minimart Stores (&ldquo;Adeola Stores&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing our website, registering an account, depositing into your customer wallet, or purchasing food items and household provisions from our platform, you agree to be bound by these Terms of Service.
            </p>
            <p className="mt-2">
              We operate fresh grocery procurement, bulk grains supply, frozen food distribution, and doorstep delivery within designated delivery zones across Lagos State, Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">2</span>
              User Accounts, Date of Birth &amp; Security
            </h2>
            <p>
              To safeguard our services and comply with commercial regulations, every registered user must provide accurate personal details including full legal name, active Nigerian phone number, valid email, and true Date of Birth.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 mt-2">
              <li>You are solely responsible for maintaining the confidentiality of your account credentials and 4-digit Wallet Security PIN.</li>
              <li>Personal registration details (such as Date of Birth and core identity) remain permanent once verified.</li>
              <li>Profile avatar selections may be updated at most once per 7 calendar days; delivery address information may be updated once per month.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">3</span>
              Ladydee Customer Wallet &amp; Payments
            </h2>
            <p>
              Registered shoppers may maintain a stored-value customer wallet for fast, seamless one-click order settlements.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 mt-2">
              <li><strong>Deposit Funding:</strong> Wallet balances can be topped up via verified Paystack electronic payments (Debit Cards, Bank Transfer, USSD).</li>
              <li><strong>Security PIN:</strong> Spending wallet funds requires authentication with your personal 4-digit payment PIN.</li>
              <li><strong>Non-Transferability:</strong> Wallet funds are designated for purchases on Ladydee Minimart Stores and are non-transferable to third-party accounts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">4</span>
              Pricing, Weights &amp; Market Tolerances
            </h2>
            <p>
              All prices are displayed in Nigerian Naira (NGN, ₦). Because fresh agricultural produce (peppers, onions, fresh tubers, tomatoes) is subject to open-market conditions in Lagos, listed prices reflect prevailing farm and wholesale procurement rates.
            </p>
            <p className="mt-2">
              For weighed produce (e.g. tubers of yam, meat cuts, bulk beans), our packing team matches listed weights within a standard &plusmn;5% market allowance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">5</span>
              Lagos Delivery &amp; Receiving Perishables
            </h2>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-3">
              <p className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-700" />
                Dispatch &amp; Delivery Logistics:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                <li><strong>Same-Day Dispatch:</strong> Orders placed before 12:00 PM (WAT) across Lagos Mainland and Island.</li>
                <li><strong>Next-Day Standard:</strong> Orders placed after 12:00 PM are scheduled for early morning delivery.</li>
                <li><strong>Free Delivery Tier:</strong> Free doorstep delivery automatically unlocks on qualifying basket totals (₦50,000+).</li>
              </ul>
            </div>
            <p>
              Dispatch riders will place two phone calls upon arrival. If no recipient is available to receive perishable items, redelivery fees will apply.
            </p>
          </section>

          {/* Legal Disclaimer Box */}
          <section className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200">
            <h2 className="text-base font-extrabold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              General Legal Disclaimer
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>1. Food Product Allergies:</strong> Ladydee Minimart Stores sources packaged and open farm produce from licensed distributors and certified local farmers. We encourage customers with severe nut, dairy, gluten, or seafood allergies to inspect packaged labels upon delivery. We are not liable for adverse individual allergic reactions.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              <strong>2. Third-Party Brand Claims:</strong> Nutritional information, manufacturing warranties, and product trademarks belong solely to their respective registered brand owners (e.g., Nestl&eacute;, Unilever, Flour Mills of Nigeria, PZ Cussons).
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              <strong>3. Force Majeure:</strong> While we strive for punctual delivery, Ladydee Minimart Stores is not held liable for dispatch delays resulting from severe weather, road blockages, heavy Lagos traffic emergencies, civil disruptions, or government restrictions.
            </p>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/" className="text-emerald-700 font-semibold hover:underline">
            &larr; Return to Store
          </Link>
          <div className="flex gap-4 text-slate-500">
            <Link href="/privacy" className="hover:text-emerald-700 font-medium">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-emerald-700 font-medium">Customer Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
