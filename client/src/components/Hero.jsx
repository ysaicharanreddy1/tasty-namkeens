import React from 'react';
import { MessageCircle, Store, Award, PackageCheck, Truck, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';

const ADMIN_WHATSAPP = '919999999999';
const WHATSAPP_HERO_CTA = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
  'Hello Admin, I want to register my supermarket on Tasty Namkeens'
)}`;

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-cream via-amber-50/40 to-white pt-12 pb-20 border-b border-amber-200/60">
      {/* Decorative background blurs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-red-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-200 text-brand-crimson font-bold text-xs tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Official B2B Manufacturer & Bulk Wholesaler</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-charcoal tracking-tight leading-[1.15]">
              Authentic Indian Snacks,{' '}
              <span className="text-brand-crimson bg-gradient-to-r from-brand-crimson to-red-600 bg-clip-text text-transparent">
                Delivered Bulk
              </span>{' '}
              to Supermarkets.
            </h1>

            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Tasty Namkeens crafts <span className="font-semibold text-brand-crimson">50+ signature varieties</span> of savory namkeens, crunchy bhujias, and spiced farsan with authentic heritage recipes. We supply directly to certified retail supermarkets with transparent wholesale pricing.
            </p>

            {/* Crucial Business Model Banner */}
            <div className="p-4 rounded-xl bg-amber-100/70 border border-amber-300 text-left text-sm text-amber-950 flex items-start gap-3 shadow-sm">
              <Store className="w-5 h-5 text-brand-crimson shrink-0 mt-0.5" />
              <div>
                <strong className="text-brand-crimson font-bold block">
                  Visiting as a customer looking to enjoy Tasty Namkeens?
                </strong>
                <span>
                  We do not sell single retail packets online. Browse any snack below and click{' '}
                  <strong className="underline decoration-brand-crimson underline-offset-2">"Find Nearby Store"</strong> to locate authorized supermarkets stocking that snack near you!
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href={WHATSAPP_HERO_CTA}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-4 rounded-xl font-bold text-base shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Request Account via WhatsApp</span>
              </a>

              <a
                href="#catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-crimson hover:bg-brand-crimsonLight text-white px-6 py-4 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all"
              >
                <span>Browse 50+ Varieties</span>
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-200/80">
              <div className="flex items-center gap-2.5">
                <PackageCheck className="w-5 h-5 text-brand-crimson shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-bold text-brand-charcoal">50+ Varieties</div>
                  <div className="text-xs text-gray-500">Bhujia, Chivda, Mathri</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-brand-crimson shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-bold text-brand-charcoal">48-Hour Dispatch</div>
                  <div className="text-xs text-gray-500">Factory Fresh Batches</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-brand-crimson shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-bold text-brand-charcoal">FSSAI Certified</div>
                  <div className="text-xs text-gray-500">100% Quality Inspected</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Card / Graphic */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-amber-900/10 border-2 border-amber-200">
              <div className="absolute -top-4 right-6 bg-brand-gold text-brand-charcoal text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                B2B Wholesale Portal
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-brand-crimson font-black">
                    TN
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Supermarket Registration</h3>
                    <p className="text-xs text-gray-500">Manual verification by Tasty Namkeens Admin</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/60 border border-amber-100">
                    <span className="w-6 h-6 rounded-full bg-brand-crimson text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                    <span className="text-xs leading-relaxed">
                      <strong>Click WhatsApp button</strong> to send your supermarket license or GST details to Admin.
                    </span>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/60 border border-amber-100">
                    <span className="w-6 h-6 rounded-full bg-brand-crimson text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                    <span className="text-xs leading-relaxed">
                      <strong>Receive Login Credentials</strong> from the Admin once your store profile is verified.
                    </span>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/60 border border-amber-100">
                    <span className="w-6 h-6 rounded-full bg-brand-crimson text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
                    <span className="text-xs leading-relaxed">
                      <strong>Log in to Portal</strong> to access bulk packet pricing, minimum order quantities, and direct billing.
                    </span>
                  </div>
                </div>

                <a
                  href={WHATSAPP_HERO_CTA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl font-bold text-sm transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Connect with Admin on WhatsApp</span>
                </a>

                <div className="text-center pt-2">
                  <span className="text-xs text-gray-500">
                    Already an approved supermarket?{' '}
                    <a href="/login" className="text-brand-crimson font-bold underline">
                      Sign in here
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
