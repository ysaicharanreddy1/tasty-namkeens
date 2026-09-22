import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Eye } from 'lucide-react';

export default function ProductCard({ product, onFindStore }) {
  const { _id, name, netWeight, mrp, imageUrl, ingredients } = product;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group">
      {/* Clickable Image -> opens separate ProductDetailPage */}
      <Link to={`/products/${_id}`} className="block aspect-square bg-gray-50 overflow-hidden relative">
        <img
          src={imageUrl || '/images/placeholder-snack.png'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder-snack.png';
          }}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/products/${_id}`} className="block">
            <h3 className="font-semibold text-gray-900 text-sm hover:text-red-700 transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>

          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">{netWeight}</span>
            {mrp && <span className="text-sm font-bold text-red-700">₹{mrp}</span>}
          </div>

          {ingredients && (
            <p className="text-xs text-gray-400 line-clamp-1 mt-1">{ingredients}</p>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            onFindStore(product);
          }}
          className="w-full mt-3 flex items-center justify-center gap-1.5 bg-gray-900 text-white py-2 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors"
        >
          <Store className="w-3.5 h-3.5" />
          Find Nearby Store
        </button>
      </div>
    </div>
  );
}
