'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES } from '@/data/cakes';
import { CategoryInfo } from '@/types';
import { ArrowUpRight, Sparkles, Cake, PartyPopper, HeartHandshake, Tag } from 'lucide-react';

export default function CategoriesGrid() {
  const [categories, setCategories] = useState<CategoryInfo[]>(CATEGORIES);
  const [activeGroup, setActiveGroup] = useState<string>('All');

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
      } catch (err) {}
    }
    loadCategories();
  }, []);

  const groups = ['All', 'Celebration Cakes', 'Special Occasion Cakes', 'Signature Collection'];

  const filteredCategories = activeGroup === 'All' 
    ? categories 
    : categories.filter((c) => c.group === activeGroup);

  return (
    <section id="categories" className="scroll-mt-16 py-12 sm:py-16 bg-cream-100 text-charcoal-900 relative border-t border-b border-warmgray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-gold-700 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Explore Our Masterpiece Collections</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-charcoal-900 font-bold tracking-tight">
              Cake Categories
            </h2>
          </div>

          {/* Group Filter Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1">
            {groups.map((grp) => (
              <button
                key={grp}
                onClick={() => setActiveGroup(grp)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeGroup === grp
                    ? 'bg-charcoal-900 text-gold-400 shadow-md scale-105'
                    : 'bg-white text-warmgray-700 hover:bg-warmgray-200 border border-warmgray-200'
                }`}
              >
                {grp === 'Celebration Cakes' ? '🎂 Celebration' : grp === 'Special Occasion Cakes' ? '🎉 Special Occasions' : grp === 'Signature Collection' ? '🍰 Signature' : '✨ All Collections'}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="group relative rounded-3xl overflow-hidden bg-white border border-warmgray-200 shadow-sm hover:shadow-luxury-hover transition-all duration-300 flex flex-col justify-between min-h-[260px] p-6 transform-gpu hover:-translate-y-1"
            >
              <Image
                src={cat.heroImage}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-900/40 to-transparent"></div>

              {/* Badge */}
              <div className="relative z-10 flex justify-between items-start">
                <span className="px-3 py-1 rounded-full text-[10px] uppercase font-extrabold tracking-wider bg-white/90 backdrop-blur-md text-charcoal-900 border border-white/50 shadow-xs">
                  {cat.badge || cat.group || 'Collection'}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-gold-500 group-hover:text-white transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 space-y-1.5">
                <span className="text-[11px] text-gold-400 font-bold uppercase tracking-wider block">
                  {cat.group || 'Cake Category'}
                </span>
                <h3 className="font-serif text-lg sm:text-xl text-white font-bold group-hover:text-gold-300 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-warmgray-200 line-clamp-2 font-normal">
                  {cat.tagline || cat.description}
                </p>

                {/* Subcategories preview tags */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {cat.subcategories.map((sub) => (
                      <span key={sub} className="text-[9px] font-medium bg-black/40 text-warmgray-200 px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/10">
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
