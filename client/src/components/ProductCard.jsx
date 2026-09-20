import React from 'react';
import { Store, Weight, Sparkles, CheckCircle2 } from 'lucide-react';

// Color and icon helper based on snack category
const getCategoryBadgeColor = (category) => {
  switch (category) {
    case 'Bhujia':
      return 'bg-amber-100 text-amber-900 border-amber-300';
    case 'Chivda':
      return 'bg-orange-100 text-orange-900 border-orange-300';
    case 'Lentil Snacks':
      return 'bg-yellow-100 text-yellow-900 border-yellow-300';
    case 'Mathri':
      return 'bg-red-100 text-red-900 border-red-300';
    case 'Peanuts':
      return 'bg-amber-100 text-amber-900 border-amber-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export default function ProductCard({ product, onFindStore }) {
  const { name, category, netWeight, description, ingredients, availableStores } = product;
  const storeCount = Array.isArray(availableStores) ? availableStores.length : 0;

  return (
    <div className="group bg-white rounded-2xl border border-amber-200/80 hover:border-brand-crimson/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Product Image / Graphic Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-amber-50 via-orange-50/50 to-red-50 flex items-center justify-center p-6 overflow-hidden border-b border-amber-100">
        {/* Decorative circle glow */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-brand-gold/30 to-brand-crimson/20 blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

        {/* Snack graphic representation */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-md border-2 border-amber-200 flex items-center justify-center text-3xl group-hover:rotate-6 transition-transform duration-300 select-none">
            🥜
          </div>
          <span className="mt-2 text-[11px] font-bold text-amber-900 uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded-full border border-amber-200">
            {category}
          </span>
        </div>

        {/* Weight tag */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm border border-gray-200 flex items-center gap-1">
          <Weight className="w-3 h-3 text-brand-crimson" />
          <span>{netWeight}</span>
        </div>

        {/* Supermarket stock count badge */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-800 shadow-sm border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>In {storeCount} Nearby {storeCount === 1 ? 'Store' : 'Stores'}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-lg text-brand-charcoal group-hover:text-brand-crimson transition-colors leading-snug">
              {name}
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 uppercase tracking-wider ${getCategoryBadgeColor(
                category
              )}`}
            >
              {category}
            </span>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {description || 'Authentic traditional Indian namkeen recipe prepared with premium ingredients and ground spices.'}
          </p>

          {ingredients && (
            <div className="text-[11px] text-gray-500 line-clamp-1 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
              <span className="font-semibold text-gray-700 not-italic">Ingredients: </span>
              {ingredients}
            </div>
          )}
        </div>

        {/* Action Button: Find Nearby Store (B2C Highlight) */}
        <div className="pt-5 border-t border-gray-100 mt-4">
          <button
            onClick={() => onFindStore(product)}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-crimson to-brand-crimsonLight hover:from-red-800 hover:to-brand-crimson text-white py-2.5 px-4 rounded-xl font-bold text-xs tracking-wide shadow-md shadow-red-900/10 hover:shadow-lg transition-all"
          >
            <Store className="w-4 h-4 text-brand-gold" />
            <span>Find Nearby Store</span>
          </button>
          <span className="block text-center text-[10px] text-gray-400 mt-1.5 font-medium">
            Available at authorized retail supermarkets
          </span>
        </div>
      </div>
    </div>
  );
}
