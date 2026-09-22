import React from 'react';

export default function Hero() {
  return (
    <section className="bg-white overflow-hidden w-full">
      {/* Full-width Edge-to-Edge Banner with PowerPoint-style slide down animation */}
      <div className="w-full relative overflow-hidden bg-[#f7f2e7]">
        <img
          src="/images/banner-popup.png"
          alt="Tasty Namkeens Signature Snack Collection"
          className="w-full h-auto max-h-[640px] object-cover sm:object-contain object-center animate-hero-slide-down block"
        />
      </div>

      {/* Clean Tagline and Action Buttons */}
      <div className="w-full px-4 sm:px-8 py-10 text-center border-b border-gray-100">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Authentic Traditional Indian Namkeens & Snacks
        </h1>
        <p className="mt-2.5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Freshly packed by S.V. Enterprises, Hyderabad • FSSAI Certified (Lic: 23624030002668)
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <a
            href="#products"
            className="bg-red-700 text-white px-7 py-3.5 rounded-xl text-sm font-bold hover:bg-red-800 transition-colors shadow-md hover:shadow-lg"
          >
            Explore Snacks
          </a>
          <a
            href="#contact"
            className="border-2 border-gray-300 text-gray-800 px-7 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            Contact & Supply
          </a>
        </div>
      </div>
    </section>
  );
}
