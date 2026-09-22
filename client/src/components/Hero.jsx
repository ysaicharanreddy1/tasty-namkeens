import React from 'react';

export default function Hero() {
  return (
    <section className="bg-white overflow-hidden border-b border-gray-100">
      {/* Banner container with PowerPoint-style slide down animation */}
      <div className="w-full relative overflow-hidden bg-gradient-to-b from-[#fbf8f0] to-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-4 sm:pt-6 pb-2 sm:pb-4 flex justify-center">
          <img
            src="/images/banner-popup.png"
            alt="Tasty Namkeens Snack Range"
            className="w-full h-auto max-h-[520px] object-contain drop-shadow-md rounded-xl animate-hero-slide-down"
          />
        </div>
      </div>

      {/* Clean Tagline and Action Buttons */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Authentic Traditional Indian Namkeens & Snacks
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
          Freshly packed by S.V. Enterprises, Hyderabad • FSSAI Certified (Lic: 23624030002668)
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <a
            href="#products"
            className="bg-red-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-red-800 transition-colors shadow-sm"
          >
            Explore Snacks
          </a>
          <a
            href="#contact"
            className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
          >
            Contact & Supply
          </a>
        </div>
      </div>
    </section>
  );
}
