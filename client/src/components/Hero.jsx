import React from 'react';

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-amber-50 to-white py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
          Premium Indian Snacks
        </h1>
        <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          Authentic namkeens, chikkis, laddus & more — crafted with traditional recipes by S.V. Enterprises, Hyderabad.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="#products"
            className="bg-red-700 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-red-800 transition-colors"
          >
            View Products
          </a>
          <a
            href="#contact"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
