'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  FolderOpen
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
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [cakes, setCakes] = useState<CakeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Default COLLAPSED state for all categories
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catRes, cakesRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/cakes'),
        ]);

        const catData = await catRes.json();
        const cakesData = await cakesRes.json();

        if (catData.success && Array.isArray(catData.categories)) {
          setCategories(catData.categories);
        } else {
          setCategories([]);
        }

        if (cakesData.success && Array.isArray(cakesData.cakes)) {
          setCakes(cakesData.cakes);
        } else {
          setCakes([]);
        }
      } catch (err) {
        setCategories([]);
        setCakes([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  // Compute live cake count per category ID
  const cakeCounts: Record<string, number> = {};
  cakes.forEach((cake) => {
    const catId = cake.category;
    if (catId) {
      cakeCounts[catId] = (cakeCounts[catId] || 0) + 1;
    }
  });

  // HIDE EMPTY CATEGORIES IF CAKES EXIST IN DB
  const hasAnyCakesInDb = cakes.length > 0;
  const visibleCategories = hasAnyCakesInDb
    ? categories.filter((cat) => (cakeCounts[cat.id] || 0) > 0)
    : categories;

  // Group categories dynamically by Parent Group
  const groupsMap: Record<string, CategoryInfo[]> = {};
  visibleCategories.forEach((cat) => {
    const groupName = cat.group || 'Celebration Cakes';
    if (!groupsMap[groupName]) {
      groupsMap[groupName] = [];
    }
    groupsMap[groupName].push(cat);
  });

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
            {visibleCategories.length} {visibleCategories.length === 1 ? 'Category' : 'Categories'}
          </span>
        </div>

        {/* ULTRA-THIN COLLAPSED BY DEFAULT DROPDOWN LIST WITH SMOOTH ANIMATIONS */}
        {loading ? (
          <div className="py-8 text-center text-xs text-warmgray-500 font-medium">
            Loading categories...
          </div>
        ) : visibleCategories.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-warmgray-200 space-y-2">
            <FolderOpen className="w-8 h-8 text-warmgray-400 mx-auto" />
            <p className="text-xs text-warmgray-600 font-bold">No active categories found</p>
            <p className="text-[11px] text-warmgray-500">
              Add your first cake category from the Admin Panel.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {Object.keys(groupsMap).map((groupTitle) => {
              const groupCats = groupsMap[groupTitle];
              const isExpanded = !!expandedGroups[groupTitle];

              return (
                <div
                  key={groupTitle}
                  className="bg-white rounded-xl border border-warmgray-200/90 shadow-2xs overflow-hidden transition-all duration-300 hover:border-gold-400"
                >
                  {/* Ultra-Thin Group Accordion Trigger */}
                  <button
                    onClick={() => toggleGroup(groupTitle)}
                    className="w-full px-3.5 py-2.5 sm:py-3 flex items-center justify-between bg-gradient-to-r from-cream-100/90 via-white to-cream-50 hover:bg-cream-100 transition-colors cursor-pointer text-left"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                      <span className="font-serif text-xs sm:text-sm font-bold text-charcoal-900 tracking-tight">
                        {groupTitle}
                      </span>
                      <span className="text-[10px] font-bold text-warmgray-500 bg-cream-200/80 px-2 py-0.2 rounded-full font-mono">
                        {groupCats.length}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-warmgray-500">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gold-700 hidden sm:inline-block">
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 text-gold-600 transition-transform duration-300 ${
                          isExpanded ? 'rotate-90' : 'rotate-0'
                        }`}
                      />
                    </div>
                  </button>

                  {/* Collapsed/Expanded Parent-Child Content */}
                  {isExpanded && (
                    <div className="border-t border-warmgray-200/60 divide-y divide-warmgray-100 bg-white animate-fade-in">
                      {groupCats.map((cat) => {
                        const count = cakeCounts[cat.id] || 0;
                        const icon = CATEGORY_ICONS[cat.id] || <Cake className="w-3.5 h-3.5 text-gold-600" />;

                        return (
                          <Link
                            key={cat.id}
                            href={`/catalog?category=${cat.id}`}
                            className="px-4 sm:px-5 py-2 flex items-center justify-between hover:bg-gold-50/50 transition-colors group"
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <div className="w-5 h-5 rounded bg-cream-100 group-hover:bg-gold-100 flex items-center justify-center flex-shrink-0 transition-colors">
                                {icon}
                              </div>
                              <span className="font-sans text-xs font-bold text-charcoal-800 group-hover:text-gold-700 truncate transition-colors">
                                {cat.name}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1.5 flex-shrink-0 pl-2">
                              {hasAnyCakesInDb && (
                                <span className="text-[10px] font-bold text-warmgray-500 group-hover:text-gold-700 font-mono">
                                  ({count} {count === 1 ? 'Cake' : 'Cakes'})
                                </span>
                              )}
                              <ArrowUpRight className="w-3 h-3 text-warmgray-400 group-hover:text-gold-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
