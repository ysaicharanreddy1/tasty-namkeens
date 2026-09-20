import React from 'react';
import { Store, MessageCircle, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

const ADMIN_WHATSAPP = '919999999999';

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-gray-300 pt-16 pb-12 border-t-4 border-brand-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-crimson flex items-center justify-center font-black text-brand-gold text-xl">
                TN
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Tasty <span className="text-brand-crimsonLight">Namkeens</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Pioneers of authentic Indian savouries, namkeens, and farsan. Supplying 50+ varieties of freshly prepared, high-retention snack assortments exclusively to verified supermarkets and wholesale distributors.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>FSSAI Certified Manufacturer</span>
            </div>
          </div>

          {/* Col 2: Business Model Notice */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase">
              B2B Business Model
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tasty Namkeens does not offer direct online retail checkout. Our products are distributed in bulk to authorized supermarkets.
            </p>
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 space-y-2">
              <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block">
                For Retail Customers:
              </span>
              <p className="text-xs text-gray-300">
                Click <span className="text-white font-semibold">"Find Nearby Store"</span> on any snack to see physical supermarkets carrying it.
              </p>
            </div>
          </div>

          {/* Col 3: Supermarket Onboarding */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase">
              Supermarket Partners
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Are you a supermarket or grocery store owner? Get wholesale catalog access with exclusive retailer margins.
            </p>
            <a
              href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
                'Hello Tasty Namkeens, I would like to stock your snacks in my supermarket. Please share onboarding details.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Request Supermarket Account</span>
            </a>
          </div>

          {/* Col 4: Corporate Headquarters */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase">
              Headquarters & Contact
            </h3>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>Tasty Namkeens Plant & Corporate Office, Industrial Area, Hyderabad, Telangana — 500001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>+91 90000 00000 / +91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>orders@tastynamkeens.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Tasty Namkeens Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Handcrafted with authentic spices & traditional perfection
          </p>
        </div>
      </div>
    </footer>
  );
}
