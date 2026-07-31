'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, MessageCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { buildGeneralInquiryWhatsAppUrl } from '@/lib/whatsapp';
import { CAKES_DATA } from '@/data/cakes';

export default function Hero() {
  const whatsappUrl = buildGeneralInquiryWhatsAppUrl();
  const heroCakes = CAKES_DATA.filter((c) => c.featured || c.bestseller).slice(0, 4);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto carousel rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % heroCakes.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroCakes.length]);

  const activeCake = heroCakes[currentIdx] || heroCakes[0];

  return (
    <section className="relative bg-gradient-to-b from-cream-100 via-white to-cream-50 text-charcoal-900 pt-20 pb-6 sm:pt-24 sm:pb-8 overflow-hidden border-b border-warmgray-200/60">
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Main Compact Hero Copy (Centered on Tablet & Mobile, Left-aligned on Desktop) */}
          <div className="lg:col-span-6 space-y-3.5 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-gold-400 text-gold-700 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                Lush Layers • Made With Love
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-charcoal-900 font-normal">
              Bespoke Luxury <br />
              <span className="italic text-gold-700 font-serif">Artisanal Cakes</span>
            </h1>

            <p className="text-xs sm:text-sm text-warmgray-600 font-normal leading-relaxed max-w-md text-center lg:text-left">
              Handcrafted wedding tiers, celebration cakes & 100% eggless luxury desserts. Ordered directly via WhatsApp.
            </p>

            <div className="pt-1 flex flex-wrap gap-3 items-center justify-center lg:justify-start">
              <Link
                href="/catalog"
                className="group inline-flex items-center space-x-2 bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-all shadow-gold-soft hover:scale-105 active:scale-95 transform-gpu"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all shadow-sm active:scale-95 transform-gpu"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Order</span>
              </a>
            </div>

          </div>

          {/* DYNAMIC FEATURED HERO CAKE CAROUSEL CARD */}
          <div className="lg:col-span-6 relative mt-2 lg:mt-0">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-luxury border border-warmgray-200 bg-white group transform-gpu">
                <Image
                  src={activeCake.image}
                  alt={activeCake.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700"
                />
                
                {/* Floating Info Overlay Bar */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-warmgray-200 shadow-sm flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gold-700 block">
                      Featured ({currentIdx + 1}/{heroCakes.length})
                    </span>
                    <h3 className="font-serif text-sm font-bold text-charcoal-900 truncate max-w-[180px] sm:max-w-[240px]">
                      {activeCake.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-sm font-bold text-gold-700 block">From ₹{activeCake.priceStartingFrom.toLocaleString()}</span>
                    <Link href={`/cake/${activeCake.id}`} className="text-[10px] font-bold text-charcoal-900 hover:text-gold-700 underline">
                      View Cake →
                    </Link>
                  </div>
                </div>

                {/* Carousel Controls */}
                <button
                  onClick={() => setCurrentIdx((prev) => (prev === 0 ? heroCakes.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 text-charcoal-900 flex items-center justify-center shadow-sm opacity-80 hover:opacity-100 transition-opacity"
                  aria-label="Previous Hero Cake"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentIdx((prev) => (prev + 1) % heroCakes.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 text-charcoal-900 flex items-center justify-center shadow-sm opacity-80 hover:opacity-100 transition-opacity"
                  aria-label="Next Hero Cake"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dots */}
              <div className="flex justify-center space-x-1.5 mt-2.5">
                {heroCakes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentIdx === i ? 'w-6 bg-gold-500' : 'w-1.5 bg-warmgray-300'
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
