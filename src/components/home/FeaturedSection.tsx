'use client';

import React, { useState } from 'react';
import CakeCard from '@/components/ui/CakeCard';
import CakeModal from '@/components/ui/CakeModal';
import { CAKES_DATA } from '@/data/cakes';
import { CakeItem } from '@/types';
import { Sparkles } from 'lucide-react';

export default function FeaturedSection() {
  const [selectedCake, setSelectedCake] = useState<CakeItem | null>(null);

  // Show 4 signature cakes in compact grid
  const featuredCakes = CAKES_DATA.slice(0, 4);

  return (
    <section id="featured" className="scroll-mt-16 py-10 sm:py-14 bg-white text-charcoal-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Non-Colliding Responsive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-6">
          <div className="flex items-center space-x-2 text-gold-700">
            <Sparkles className="w-4 h-4 text-gold-600 flex-shrink-0" />
            <h2 className="font-serif text-xl sm:text-3xl text-charcoal-900 font-bold tracking-tight">
              Featured Signature Cakes
            </h2>
          </div>
          <span className="text-[11px] sm:text-xs text-warmgray-500 font-medium">Click cake for details</span>
        </div>

        {/* High Density Responsive Grid (2 cols mobile -> 3 cols tablet -> 4 cols desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {featuredCakes.map((cake) => (
            <CakeCard
              key={cake.id}
              cake={cake}
              onQuickView={(item) => setSelectedCake(item)}
            />
          ))}
        </div>

        {/* Quick View Modal */}
        <CakeModal cake={selectedCake} onClose={() => setSelectedCake(null)} />

      </div>
    </section>
  );
}
