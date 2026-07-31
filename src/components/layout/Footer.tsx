'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Heart, MapPin, Clock, Lock, Phone } from 'lucide-react';
import { buildGeneralInquiryWhatsAppUrl } from '@/lib/whatsapp';

export default function Footer() {
  const whatsappUrl = buildGeneralInquiryWhatsAppUrl();

  return (
    <footer className="bg-cream-200/70 border-t border-warmgray-300 text-charcoal-900 relative overflow-hidden">
      {/* Decorative Gold Accent Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          
          {/* Brand Column with Official Logo */}
          <div className="space-y-4">
            <Link href="/" className="group flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500/40 shadow-sm flex-shrink-0 bg-charcoal-900">
                <Image
                  src="/logo.jpg"
                  alt="Lush Layers Official Seal"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-serif text-2xl tracking-tight text-charcoal-900 font-bold leading-none">
                  Lush Layers
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-gold-700 font-sans font-bold mt-0.5">
                  Made With Love
                </span>
              </div>
            </Link>

            <p className="text-xs text-warmgray-600 leading-relaxed max-w-sm font-normal">
              Lush Layers is dedicated to haute couture wedding cakes, bespoke celebration tiers, and modern minimalist sweet sculpture.
            </p>
          </div>

          {/* Lush Layers Navigation */}
          <div>
            <h4 className="font-serif text-lg text-charcoal-900 font-bold mb-4 tracking-wide">Lush Layers Collection</h4>
            <ul className="space-y-2.5 text-xs text-warmgray-600 font-medium">
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
                  Celebration & Birthday Cakes
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=artisanal" className="hover:text-gold-700 transition-colors">
                  Minimalist Concrete & Flora
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=vegan" className="hover:text-gold-700 transition-colors">
                  Organic Plant-Based Luxury
                </Link>
              </li>
              <li>
                <Link href="/custom-cake" className="hover:text-gold-700 transition-colors font-bold text-gold-700">
                  Custom Cake Studio →
                </Link>
              </li>
            </ul>
          </div>

          {/* Atelier Info */}
          <div>
            <h4 className="font-serif text-lg text-charcoal-900 font-bold mb-4 tracking-wide">The Atelier</h4>
            <ul className="space-y-3 text-xs text-warmgray-600 font-medium">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                <span>PB Road, Behala, Kolkata-41</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-gold-600 flex-shrink-0" />
                <span className="font-mono font-bold text-charcoal-900">+91 8768388868</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p>Tue - Sun: 10:00 AM – 8:00 PM</p>
                  <p className="text-[10px] text-warmgray-500">Mondays reserved for private consultations</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp Ordering Notice */}
          <div>
            <h4 className="font-serif text-lg text-charcoal-900 font-bold mb-4 tracking-wide">Instant WhatsApp Order</h4>
            <p className="text-xs text-warmgray-600 leading-relaxed mb-4 font-normal">
              We operate exclusively via direct WhatsApp consultations to ensure bespoke attention to every detail of your cake.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-widest font-bold px-5 py-3 rounded-full transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Start Order Inquiry</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-warmgray-300 flex flex-col md:flex-row justify-between items-center text-[11px] text-warmgray-500 font-medium">
          <p>© {new Date().getFullYear()} Lush Layers (Made With Love). All rights reserved.</p>
          
          <div className="flex items-center space-x-4 mt-3 md:mt-0">
            <Link
              href="/admin/login"
              className="inline-flex items-center space-x-1 text-[11px] font-bold text-gold-700 hover:text-gold-800 uppercase tracking-wider"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <span>Crafted with</span>
              <Heart className="w-3 h-3 text-red-500 fill-current inline" />
              <span>for fine cake baking.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
