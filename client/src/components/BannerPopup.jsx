import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function BannerPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Trigger popup on page open with a tiny natural delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      {/* Slide animation from top to bottom */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-amber-200 transform transition-all duration-500 ease-out animate-slide-down"
      >
        {/* Close Button Top Right */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors shadow-md"
          title="Close announcement"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Banner image of all snacks */}
        <div className="w-full bg-[#f9f5ea] overflow-hidden">
          <img
            src="/images/banner-popup.png"
            alt="Tasty Namkeens Snack Collection"
            className="w-full h-auto object-cover max-h-[70vh]"
          />
        </div>

        {/* Caption bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-800 to-red-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0 hidden sm:block" />
            <div>
              <h3 className="font-bold text-base sm:text-lg tracking-tight">
                Authentic Indian Snacks & Wholesale Namkeens
              </h3>
              <p className="text-xs text-red-100">
                Freshly packed by S.V. Enterprises, Hyderabad • FSSAI Certified
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-colors shrink-0"
          >
            Explore Products
          </button>
        </div>
      </div>
    </div>
  );
}
