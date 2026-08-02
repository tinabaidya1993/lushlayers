'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import CakeCard from '@/components/ui/CakeCard';
import CakeModal from '@/components/ui/CakeModal';
import OrderFormModal from '@/components/catalog/OrderFormModal';
import SmartFilterBar, { CatalogFilterState } from '@/components/catalog/SmartFilterBar';
import { CakeItem } from '@/types';
import { Sparkles, SlidersHorizontal, PackageOpen } from 'lucide-react';

export default function CatalogPage() {
  const [cakes, setCakes] = useState<CakeItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchLiveCakes();
  }, []);

  const fetchLiveCakes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cakes?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.cakes)) {
        setCakes(data.cakes);
      } else {
        setCakes([]);
      }
    } catch (err) {
      console.warn('Catalog live cakes fetch error:', err);
      setCakes([]);
    } finally {
      setLoading(false);
    }
  };

  // Instant Smart Filter Logic
  const filteredCakes = useMemo(() => {
    let result = [...cakes];

    // 1. Search Query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.shortDescription && c.shortDescription.toLowerCase().includes(q)) ||
          (c.category && c.category.toLowerCase().includes(q)) ||
          (c.flavors && c.flavors.some((f) => f.toLowerCase().includes(q))) ||
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
        c.flavors && c.flavors.some((fl) => fl.toLowerCase().includes(fQ))
      );
    }

    // 4. Weight Filter
    if (filters.weightKg !== 'all') {
      const targetKg = parseFloat(filters.weightKg);
      result = result.filter((c) =>
        c.weightOptions && c.weightOptions.some((w) => Math.abs(w.weightKg - targetKg) < 0.2)
      );
    }

    // 5. Eggless Filter
    if (filters.eggless !== 'all') {
      const isEgglessTarget = filters.eggless === 'true';
      result = result.filter((c) => c.eggless === isEgglessTarget);
    }

    // 6. Special Badge Filter
    if (filters.badge !== 'all') {
      if (filters.badge === 'bestseller') result = result.filter((c) => c.bestseller);
      if (filters.badge === 'featured') result = result.filter((c) => c.featured);
      if (filters.badge === 'newArrival') result = result.filter((c) => c.newArrival);
    }

    // 7. Sort Options
    if (filters.sortBy === 'price-low') {
      result.sort((a, b) => a.priceStartingFrom - b.priceStartingFrom);
    } else if (filters.sortBy === 'price-high') {
      result.sort((a, b) => b.priceStartingFrom - a.priceStartingFrom);
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    }

    return result;
  }, [cakes, filters]);

  const handleOrderNow = (cake: CakeItem, weightLabel?: string, price?: number) => {
    setActiveOrderCake(cake);
    setOrderInitialWeight(weightLabel || (cake.weightOptions && cake.weightOptions[0] ? cake.weightOptions[0].label : cake.servings));
    setOrderInitialPrice(price || cake.priceStartingFrom);
  };

  return (
    <div className="bg-cream-50/50 min-h-screen text-charcoal-900 pb-16">
      
      {/* Catalog Header Hero Banner */}
      <div className="bg-gradient-to-b from-cream-100 to-cream-50 border-b border-warmgray-200/60 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>100% Eggless Home-Baked Atelier</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 tracking-tight">
            Our Complete Cake Gallery
          </h1>

          <p className="text-xs sm:text-sm text-warmgray-600 max-w-2xl mx-auto font-medium">
            Explore our handcrafted luxury cakes baked fresh in Kolkata. Filter by flavor, weight size, or custom occasion.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Smart Filter Bar */}
        <SmartFilterBar filters={filters} onFilterChange={setFilters} />

        {/* Catalog Grid View */}
        {loading ? (
          <div className="py-20 text-center text-xs font-bold text-warmgray-500">
            Loading live cake gallery...
          </div>
        ) : filteredCakes.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-warmgray-200 p-8 space-y-3 shadow-xs">
            <PackageOpen className="w-12 h-12 text-warmgray-400 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-charcoal-900">No Cakes Found</h3>
            <p className="text-xs text-warmgray-500 max-w-md mx-auto">
              No signature cakes match your active search or filter criteria. Try clearing filters or submit a custom cake request!
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
              className="px-5 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredCakes.map((cake) => (
              <CakeCard
                key={cake.id}
                cake={cake}
                onQuickView={(item) => setActiveQuickViewCake(item)}
                onOrderNow={(item) => handleOrderNow(item)}
              />
            ))}
          </div>
        )}

      </div>

      {/* QUICK VIEW MODAL */}
      <CakeModal
        cake={activeQuickViewCake}
        onClose={() => setActiveQuickViewCake(null)}
        onOpenOrderForm={(cake, weightLabel, price) => {
          setActiveQuickViewCake(null);
          handleOrderNow(cake, weightLabel, price);
        }}
      />

      {/* ORDER BOOKING FORM MODAL */}
      <OrderFormModal
        cake={activeOrderCake}
        selectedWeightLabel={orderInitialWeight}
        selectedPrice={orderInitialPrice}
        onClose={() => setActiveOrderCake(null)}
      />

    </div>
  );
}
