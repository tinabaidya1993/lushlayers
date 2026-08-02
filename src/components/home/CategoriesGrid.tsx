'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/cakes';
import { CategoryInfo } from '@/types';
import {
  Cake,
  Heart,
  Crown,
  Baby,
  Utensils,
  Gem,
  Flame,
  Sparkles,
  Gift,
  PartyPopper,
  Trophy,
  MessageSquareHeart,
  Cookie,
  PieChart,
  ArrowUpRight,
} from 'lucide-react';

interface CategoryStyle {
  icon: React.ReactNode;
  bgGradient: string;
  glowColor: string;
  borderColor: string;
}

const DEFAULT_STYLE: CategoryStyle = {
  icon: <Cake className="w-9 h-9 text-gold-400 group-hover:scale-110 transition-transform duration-500" />,
  bgGradient: 'from-amber-950 via-charcoal-900 to-charcoal-950',
  glowColor: 'bg-gold-500/20',
  borderColor: 'border-gold-500/30 hover:border-gold-400',
};

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  'birthday-cakes': {
    icon: <Cake className="w-9 h-9 text-gold-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />,
    bgGradient: 'from-amber-950 via-charcoal-900 to-charcoal-950',
    glowColor: 'bg-gold-500/20',
    borderColor: 'border-gold-500/30 hover:border-gold-400',
  },
  'anniversary-cakes': {
    icon: <Heart className="w-9 h-9 text-rose-400 group-hover:scale-110 transition-transform duration-500 animate-pulse" />,
    bgGradient: 'from-rose-950 via-charcoal-900 to-charcoal-950',
    glowColor: 'bg-rose-500/20',
    borderColor: 'border-rose-500/30 hover:border-rose-400',
  },
  'wedding-cakes': {
    icon: <Crown className="w-9 h-9 text-amber-300 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500" />,
    bgGradient: 'from-yellow-950 via-charcoal-900 to-charcoal-950',
    glowColor: 'bg-amber-400/20',
    borderColor: 'border-amber-400/30 hover:border-amber-300',
  },
  'baby-shower-cakes': {
    icon: <Baby className="w-9 h-9 text-sky-300 group-hover:scale-110 transition-transform duration-500" />,
    bgGradient: 'from-sky-950 via-charcoal-900 to-charcoal-950',
    glowColor: 'bg-sky-500/20',
    borderColor: 'border-sky-400/30 hover:border-sky-300',
  },
  'annaprashan-cakes': {
    icon: <Utensils className="w-9 h-9 text-amber-400 group-hover:scale-110 transition-transform duration-500" />,
    bgGradient: 'from-amber-900/80 via-charcoal-900 to-charcoal-950',
    glowColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30 hover:border-amber-400',
  },
  'engagement-cakes': {
    icon: <Gem className="w-9 h-9 text-emerald-300 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />,
    bgGradient: 'from-emerald-950 via-charcoal-900 to-charcoal-950',
    glowColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-400/30 hover:border-emerald-300',
  },
  'bhai-dooj-cakes': {
    icon: <Flame className="w-9 h-9 text-orange-400 group-hover:scale-110 transition-transform duration-500" />,
    bgGradient: 'from-orange-950 via-charcoal-900 to-charcoal-950',
    glowColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30 hover:border-orange-400',
  },
  'valentines-couple-cakes': {
    icon: <Sparkles className="w-9 h-9 text-rose-300 group-hover:scale-110 transition-transform duration-500" />,
    bgGradient: 'from-red-950 via-charcoal-900 to-charcoal-950',
    glowColor: 'bg-red-500/20',
    borderColor: 'border-red-400/30 hover:border-red-300',
  },
  'rakhi-special-cakes': {
    icon: <Gift className="w-9 h-9 text-purple-300 group-hover:scale-110 transition-transform duration-500" />,
    bgGradient: 'from-purple-950 via-charcoal-900 to-charcoal-950',
    glowColor: 'bg-purple-500/20',
    borderColor: 'border-purple-400/30 hover:border-purple-300',
  },
  'any-day-celebration-cakes': {
    icon: <PartyPopper className="w-9 h-9 text-yellow-300 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />,
    bgGradient: 'from-yellow-950 via-charcoal-900 to-charcoal-950',
    glowColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-400/30 hover:border-yellow-300',
  },
  'farewell-success-cakes': {
    icon: <Trophy className="w-9 h-9 text-gold-300 group-hover:scale-110 transition-transform duration-500" />,
    bgGradient: 'from-slate-950 via-charcoal-900 to-charcoal-950',
    glowColor: 'bg-gold-500/20',
    borderColor: 'border-gold-500/30 hover:border-gold-300',
  },
  'bento-message-cakes': {
    icon: <MessageSquareHeart className="w-9 h-9 text-pink-300 group-hover:scale-110 transition-transform duration-500" />,
    bgGradient: 'from-pink-950 via-charcoal-900 to-charcoal-950',
    glowColor: 'bg-pink-500/20',
    borderColor: 'border-pink-400/30 hover:border-pink-300',
  },
  'premium-tub-cakes': {
    icon: <Cookie className="w-9 h-9 text-amber-400 group-hover:scale-110 transition-transform duration-500" />,
    bgGradient: 'from-amber-950 via-charcoal-900 to-charcoal-950',
    glowColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30 hover:border-amber-400',
  },
  'pastries': {
    icon: <PieChart className="w-9 h-9 text-amber-300 group-hover:scale-110 transition-transform duration-500" />,
    bgGradient: 'from-amber-900/60 via-charcoal-900 to-charcoal-950',
    glowColor: 'bg-amber-400/20',
    borderColor: 'border-amber-400/30 hover:border-amber-300',
  },
};

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

        {/* Categories Grid (Pure Dynamic Logo Icons & Luxury Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => {
            const style = CATEGORY_STYLES[cat.id] || DEFAULT_STYLE;

            return (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.id}`}
                className={`group relative rounded-3xl overflow-hidden bg-gradient-to-br ${style.bgGradient} border ${style.borderColor} shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between min-h-[240px] p-6 transform-gpu hover:-translate-y-1`}
              >
                {/* Glowing Backdrop Blob */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${style.glowColor} group-hover:scale-150 transition-transform duration-700 pointer-events-none`}></div>

                {/* Top Bar: Dynamic Logo Icon & Arrow */}
                <div className="relative z-10 flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner group-hover:bg-white/20 transition-all duration-300">
                    {style.icon}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full text-[10px] uppercase font-extrabold tracking-wider bg-gold-500/20 backdrop-blur-md text-gold-300 border border-gold-400/30">
                      {cat.badge || cat.group || 'Collection'}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 group-hover:bg-gold-500 group-hover:text-white transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Content Details & Description */}
                <div className="relative z-10 space-y-2 pt-4">
                  <span className="text-[11px] text-gold-400 font-bold uppercase tracking-wider block">
                    {cat.group || 'Cake Category'}
                  </span>
                  
                  <h3 className="font-serif text-lg sm:text-xl text-white font-bold group-hover:text-gold-300 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-warmgray-300 font-normal leading-relaxed line-clamp-2">
                    {cat.description || cat.tagline}
                  </p>

                  {/* Subcategories tags */}
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cat.subcategories.map((sub) => (
                        <span key={sub} className="text-[9px] font-semibold bg-white/10 text-gold-200 px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-xs">
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
