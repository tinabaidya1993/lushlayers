'use client';

import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Sparkles, X, Check } from 'lucide-react';
import { CATEGORIES } from '@/data/cakes';

export interface CatalogFilterState {
  search: string;
  category: string;
  flavor: string;
  weightKg: string;
  eggless: string;
  badge: string;
  sortBy: string;
}

interface SmartFilterBarProps {
  filters?: CatalogFilterState;
  onFilterChange?: (newFilters: CatalogFilterState) => void;
  totalCount?: number;
  selectedCategory?: string;
  onSelectCategory?: (catId: string) => void;
  selectedPriceRange?: string;
  onSelectPriceRange?: (range: string) => void;
  selectedFlavor?: string;
  onSelectFlavor?: (flavor: string) => void;
}

export default function SmartFilterBar({
  filters,
  onFilterChange,
  totalCount,
  selectedCategory,
  onSelectCategory,
  selectedPriceRange = 'all',
  onSelectPriceRange,
  selectedFlavor = 'all',
  onSelectFlavor,
}: SmartFilterBarProps) {
  const [expandedFilter, setExpandedFilter] = useState<boolean>(false);

  const activeCategory = filters ? filters.category : selectedCategory || 'all';

  const handleCategoryClick = (catId: string) => {
    if (filters && onFilterChange) {
      onFilterChange({ ...filters, category: catId });
    } else if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  const handleFlavorClick = (flavorId: string) => {
    if (filters && onFilterChange) {
      onFilterChange({ ...filters, flavor: flavorId });
    } else if (onSelectFlavor) {
      onSelectFlavor(flavorId);
    }
  };

  const handleSortChange = (sort: string) => {
    if (filters && onFilterChange) {
      onFilterChange({ ...filters, sortBy: sort });
    }
  };

  const flavorOptions = [
    { id: 'all', label: 'All Flavors' },
    { id: 'chocolate', label: 'Belgian Chocolate & Truffle' },
    { id: 'vanilla', label: 'Madagascar Vanilla' },
    { id: 'red velvet', label: 'Crimson Red Velvet' },
    { id: 'pistachio', label: 'Pistachio & Champagne' },
  ];

  return (
    <div className="sticky top-[56px] sm:top-[64px] z-[90] bg-white/95 backdrop-blur-md border-b border-warmgray-200 shadow-sm transition-all duration-300 animate-fade-in">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 space-y-2">
        
        {/* Main Filter Pills Bar */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1 flex-1">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-charcoal-900 text-gold-400 shadow-xs'
                  : 'bg-cream-100 text-warmgray-700 hover:bg-warmgray-200 border border-warmgray-200'
              }`}
            >
              All Cakes
            </button>

            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-gold-500 text-white shadow-xs'
                      : 'bg-cream-100 text-warmgray-700 hover:bg-warmgray-200 border border-warmgray-200'
                  }`}
                >
                  <span>{cat.name.split(' ')[0]}</span>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              );
            })}
          </div>

          {/* More Filters Toggle Button */}
          <button
            onClick={() => setExpandedFilter(!expandedFilter)}
            className={`px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all flex-shrink-0 ${
              expandedFilter
                ? 'bg-gold-50 border-gold-500 text-gold-700'
                : 'bg-white border-warmgray-300 text-warmgray-700 hover:border-gold-400'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-gold-600" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Expanded Filters Drawer (Price & Flavor) */}
        {expandedFilter && (
          <div className="pt-2 pb-1 border-t border-warmgray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in text-xs">
            
            {/* Sort Options */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-warmgray-500">Sort By</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'featured', label: 'Featured' },
                  { id: 'popular', label: 'Bestsellers' },
                  { id: 'priceLow', label: 'Price: Low to High' },
                  { id: 'priceHigh', label: 'Price: High to Low' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSortChange(s.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      filters?.sortBy === s.id
                        ? 'bg-gold-500 text-white'
                        : 'bg-warmgray-100 text-warmgray-600 hover:bg-warmgray-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Flavor Filter */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-warmgray-500">Filter by Flavor Profile</span>
              <div className="flex flex-wrap gap-1.5">
                {flavorOptions.map((fl) => (
                  <button
                    key={fl.id}
                    onClick={() => handleFlavorClick(fl.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      (filters?.flavor === fl.id || selectedFlavor === fl.id)
                        ? 'bg-gold-500 text-white'
                        : 'bg-warmgray-100 text-warmgray-600 hover:bg-warmgray-200'
                    }`}
                  >
                    {fl.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
