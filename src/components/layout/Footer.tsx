'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, MapPin, Clock, Phone, Sparkles, User, Heart } from 'lucide-react';
import { buildGeneralInquiryWhatsAppUrl } from '@/lib/whatsapp';

export default function Footer() {
  const whatsappUrl = buildGeneralInquiryWhatsAppUrl();

  return (
    <footer className="bg-gradient-to-b from-cream-100 via-cream-200/60 to-cream-200 border-t border-warmgray-300 text-charcoal-900 relative overflow-hidden">
      {/* Decorative Gold Accent Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-0.5 bg-gradient-to-r from-transparent via-gold-500/60 to-transparent"></div>

      {/* Extra bottom padding pb-28 on mobile so floating action buttons NEVER obscure footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-28 sm:pb-12">
        
        {/* Main Grid: 2 cols on mobile -> 4 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Column with Official Seal */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="group flex items-center space-x-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-gold-500/40 shadow-sm flex-shrink-0 bg-charcoal-900">
                <Image
                  src="/logo.jpg"
                  alt="Lush Layers Official Seal"
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-serif text-xl sm:text-2xl tracking-tight text-charcoal-900 font-bold leading-none">
                  Lush Layers
                </span>
                <span className="text-[9px] tracking-[0.25em] uppercase text-gold-700 font-sans font-bold mt-0.5">
                  Fresh Home-Baked With Love
                </span>
              </div>
            </Link>

            <p className="text-xs text-warmgray-600 leading-relaxed max-w-sm font-normal">
              Lush Layers by <strong>Tina Baidya</strong> is dedicated to 100% eggless fresh home-made luxury cakes, bespoke celebration tiers, and artisanal home-baked sweet sculpture in Kolkata.
            </p>
          </div>

          {/* Lush Layers Collection */}
          <div>
            <h4 className="font-serif text-base sm:text-lg text-charcoal-900 font-bold mb-3 tracking-wide border-b border-warmgray-300/60 pb-1.5 inline-block sm:block">
              Home-Made Collections
            </h4>
            <ul className="space-y-2 text-xs text-warmgray-700 font-medium">
              <li>
                <Link href="/catalog?category=wedding" className="hover:text-gold-700 transition-colors">
                  Grand Wedding Tiers
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=signature" className="hover:text-gold-700 transition-colors">
                  Signature Truffle & Velvet
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=birthday" className="hover:text-gold-700 transition-colors">
                  Celebration Birthday Cakes
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=artisanal" className="hover:text-gold-700 transition-colors">
                  Minimalist Home Tiers
                </Link>
              </li>
              <li>
                <Link href="/custom-cake" className="hover:text-gold-700 transition-colors font-bold text-gold-700 flex items-center space-x-1 mt-1">
                  <Sparkles className="w-3 h-3 text-gold-600" />
                  <span>Custom Home-Made Cake →</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Home Kitchen & Delivery Info */}
          <div>
            <h4 className="font-serif text-base sm:text-lg text-charcoal-900 font-bold mb-3 tracking-wide border-b border-warmgray-300/60 pb-1.5 inline-block sm:block">
              Home Kitchen & Delivery
            </h4>
            <ul className="space-y-2.5 text-xs text-warmgray-700 font-medium">
              <li className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gold-600 flex-shrink-0" />
                <span>Home Baker: <strong className="text-charcoal-900 font-bold">Tina Baidya</strong></span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                <span>PB Road, Behala, Kolkata-41 <br /><span className="text-[10px] text-emerald-700 font-bold">(Fresh Home Delivery Available)</span></span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold-600 flex-shrink-0" />
                <span className="font-mono font-bold text-charcoal-900">+91 8768388868</span>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-charcoal-900">Tue - Sun: 10:00 AM – 8:00 PM</p>
                  <p className="text-[10px] text-warmgray-500">Freshly home-baked to order</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp Ordering */}
          <div className="space-y-3">
            <h4 className="font-serif text-base sm:text-lg text-charcoal-900 font-bold tracking-wide border-b border-warmgray-300/60 pb-1.5 inline-block sm:block">
              Fresh Home Delivery Order
            </h4>
            <p className="text-xs text-warmgray-600 leading-relaxed font-normal">
              Direct WhatsApp ordering with <strong>Tina Baidya</strong>. Every cake is baked fresh on your order date in a hygienic home kitchen.
            </p>
            <div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider font-bold px-4 py-2.5 rounded-full transition-all shadow-xs active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Fresh Home-Made Cake</span>
              </a>
            </div>
          </div>

        </div>

        {/* Clean Copyright Bottom Bar */}
        <div className="pt-6 border-t border-warmgray-300 flex flex-col sm:flex-row justify-between items-center text-[11px] text-warmgray-600 font-semibold gap-2">
          <p>© {new Date().getFullYear()} Lush Layers by Tina Baidya. All rights reserved.</p>
          <span className="text-[10px] uppercase tracking-widest text-gold-700 font-bold">100% Eggless Fresh Home-Baked Luxury Cakes</span>
        </div>

      </div>
    </footer>
  );
}
