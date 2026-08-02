'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CakeCard from '@/components/ui/CakeCard';
import CakeModal from '@/components/ui/CakeModal';
import { CakeItem } from '@/types';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function CatalogPreview() {
  const [cakes, setCakes] = useState<CakeItem[]>([]);
  const [selectedCake, setSelectedCake] = useState<CakeItem | null>(null);

  useEffect(() => {
    fetch(`/api/cakes?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.cakes)) {
          setCakes(data.cakes);
        } else {
          setCakes([]);
        }
      })
      .catch(() => setCakes([]));
  }, []);

  const previewCakes = cakes.slice(0, 4);

  if (previewCakes.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-14 bg-white text-charcoal-900 relative border-t border-warmgray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 text-gold-700">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-bold tracking-tight">
              Celebration & Artisanal Cakes
            </h2>
          </div>
          
          <Link
            href="/catalog"
            className="group inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-gold-700 hover:text-gold-800 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* High Density 2-to-4 Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 mb-8">
          {previewCakes.map((cake) => (
            <CakeCard
              key={cake.id}
              cake={cake}
              onQuickView={(item) => setSelectedCake(item)}
            />
          ))}
        </div>

        {/* Bottom Primary Button */}
        <div className="text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center space-x-2 bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-widest px-7 py-3 rounded-full transition-all shadow-gold-soft hover:scale-105"
          >
            <span>View Complete Atelier Catalog ({cakes.length} Cakes)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Modal */}
        <CakeModal cake={selectedCake} onClose={() => setSelectedCake(null)} />

      </div>
    </section>
  );
}
