'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/cakes';
import { CategoryInfo, CakeItem } from '@/types';
import {
  Sparkles,
  Cake,
  Heart,
  Crown,
  Baby,
  Utensils,
  Gem,
  Flame,
  Gift,
  PartyPopper,
  Trophy,
  MessageSquareHeart,
  Cookie,
  PieChart,
  ChevronRight,
  ArrowUpRight,
  ShoppingBag
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'birthday-cakes': <Cake className="w-3.5 h-3.5 text-amber-600" />,
  'anniversary-cakes': <Heart className="w-3.5 h-3.5 text-rose-600" />,
  'wedding-cakes': <Crown className="w-3.5 h-3.5 text-gold-600" />,
  'baby-shower-cakes': <Baby className="w-3.5 h-3.5 text-sky-600" />,
  'annaprashan-cakes': <Utensils className="w-3.5 h-3.5 text-amber-600" />,
  'engagement-cakes': <Gem className="w-3.5 h-3.5 text-emerald-600" />,
  'bhai-dooj-cakes': <Flame className="w-3.5 h-3.5 text-orange-600" />,
  'valentines-couple-cakes': <Sparkles className="w-3.5 h-3.5 text-rose-600" />,
  'rakhi-special-cakes': <Gift className="w-3.5 h-3.5 text-purple-600" />,
  'any-day-celebration-cakes': <PartyPopper className="w-3.5 h-3.5 text-yellow-600" />,
  'farewell-success-cakes': <Trophy className="w-3.5 h-3.5 text-gold-600" />,
  'bento-message-cakes': <MessageSquareHeart className="w-3.5 h-3.5 text-pink-600" />,
  'premium-tub-cakes': <Cookie className="w-3.5 h-3.5 text-amber-700" />,
  'pastries': <PieChart className="w-3.5 h-3.5 text-amber-600" />,
};

