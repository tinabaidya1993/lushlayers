'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Heart, Award, Feather, ArrowRight } from 'lucide-react';

interface OurStoryData {
  badgeTagline?: string;
  title?: string;
  description?: string;
  bakerName?: string;
  image1?: string;
  image2?: string;
}

export default function CraftsmanshipSection() {
  const [story, setStory] = useState<OurStoryData>({
    badgeTagline: 'Made With Love & Passion',
    title: 'Artisanal Ingredients & 24K Gold Leafing',
    description: 'Freshly baked to order using authentic gourmet baking techniques, Valrhona single-origin chocolate, Madagascar bourbon vanilla pods, and organic berries.',
    bakerName: 'Tina Manna (Owner & Pastry Chef)',
    image1: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=85',
    image2: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=85',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.ourStory) {
          const s = data.settings.ourStory;
          setStory({
            badgeTagline: s.badgeTagline || 'Made With Love & Passion',
            title: s.title || 'Artisanal Ingredients & 24K Gold Leafing',
            description: s.description || 'Freshly baked to order using authentic gourmet baking techniques, Valrhona single-origin chocolate, Madagascar bourbon vanilla pods, and organic berries.',
            bakerName: s.bakerName || 'Tina Manna (Owner & Pastry Chef)',
            image1: s.image1 || 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=85',
            image2: s.image2 || 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=85',
          });
        }
      })
      .catch((err) => console.warn('Our story fetch error:', err));
  }, []);

  return (
    <section id="story" className="scroll-mt-16 py-10 sm:py-14 bg-cream-50 text-charcoal-900 relative overflow-hidden border-t border-warmgray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Visual Showcase - Double Frame */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md border border-warmgray-200 bg-white">
                <Image
                  src={story.image1 || 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=85'}
                  alt="Our Story Craftsmanship 1"
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md border border-warmgray-200 transform translate-y-3 bg-white">
                <Image
                  src={story.image2 || 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=85'}
                  alt="Our Story Craftsmanship 2"
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Editorial Text */}
          <div className="lg:col-span-7 space-y-3 lg:pl-4 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center space-x-2 text-gold-700">
              <Heart className="w-4 h-4 text-gold-600 fill-current" />
              <span className="text-xs uppercase tracking-[0.2em] font-bold">
                {story.badgeTagline || 'Made With Love & Passion'}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-900 tracking-tight font-bold">
              {story.title || 'Artisanal Ingredients & 24K Gold Leafing'}
            </h2>

            <p className="text-xs text-warmgray-600 leading-relaxed font-normal max-w-lg">
              {story.description}
            </p>

            {story.bakerName && (
              <p className="text-[11px] font-serif font-bold italic text-gold-800">
                — {story.bakerName}
              </p>
            )}

            <div className="pt-2">
              <Link
                href="/custom-cake"
                className="inline-flex items-center space-x-2 bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full transition-all shadow-gold-soft"
              >
                <span>Custom Cake Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
