'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { buildGeneralInquiryWhatsAppUrl } from '@/lib/whatsapp';
import { DEFAULT_HERO_SLIDES, HeroSlideData } from '@/data/heroSlides';

export default function Hero() {
  const whatsappUrl = buildGeneralInquiryWhatsAppUrl();
  const [slides, setSlides] = useState<HeroSlideData[]>(DEFAULT_HERO_SLIDES);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Touch Swipe & Mouse Drag States
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch Live Hero Slides from MongoDB Atlas / API
  useEffect(() => {
    fetchHeroSlides();
  }, []);

  const fetchHeroSlides = async () => {
    try {
      const res = await fetch('/api/hero-slides');
      const data = await res.json();
      if (data.success && data.slides && data.slides.length > 0) {
        const activeOnly = data.slides.filter((s: any) => s.active !== false);
        setSlides(activeOnly.length > 0 ? activeOnly : DEFAULT_HERO_SLIDES);
      }
    } catch (err) {
      console.warn('Hero slides fetch error, using default fallback slides');
    }
  };

  // Smart Auto-Slide with Interaction Pause & Resume
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  // Pause Auto-Slide temporarily on manual user swipe / interaction (Resumes after 6 seconds of idle)
  const triggerManualInteractionPause = () => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 6000);
  };

  // Touch & Drag Swipe Handlers (Min distance 50px)
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    triggerManualInteractionPause();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setTouchStartX(clientX);
    setTouchEndX(clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || touchStartX === null) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setTouchEndX(clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swiped Left -> Next Slide
        setCurrentIdx((prev) => (prev + 1) % slides.length);
      } else {
        // Swiped Right -> Previous Slide
        setCurrentIdx((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);
    setIsDragging(false);
  };

  const activeSlide = slides[currentIdx] || slides[0];

  return (
    <section className="relative bg-gradient-to-b from-cream-100 via-white to-cream-50 text-charcoal-900 pt-20 pb-6 sm:pt-24 sm:pb-8 overflow-hidden border-b border-warmgray-200/60">
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Main Hero Copy (Left Column) */}
          <div className="lg:col-span-6 space-y-3.5 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-gold-400 text-gold-700 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold" suppressHydrationWarning>
                {activeSlide?.badgeTagline || DEFAULT_HERO_SLIDES[0].badgeTagline}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-charcoal-900 font-normal">
              Bespoke Luxury <br />
              <span className="italic text-gold-700 font-serif">Artisanal Cakes</span>
            </h1>

            <p className="text-xs sm:text-sm text-warmgray-600 font-normal leading-relaxed max-w-md text-center lg:text-left" suppressHydrationWarning>
              {activeSlide?.description || DEFAULT_HERO_SLIDES[0].description}
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

          {/* DYNAMIC SWIPE HERO CAKE CAROUSEL CARD (NO ARROWS, USER SWIPEABLE) */}
          <div className="lg:col-span-6 relative mt-2 lg:mt-0">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
                className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-luxury border border-warmgray-200 bg-white group transform-gpu cursor-grab active:cursor-grabbing select-none"
              >
                <Image
                  src={activeSlide?.image || DEFAULT_HERO_SLIDES[0].image}
                  alt={activeSlide?.cakeName || DEFAULT_HERO_SLIDES[0].cakeName}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 pointer-events-none"
                />
                
                {/* Floating Info Overlay Bar */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-warmgray-200 shadow-sm flex justify-between items-center text-xs pointer-events-auto">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gold-700 block" suppressHydrationWarning>
                      {activeSlide?.category || DEFAULT_HERO_SLIDES[0].category} ({currentIdx + 1}/{slides.length})
                    </span>
                    <h3 className="font-serif text-sm font-bold text-charcoal-900 truncate max-w-[180px] sm:max-w-[240px]" suppressHydrationWarning>
                      {activeSlide?.cakeName || DEFAULT_HERO_SLIDES[0].cakeName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-sm font-bold text-gold-700 block" suppressHydrationWarning>
                      From ₹{(activeSlide?.priceStartingFrom || DEFAULT_HERO_SLIDES[0].priceStartingFrom).toLocaleString()}
                    </span>
                    <Link
                      href={activeSlide.ctaLink || '/catalog'}
                      className="text-[10px] font-bold text-charcoal-900 hover:text-gold-700 underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>

                {/* Swipe Helper Hint on First Slide */}
                <div className="absolute top-3 right-3 bg-charcoal-900/70 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full pointer-events-none opacity-80">
                  <span>← Swipe →</span>
                </div>
              </div>

              {/* Dot Indicators */}
              <div className="flex justify-center space-x-2 mt-3">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      triggerManualInteractionPause();
                      setCurrentIdx(i);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentIdx === i ? 'w-7 bg-gold-500' : 'w-2 bg-warmgray-300 hover:bg-warmgray-400'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
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
