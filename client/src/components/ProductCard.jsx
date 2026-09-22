import React from 'react';
import { Store } from 'lucide-react';

export default function ProductCard({ product, onFindStore }) {
  const { name, netWeight, mrp, imageUrl, ingredients } = product;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-square bg-gray-50 overflow-hidden">
        <img
          src={imageUrl || '/images/placeholder-snack.png'}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder-snack.png';
          }}
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{netWeight}</span>
          {mrp && <span className="text-sm font-bold text-red-700">₹{mrp}</span>}
        </div>

        {ingredients && (
          <p className="text-xs text-gray-400 line-clamp-1">{ingredients}</p>
        )}

        <button
          onClick={() => onFindStore(product)}
          className="w-full mt-2 flex items-center justify-center gap-1.5 bg-gray-900 text-white py-2 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors"
        >
          <Store className="w-3.5 h-3.5" />
          Find Nearby Store
        </button>
      </div>
    </div>
  );
}
