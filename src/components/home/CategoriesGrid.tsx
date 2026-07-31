'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES } from '@/data/cakes';
import { ArrowUpRight, Crown, Sparkles, Star, Palette, Flower2 } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  wedding: <Crown className="w-4 h-4 text-gold-500" />,
  signature: <Sparkles className="w-4 h-4 text-gold-500" />,
  birthday: <Star className="w-4 h-4 text-gold-500" />,
  artisanal: <Palette className="w-4 h-4 text-gold-500" />,
  vegan: <Flower2 className="w-4 h-4 text-gold-500" />,
};

export default function CategoriesGrid() {
  return (
    <section id="categories" className="scroll-mt-16 py-10 sm:py-12 bg-cream-100 text-charcoal-900 relative border-t border-b border-warmgray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Responsive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-6">
          <h2 className="font-serif text-xl sm:text-3xl text-charcoal-900 font-bold tracking-tight">
            Browse by Category
          </h2>
          <span className="text-[11px] sm:text-xs text-gold-700 font-bold uppercase tracking-wider">5 Collections</span>
        </div>

        {/* Compact Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="group relative rounded-2xl overflow-hidden min-h-[160px] sm:min-h-[200px] flex flex-col justify-end p-3.5 sm:p-4 shadow-sm hover:shadow-luxury-hover transition-all duration-300 border border-warmgray-200 transform-gpu"
            >
              <Image
                src={cat.heroImage}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/85 via-charcoal-900/30 to-transparent"></div>

              <div className="relative z-10 space-y-1">
                <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-1">
                  {CATEGORY_ICONS[cat.id]}
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-xs sm:text-base text-white font-bold group-hover:text-gold-300 transition-colors line-clamp-1">
                    {cat.name.split(' ')[0]}
                  </h3>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white flex-shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
