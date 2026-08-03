import React from 'react';
import Hero from '@/components/home/Hero';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import CraftsmanshipSection from '@/components/home/CraftsmanshipSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import Link from 'next/link';
import { MessageCircle, Phone, MapPin, Clock, Sparkles, User } from 'lucide-react';
import { buildGeneralInquiryWhatsAppUrl } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  const whatsappUrl = buildGeneralInquiryWhatsAppUrl();

  return (
    <main className="min-h-screen bg-cream-100 text-charcoal-900 overflow-x-hidden">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Cake Categories Section */}
      <CategoriesGrid />

      {/* 3. Featured Cakes Collection */}
      <FeaturedSection />

      {/* 4. Atelier Craftsmanship */}
      <CraftsmanshipSection />

      {/* 5. Direct WhatsApp & Contact Section */}
      <section id="contact" className="scroll-mt-16 py-14 sm:py-20 bg-cream-50 text-charcoal-900 border-t border-warmgray-200 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-gold-400 text-gold-700 shadow-sm">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">Direct Consultation with Tina Baidya</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal-900 tracking-tight font-bold">
            Consult Directly with Founder & Master Pastry Chef Tina Baidya
          </h2>

          <p className="text-xs sm:text-sm text-warmgray-600 max-w-xl mx-auto leading-relaxed font-normal">
            Skip shopping carts and online payments. Message Tina Baidya directly on WhatsApp or visit Lush Layers Studio in Kolkata to discuss custom dates, guest counts, and tailored flavor combinations.
          </p>

          {/* Quick Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-xs text-charcoal-900 pt-2">
            <div className="bg-white p-4 rounded-2xl border border-warmgray-300 shadow-sm flex flex-col items-center space-y-1">
              <User className="w-5 h-5 text-gold-600 mb-1" />
              <span className="font-bold">Founder & Pastry Chef</span>
              <span className="text-gold-700 font-bold text-sm">Tina Baidya</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-warmgray-300 shadow-sm flex flex-col items-center space-y-1">
              <Phone className="w-5 h-5 text-gold-600 mb-1" />
              <span className="font-bold">Direct Call / WhatsApp</span>
              <span className="text-warmgray-600 font-mono font-bold text-sm">+91 8768388868</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-warmgray-300 shadow-sm flex flex-col items-center space-y-1">
              <MapPin className="w-5 h-5 text-gold-600 mb-1" />
              <span className="font-bold">Lush Layers Cake Studio</span>
              <span className="text-warmgray-600">PB Road, Behala, Kolkata-41</span>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all shadow-md hover:shadow-emerald-600/30 active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Connect with Tina Baidya on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
