'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import CakeCard from '@/components/ui/CakeCard';
import CakeModal from '@/components/ui/CakeModal';
import OrderFormModal from '@/components/catalog/OrderFormModal';
import SmartFilterBar, { CatalogFilterState } from '@/components/catalog/SmartFilterBar';
import { CAKES_DATA } from '@/data/cakes';
import { CakeItem } from '@/types';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

export default function CatalogPage() {
  const [filters, setFilters] = useState<CatalogFilterState>({
    search: '',
    category: 'all',
    flavor: 'all',
    weightKg: 'all',
    eggless: 'all',
    badge: 'all',
    sortBy: 'featured',
  });

  const [activeQuickViewCake, setActiveQuickViewCake] = useState<CakeItem | null>(null);
  const [activeOrderCake, setActiveOrderCake] = useState<CakeItem | null>(null);
  const [orderInitialWeight, setOrderInitialWeight] = useState<string>('');
  const [orderInitialPrice, setOrderInitialPrice] = useState<number>(0);

  // Instant Smart Filter Logic
  const filteredCakes = useMemo(() => {
    let result = [...CAKES_DATA];

    // 1. Search Query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.flavors.some((f) => f.toLowerCase().includes(q)) ||
          (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // 2. Category Filter
    if (filters.category !== 'all') {
      result = result.filter((c) => c.category === filters.category);
    }

    // 3. Flavor Filter
    if (filters.flavor !== 'all') {
      const fQ = filters.flavor.toLowerCase();
      result = result.filter((c) =>
        c.flavors.some((fl) => fl.toLowerCase().includes(fQ))
      );
    }

    // 4. Weight Filter
    if (filters.weightKg !== 'all') {
      const targetKg = parseFloat(filters.weightKg);
      result = result.filter((c) =>
        c.weightOptions && c.weightOptions.some((w) => w.weightKg === targetKg)
      );
    }

    // 5. Dietary (Egg / Eggless)
    if (filters.eggless === 'eggless') {
      result = result.filter((c) => c.eggless === true);
    } else if (filters.eggless === 'egg') {
      result = result.filter((c) => c.eggless === false);
    }

    // 6. Badges Filter
    if (filters.badge === 'bestseller') {
      result = result.filter((c) => c.bestseller === true);
    } else if (filters.badge === 'newArrival') {
      result = result.filter((c) => c.newArrival === true);
    } else if (filters.badge === 'featured') {
      result = result.filter((c) => c.featured === true);
    }

    // 7. Sort Options
    if (filters.sortBy === 'priceLow') {
      result.sort((a, b) => a.priceStartingFrom - b.priceStartingFrom);
    } else if (filters.sortBy === 'priceHigh') {
      result.sort((a, b) => b.priceStartingFrom - a.priceStartingFrom);
    } else if (filters.sortBy === 'popular') {
      result.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    } else if (filters.sortBy === 'featured') {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [filters]);

  const handleOpenOrder = (cake: CakeItem, weightLabel?: string, price?: number) => {
    setActiveOrderCake(cake);
    setOrderInitialWeight(weightLabel || (cake.weightOptions ? cake.weightOptions[0].label : cake.servings));
    setOrderInitialPrice(price || cake.priceStartingFrom);
  };

  return (
    <main className="min-h-screen bg-cream-50 pt-24 pb-24 text-charcoal-900">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-cream-100 via-white to-cream-50 text-charcoal-900 py-10 sm:py-14 px-4 border-b border-warmgray-200/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-2.5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-white border border-gold-400 text-gold-700 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold">Bespoke Cake Studio by Tina Baidya</span>
          </div>
          
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-charcoal-900 tracking-tight font-bold">
            Artisanal Cake Gallery by Tina Baidya
          </h1>

          <p className="text-xs sm:text-sm text-warmgray-600 max-w-xl mx-auto font-normal leading-relaxed">
            Browse our signature designs handcrafted by Tina Baidya. Filter by flavor, size, and dietary preference. Order directly via WhatsApp.
          </p>
        </div>
      </section>

      {/* Smart Sticky Filter Bar */}
      <SmartFilterBar
        filters={filters}
        onFilterChange={(newF) => setFilters(newF)}
        totalCount={filteredCakes.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Results Counter & Applied Badge Bar */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs uppercase tracking-wider text-warmgray-500 font-bold">
            Displaying {filteredCakes.length} Masterpiece{filteredCakes.length !== 1 ? 's' : ''}
          </p>

          <span className="text-xs text-gold-700 font-semibold hidden sm:inline">
            ✨ Click any cake for live size & price calculation
          </span>
        </div>

        {/* Dynamic Responsive Grid Layout */}
        {filteredCakes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredCakes.map((cake) => (
              <CakeCard
                key={cake.id}
                cake={cake}
                onQuickView={(item) => setActiveQuickViewCake(item)}
                onOrderNow={(item) => handleOpenOrder(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-warmgray-200 p-8 space-y-4 shadow-sm">
            <SlidersHorizontal className="w-10 h-10 text-warmgray-400 mx-auto" />
            <h3 className="font-serif text-2xl text-charcoal-900 font-bold">No matching cakes found</h3>
            <p className="text-xs text-warmgray-500 max-w-sm mx-auto">
              Try broadening your search query or reset dietary and size filters.
            </p>
            <button
              onClick={() =>
                setFilters({
                  search: '',
                  category: 'all',
                  flavor: 'all',
                  weightKg: 'all',
                  eggless: 'all',
                  badge: 'all',
                  sortBy: 'featured',
                })
              }
              className="px-6 py-2.5 rounded-full bg-gold-500 text-white text-xs uppercase tracking-widest font-bold shadow-sm hover:bg-gold-600 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>

      {/* Quick View Modal */}
      <CakeModal
        cake={activeQuickViewCake}
        onClose={() => setActiveQuickViewCake(null)}
        onOpenOrderForm={(cake, weightLabel, price) => {
          setActiveQuickViewCake(null);
          handleOpenOrder(cake, weightLabel, price);
        }}
      />

      {/* One-Page Order Booking Form Modal */}
      <OrderFormModal
        cake={activeOrderCake}
        selectedWeightLabel={orderInitialWeight}
        selectedPrice={orderInitialPrice}
        onClose={() => setActiveOrderCake(null)}
      />

    </main>
  );
}
