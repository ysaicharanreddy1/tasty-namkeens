import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';

export default function ProductCard({ product, onFindStore }) {
  const { _id, name, netWeight, mrp, imageUrl } = product;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group p-3 sm:p-4">
      {/* Big Crisp Product Image */}
      <Link
        to={`/products/${_id}`}
        className="block aspect-square w-full rounded-xl bg-gray-50 overflow-hidden relative"
      >
        <img
          src={imageUrl || '/images/placeholder-snack.png'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder-snack.png';
          }}
        />
      </Link>

      {/* Clean Info: Big bold title, Weight, MRP price */}
      <div className="pt-4 pb-2 flex-1 flex flex-col justify-between space-y-3">
        <div className="text-center space-y-1">
          <Link to={`/products/${_id}`} className="block">
            <h3 className="font-bold text-lg sm:text-xl text-gray-900 hover:text-red-700 transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>

          <p className="text-sm font-medium text-gray-500">
            Net Wt: <span className="font-semibold text-gray-700">{netWeight}</span>
          </p>

          {mrp && (
            <div className="pt-1">
              <span className="text-xl sm:text-2xl font-black text-red-700">
                ₹{mrp}
              </span>
              <span className="text-xs text-gray-400 ml-1 font-medium">MRP</span>
            </div>
          )}
        </div>

        {/* Find Nearby Store Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onFindStore(product);
          }}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl text-sm font-bold tracking-wide transition-colors shadow-sm"
        >
          <Store className="w-4 h-4" />
          <span>Find Nearby Store</span>
        </button>
      </div>
    </div>
  );
}
