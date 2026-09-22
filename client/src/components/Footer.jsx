import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img src="/images/logo.png" alt="Tasty Namkeens" className="h-10 w-auto mb-3 brightness-200" />
            <p className="text-sm leading-relaxed">
              Repacked by S.V. Enterprises, Hyderabad. Authentic Indian snacks crafted with traditional recipes.
            </p>
            <p className="text-xs mt-2 text-gray-500">FSSAI: 23624030002668</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-500" />
                <span>Plot No. 143, Vivekanda Nagar Colony, Borabanda, Hyderabad - 18</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-gray-500" />
                <span>+91 99084 78783 (Primary) / +91 96522 20220</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-gray-500" />
                <span>sventerprisetasty@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Supermarket Login</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} Tasty Namkeens — S.V. Enterprises. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
