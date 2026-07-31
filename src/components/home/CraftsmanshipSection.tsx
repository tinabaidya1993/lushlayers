'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Heart, Award, Feather, ArrowRight } from 'lucide-react';

export default function CraftsmanshipSection() {
  return (
    <section id="story" className="scroll-mt-16 py-10 sm:py-12 bg-cream-50 text-charcoal-900 relative overflow-hidden border-t border-warmgray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Visual Showcase - Double Frame */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md border border-warmgray-200">
                <Image
                  src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=85"
                  alt="Gold leafing on cake"
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md border border-warmgray-200 transform translate-y-3">
                <Image
                  src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=85"
                  alt="Handcrafted sugar floral detail"
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
              <span className="text-xs uppercase tracking-[0.2em] font-bold">Made With Love</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-900 tracking-tight font-bold">
              Artisanal Ingredients & 24K Gold Leafing
            </h2>

            <p className="text-xs text-warmgray-600 leading-relaxed font-normal max-w-lg">
              Freshly baked to order using authentic gourmet baking techniques, Valrhona single-origin chocolate, Madagascar bourbon vanilla pods, and organic berries.
            </p>

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