export default function CategoriesGrid() {
  const [categories, setCategories] = useState<CategoryInfo[]>(CATEGORIES);
  const [cakes, setCakes] = useState<CakeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Default COLLAPSED state for all categories
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catRes, cakesRes] = await Promise.all([
          fetch('/api/categories', { cache: 'no-store' }),
          fetch('/api/cakes', { cache: 'no-store' }),
        ]);

        const catData = await catRes.json();
        const cakesData = await cakesRes.json();

        if (catData.success && Array.isArray(catData.categories) && catData.categories.length > 0) {
          setCategories(catData.categories);
        }
        if (cakesData.success && Array.isArray(cakesData.cakes)) {
          setCakes(cakesData.cakes);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute live cake count per category ID
  const cakeCounts: Record<string, number> = {};
  cakes.forEach((cake) => {
    const catId = cake.category;
    cakeCounts[catId] = (cakeCounts[catId] || 0) + 1;
  });

  // HIDE EMPTY CATEGORIES IF CAKES EXIST IN DB
  const hasAnyCakesInDb = cakes.length > 0;
  const visibleCategories = hasAnyCakesInDb
    ? categories.filter((cat) => (cakeCounts[cat.id] || 0) > 0)
    : categories;

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const groups = [
    { title: 'Celebration Cakes', icon: '🎂' },
    { title: 'Special Occasion Cakes', icon: '🎉' },
    { title: 'Signature Collection', icon: '🍰' },
  ];

  return (
    <section id="categories" className="scroll-mt-16 py-8 sm:py-12 bg-cream-50 text-charcoal-900 relative border-t border-b border-warmgray-200/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
        
        {/* Sleek Minimal Section Header */}
        <div className="flex items-center justify-between border-b border-warmgray-200/80 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
            <h2 className="font-serif text-lg sm:text-2xl text-charcoal-900 font-bold tracking-tight">
              Cake Categories
            </h2>
          </div>

          <span className="text-[10px] text-gold-800 font-bold uppercase tracking-widest bg-gold-50 px-2.5 py-0.5 rounded-full border border-gold-300/80">
            {visibleCategories.length} Categories
          </span>
        </div>

        {/* ULTRA-THIN COLLAPSED BY DEFAULT DROPDOWN LIST WITH SMOOTH ANIMATIONS */}
        <div className="space-y-2.5">
          {groups.map((grp) => {
            const groupCats = visibleCategories.filter(
              (c) => (c.group || 'Celebration Cakes') === grp.title
            );

            // Hide parent group if no child category has cakes inside it
            if (hasAnyCakesInDb && groupCats.length === 0) {
              return null;
            }

            const isExpanded = !!expandedGroups[grp.title];

            return (
              <div
                key={grp.title}
                className="bg-white rounded-xl border border-warmgray-200/90 shadow-2xs overflow-hidden transition-all duration-300 hover:border-gold-300"
              >
                {/* Ultra-Thin Parent Group Header */}
                <button
                  onClick={() => toggleGroup(grp.title)}
                  className="w-full px-3.5 py-2.5 bg-gradient-to-r from-cream-50 via-white to-cream-50 hover:bg-gold-50/50 flex items-center justify-between transition-colors text-left group"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="text-base">{grp.icon}</span>
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-charcoal-900 group-hover:text-gold-700 transition-colors truncate">
                      {grp.title}
                    </h3>
                    <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-cream-100 text-charcoal-800 border border-warmgray-200">
                      {groupCats.length}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-warmgray-400 group-hover:text-gold-600 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-warmgray-500 hidden sm:inline">
                      {isExpanded ? 'Collapse' : 'Expand'}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        isExpanded ? 'rotate-90 text-gold-600' : 'rotate-0'
                      }`}
                    />
                  </div>
                </button>

                {/* Ultra-Thin Smooth Animated Child Category List */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? 'max-h-[500px] opacity-100 border-t border-warmgray-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="divide-y divide-warmgray-100 bg-white">
                    {groupCats.map((cat) => {
                      const count = cakeCounts[cat.id] || 0;
                      const icon = CATEGORY_ICONS[cat.id] || <Cake className="w-3.5 h-3.5 text-gold-600" />;

                      return (
                        <Link
                          key={cat.id}
                          href={`/catalog?category=${cat.id}`}
                          className="px-3.5 py-1.5 hover:bg-gold-50/40 flex items-center justify-between transition-colors group cursor-pointer"
                        >
                          {/* Left: Icon + Thin Title */}
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className="p-1 rounded bg-cream-100 group-hover:bg-white text-gold-600 transition-colors flex-shrink-0 border border-warmgray-100">
                              {icon}
                            </div>
                            <span className="text-[11px] sm:text-xs font-semibold text-charcoal-800 group-hover:text-gold-700 transition-colors truncate">
                              {cat.name}
                            </span>
                          </div>

                          {/* Right: Micro Count Badge & Animated Icon */}
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <span className="text-[9px] font-bold uppercase px-2 py-0.2 rounded-full bg-cream-100 text-warmgray-700 border border-warmgray-200 group-hover:border-gold-300 group-hover:bg-gold-50 transition-colors">
                              {count} Cake{count !== 1 ? 's' : ''}
                            </span>
                            <ArrowUpRight className="w-3 h-3 text-warmgray-400 group-hover:text-gold-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Failsafe Notice when NO cakes exist in any category yet */}
        {!loading && hasAnyCakesInDb && visibleCategories.length === 0 && (
          <div className="p-4 rounded-xl bg-white border border-warmgray-200 text-center space-y-1">
            <ShoppingBag className="w-5 h-5 text-warmgray-400 mx-auto" />
            <p className="text-xs font-bold text-charcoal-900">
              No categories currently have active cakes.
            </p>
            <p className="text-[10px] text-warmgray-500">
              Add cakes under categories in Admin Panel to automatically reveal them here.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
