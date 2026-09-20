import React from 'react';
import { Search, Filter } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Bhujia',
  'Chivda',
  'Lentil Snacks',
  'Mathri',
  'Peanuts',
  'Namkeens',
  'Mixture',
];

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  totalResults,
}) {
  return (
    <div className="space-y-4">
      {/* Search Input Box */}
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search among 50+ varieties (e.g. Aloo Bhujia, Moong Dal, Chivda)..."
          className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-amber-200 focus:border-brand-crimson focus:ring-2 focus:ring-red-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 shadow-sm transition-all outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">
          <Filter className="w-3.5 h-3.5 text-brand-crimson" /> Category:
        </span>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? 'bg-brand-crimson text-white shadow-md shadow-red-900/20 scale-105'
                  : 'bg-white text-gray-700 hover:bg-amber-100/70 border border-amber-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results counter */}
      <div className="text-center text-xs text-gray-500 font-medium">
        Showing <span className="font-bold text-brand-crimson">{totalResults}</span> snack varieties
        {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
      </div>
    </div>
  );
}
