import React from 'react';
import { Search, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Chikki',
  'Laddu',
  'Chakli',
  'Murukku',
  'Chips',
  'Roasted Snacks',
  'Mixed Snacks',
  'Peanut Snacks',
];

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto mb-10">
      {/* Search Input with bigger, clearer text */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search among all snack varieties..."
          className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-2xl text-base focus:outline-none focus:border-red-700 transition-colors shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center justify-center flex-wrap gap-2.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-red-700 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
