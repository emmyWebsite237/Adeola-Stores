'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Package,
  Truck,
  Lightbulb,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle
} from 'lucide-react';
import { useSiteSettings } from '@/lib/useSiteSettings';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [topic, setTopic] = useState('product-suggestion');
  const { settings } = useSiteSettings();

  const cleanPhone = (settings.phone || '').replace(/[^0-9+]/g, '');
  const cleanWhatsApp = (settings.whatsapp || '').replace(/[^0-9]/g, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-10">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-brand-ink via-[#172c21] to-brand-ink rounded-3xl p-6 sm:p-10 text-white shadow-card relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-green/20 text-brand-green text-xs font-bold border border-brand-green/30">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Help &amp; Suggestions Desk</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Suggestions, Deliveries &amp; Support
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Have a grocery item you want us to stock? Need a dispatch check on your Lagos order, or want to report an issue? Send us a direct message below.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Quick Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-line p-6 shadow-soft space-y-5">
            <h3 className="font-extrabold text-base text-brand-ink">Direct Store Contact</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Our dispatch team and grocery managers review every suggestion and support ticket promptly.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-8 h-8 rounded-xl bg-brand-green-soft text-brand-green flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-brand-ink">Customer Support Line</span>
                  <a href={`tel:${cleanPhone || '+2348000000000'}`} className="text-brand-muted hover:text-brand-green transition-colors font-medium">
                    {settings.phone || '080 000 0000'}
                  </a>
                </div>
              </div>

              {cleanWhatsApp && (
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-brand-ink">WhatsApp Desk</span>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-semibold"
                    >
                      Chat on WhatsApp ({settings.whatsapp})
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 text-xs">
                <div className="w-8 h-8 rounded-xl bg-brand-amber-soft text-brand-amber flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-brand-ink">Official Email Address</span>
                  <a href={`mailto:${settings.email || 'support@ladydeestores.com'}`} className="text-brand-muted hover:text-brand-green transition-colors font-medium">
                    {settings.email || 'support@ladydeestores.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-brand-ink">Central Lagos Hub</span>
                  <span className="text-brand-muted">{settings.address || 'Ladydee Minimart Store, Lagos, Nigeria'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-brand-ink">Operating Hours</span>
                  <span className="text-brand-muted">Monday – Saturday: 7:30 AM – 8:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand-cream rounded-3xl border border-brand-line-2 p-6 space-y-3">
            <h4 className="font-extrabold text-sm text-brand-ink flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-brand-amber" />
              What can you suggest?
            </h4>
            <ul className="text-xs text-brand-muted space-y-1.5 list-disc pl-4">
              <li>Specific brands of grains, oils, or spices not currently listed.</li>
              <li>Special bulk quantities or wholesale carton requests.</li>
              <li>Delivery feedback or rider dispatch follow-ups.</li>
              <li>New recipe dish combinations for our <strong>Cook Tonight</strong> section!</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Free FormSubmit Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-brand-line p-6 sm:p-8 shadow-card">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-brand-ink">Thank You for Your Message!</h3>
                <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto">
                  Your submission was delivered directly to our customer team via FormSubmit. We will review your suggestions or follow up on your delivery request shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-brand-green text-white text-xs font-bold hover:bg-brand-green-dark transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                action="https://formsubmit.co/support@ladydeestores.com"
                method="POST"
                onSubmit={() => {
                  // Allow native submission while showing confirmation feedback
                  setTimeout(() => setSubmitted(true), 600);
                }}
                className="space-y-4"
              >
                {/* FormSubmit Configuration Fields */}
                <input type="hidden" name="_subject" value={`New Ladydee Store Contact: ${topic}`} />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />

                <div>
                  <h3 className="text-lg font-extrabold text-brand-ink">Send Us a Message</h3>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Powered securely and free of charge via FormSubmit.
                  </p>
                </div>

                {/* Topic Selector */}
                <div>
                  <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-2">
                    Inquiry Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'product-suggestion', label: 'Product Suggestion', icon: Lightbulb },
                      { id: 'delivery-report', label: 'Delivery / Order Report', icon: Truck },
                      { id: 'general-support', label: 'General Inquiry', icon: HelpCircle },
                    ].map((item) => {
                      const Icon = item.icon;
                      const active = topic === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTopic(item.id)}
                          className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                            active
                              ? 'bg-brand-green-soft border-brand-green text-brand-green'
                              : 'bg-white border-brand-line text-brand-muted hover:border-brand-green/40'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[11px]">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <input type="hidden" name="Inquiry_Category" value={topic} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      name="Full_Name"
                      required
                      placeholder="e.g. Chioma Adebayo"
                      className="w-full px-4 py-2.5 bg-[#fbfcfb] text-xs text-brand-ink rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      name="Email"
                      required
                      placeholder="e.g. chioma@gmail.com"
                      className="w-full px-4 py-2.5 bg-[#fbfcfb] text-xs text-brand-ink rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      name="Phone"
                      placeholder="0802 345 6789"
                      className="w-full px-4 py-2.5 bg-[#fbfcfb] text-xs text-brand-ink rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
                      Order Reference (If Any)
                    </label>
                    <input
                      type="text"
                      name="Order_Reference"
                      placeholder="e.g. LADYDEE-123456"
                      className="w-full px-4 py-2.5 bg-[#fbfcfb] text-xs text-brand-ink rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-ink uppercase tracking-wider mb-1.5">
                    Your Message / Product Suggestion
                  </label>
                  <textarea
                    name="Message"
                    required
                    rows={4}
                    placeholder="Describe the product you'd love us to stock, or tell us how we can assist you..."
                    className="w-full px-4 py-2.5 bg-[#fbfcfb] text-xs text-brand-ink rounded-xl border border-brand-line focus:border-brand-green focus:bg-white outline-none resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-brand-green hover:bg-brand-green-dark text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-green/20 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via FormSubmit</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
