'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { buildGeneralInquiryWhatsAppUrl } from '@/lib/whatsapp';
import { HeroSlideData } from '@/data/heroSlides';

export default function Hero() {
  const whatsappUrl = buildGeneralInquiryWhatsAppUrl();
  const [slides, setSlides] = useState<HeroSlideData[]>([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const res = await fetch(`/api/hero-slides?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.slides)) {
        const activeOnly = data.slides.filter((s: any) => s.active !== false);
        setSlides(activeOnly);
      } else {
        setSlides([]);
      }
    } catch (err) {
      console.warn('Hero slides fetch error:', err);
      setSlides([]);
    } finally {
      setLoading(false);
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

  const triggerManualInteractionPause = () => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 6000);
  };

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

    if (Math.abs(distance) > minSwipeDistance && slides.length > 1) {
      if (distance > 0) {
        setCurrentIdx((prev) => (prev + 1) % slides.length);
      } else {
        setCurrentIdx((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);
    setIsDragging(false);
  };

  const activeSlide = !loading && slides.length > 0 ? slides[currentIdx] || slides[0] : null;

  return (
    <section className="relative bg-gradient-to-b from-cream-100 via-white to-cream-50 text-charcoal-900 pt-20 pb-6 sm:pt-24 sm:pb-8 overflow-hidden border-b border-warmgray-200/60">
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Main Hero Copy (Left Column) */}
          <div className="lg:col-span-6 space-y-3.5 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-gold-400 text-gold-700 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                {activeSlide?.badgeTagline || '100% Eggless Home-Baked Atelier'}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-charcoal-900 font-normal">
              Bespoke Luxury <br />
              <span className="italic text-gold-700 font-serif">Artisanal Cakes</span>
            </h1>

            <p className="text-xs sm:text-sm text-warmgray-600 font-normal leading-relaxed max-w-md text-center lg:text-left">
              {activeSlide?.description ||
                'Handcrafted luxury 100% eggless cakes baked fresh on your order date in Kolkata by Owner & Pastry Chef Tina Baidya.'}
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

          {/* DYNAMIC SWIPE HERO CAKE CAROUSEL CARD */}
          <div className="lg:col-span-6 relative mt-2 lg:mt-0">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              {loading ? (
                /* Elegant Luxury Hero Skeleton Loader */
                <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-luxury border border-warmgray-200 bg-cream-100 animate-pulse flex flex-col justify-between p-4">
                  <div className="w-full h-full bg-warmgray-200/60 rounded-xl"></div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/90 p-3 rounded-xl space-y-2">
                    <div className="w-24 h-3 bg-warmgray-200 rounded"></div>
                    <div className="w-48 h-4 bg-warmgray-300 rounded"></div>
                  </div>
                </div>
              ) : activeSlide ? (
                /* Real MongoDB Hero Slide Carousel Card */
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
                    src={activeSlide.image}
                    alt={activeSlide.cakeName}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 pointer-events-none"
                  />
                  
                  {/* Floating Info Overlay Bar */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-warmgray-200 shadow-sm flex justify-between items-center text-xs pointer-events-auto">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-gold-700 block">
                        {activeSlide.category || 'Signature'} ({currentIdx + 1}/{slides.length})
                      </span>
                      <h3 className="font-serif text-sm font-bold text-charcoal-900 truncate max-w-[180px] sm:max-w-[240px]">
                        {activeSlide.cakeName}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-sm font-bold text-gold-700 block">
                        From ₹{(activeSlide.priceStartingFrom || 0).toLocaleString()}
                      </span>
                      <Link
                        href={activeSlide.ctaLink || '/catalog'}
                        className="text-[10px] font-bold text-charcoal-900 hover:text-gold-700 underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>

                  {/* Swipe Helper Hint */}
                  {slides.length > 1 && (
                    <div className="absolute top-3 right-3 bg-charcoal-900/70 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full pointer-events-none opacity-80">
                      <span>← Swipe →</span>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Dot Indicators */}
              {!loading && slides.length > 1 && (
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
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
