'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CakeCard from '@/components/ui/CakeCard';
import CakeModal from '@/components/ui/CakeModal';
import OrderFormModal from '@/components/catalog/OrderFormModal';
import { CAKES_DATA } from '@/data/cakes';
import { CakeItem } from '@/types';
import { Sparkles, Flame, ArrowRight, Star } from 'lucide-react';

export default function FeaturedSection() {
  const [selectedQuickViewCake, setSelectedQuickViewCake] = useState<CakeItem | null>(null);
  const [selectedOrderCake, setSelectedOrderCake] = useState<CakeItem | null>(null);
  const [selectedOrderWeight, setSelectedOrderWeight] = useState<string>('');
  const [selectedOrderPrice, setSelectedOrderPrice] = useState<number>(0);

  // Filter 3 distinct collections for homepage
  const featuredCakes = CAKES_DATA.filter((c) => c.featured || c.bestseller).slice(0, 4);
  const bestsellerCakes = CAKES_DATA.filter((c) => c.bestseller).slice(0, 4);
  const newArrivalCakes = CAKES_DATA.filter((c) => c.newArrival || !c.bestseller).slice(0, 4);

  const handleOrderNow = (cake: CakeItem, weightLabel?: string, price?: number) => {
    setSelectedOrderCake(cake);
    setSelectedOrderWeight(weightLabel || (cake.weightOptions && cake.weightOptions[0] ? cake.weightOptions[0].label : cake.servings));
    setSelectedOrderPrice(price || cake.priceStartingFrom);
  };

  return (
    <div className="bg-white text-charcoal-900">
      
      {/* 1. FEATURED SIGNATURE CAKES SECTION */}
      <section id="featured" className="scroll-mt-16 py-10 sm:py-14 border-b border-warmgray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-6">
            <div className="flex items-center space-x-2 text-gold-700">
              <Sparkles className="w-4.5 h-4.5 text-gold-600 flex-shrink-0" />
              <h2 className="font-serif text-xl sm:text-3xl text-charcoal-900 font-bold tracking-tight">
                Featured Signature Cakes
              </h2>
            </div>
            <Link
              href="/catalog"
              className="text-xs font-bold uppercase tracking-wider text-gold-700 hover:text-gold-800 flex items-center space-x-1"
            >
              <span>View All Collection →</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {featuredCakes.map((cake) => (
              <CakeCard
                key={cake.id}
                cake={cake}
                onQuickView={(item) => setSelectedQuickViewCake(item)}
                onOrderNow={(item) => handleOrderNow(item)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 2. TRENDING BESTSELLERS SECTION */}
      <section className="py-10 sm:py-14 bg-cream-50/70 border-b border-warmgray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-6">
            <div>
              <div className="flex items-center space-x-2 text-amber-700 mb-0.5">
                <Flame className="w-4.5 h-4.5 text-amber-600 flex-shrink-0" />
                <h3 className="font-serif text-xl sm:text-3xl text-charcoal-900 font-bold tracking-tight">
                  Most Loved Bestsellers
                </h3>
              </div>
              <p className="text-xs text-warmgray-600 font-medium">Top ordered 100% eggless home-baked cakes by Kolkata cake lovers</p>
            </div>

            <Link
              href="/catalog?badge=bestseller"
              className="text-xs font-bold uppercase tracking-wider text-gold-700 hover:text-gold-800 flex items-center space-x-1"
            >
              <span>See All Bestsellers →</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {bestsellerCakes.map((cake) => (
              <CakeCard
                key={`best-${cake.id}`}
                cake={cake}
                onQuickView={(item) => setSelectedQuickViewCake(item)}
                onOrderNow={(item) => handleOrderNow(item)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 3. NEWEST SEASONAL CREATIONS SECTION */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-6">
            <div>
              <div className="flex items-center space-x-2 text-emerald-700 mb-0.5">
                <Star className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />
                <h3 className="font-serif text-xl sm:text-3xl text-charcoal-900 font-bold tracking-tight">
                  Newest Home-Baked Arrivals
                </h3>
              </div>
              <p className="text-xs text-warmgray-600 font-medium">Fresh custom designs handcrafted by Tina Baidya</p>
            </div>

            <Link
              href="/catalog"
              className="text-xs font-bold uppercase tracking-wider text-gold-700 hover:text-gold-800 flex items-center space-x-1"
            >
              <span>Explore All Designs →</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {newArrivalCakes.map((cake) => (
              <CakeCard
                key={`new-${cake.id}`}
                cake={cake}
                onQuickView={(item) => setSelectedQuickViewCake(item)}
                onOrderNow={(item) => handleOrderNow(item)}
              />
            ))}
          </div>

          {/* EXPLORE FULL CATALOG CALL-TO-ACTION BANNER (CRYSTAL CLEAR HIGH CONTRAST) */}
          <div className="mt-12 bg-charcoal-900 rounded-3xl p-6 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl border border-gold-500/50">
            <div className="space-y-2.5 text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-[0.2em] text-gold-400 font-bold block">100% Eggless Home-Baked Atelier</span>
              <h4 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                Want to Explore Our Full 100+ Custom Cake Collection?
              </h4>
              <p className="text-xs sm:text-sm text-warmgray-300 max-w-xl leading-relaxed font-normal">
                Filter by flavor profile, weight size, dietary preference, and occasion on our full interactive gallery page.
              </p>
            </div>

            <Link
              href="/catalog"
              className="px-8 py-4 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-widest flex items-center space-x-2 shadow-lg transition-all whitespace-nowrap flex-shrink-0 active:scale-95 cursor-pointer"
            >
              <span>View Entire Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* QUICK VIEW MODAL */}
      <CakeModal
        cake={selectedQuickViewCake}
        onClose={() => setSelectedQuickViewCake(null)}
        onOpenOrderForm={(cake, weightLabel, price) => {
          setSelectedQuickViewCake(null);
          handleOrderNow(cake, weightLabel, price);
        }}
      />

      {/* ORDER BOOKING MODAL */}
      <OrderFormModal
        cake={selectedOrderCake}
        selectedWeightLabel={selectedOrderWeight}
        selectedPrice={selectedOrderPrice}
        onClose={() => setSelectedOrderCake(null)}
      />

    </div>
  );
}
