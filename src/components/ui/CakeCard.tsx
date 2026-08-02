'use client';

import React from 'react';
import Image from 'next/image';
import { CakeItem } from '@/types';
import { Sparkles, MessageCircle, Eye } from 'lucide-react';
import { buildCakeInquiryWhatsAppUrl } from '@/lib/whatsapp';

interface CakeCardProps {
  cake: CakeItem;
  onQuickView: (cake: CakeItem) => void;
  onOrderNow?: (cake: CakeItem) => void;
}

export default function CakeCard({ cake, onQuickView, onOrderNow }: CakeCardProps) {
  const whatsappUrl = buildCakeInquiryWhatsAppUrl(cake);

  const handleOrderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOrderNow) {
      onOrderNow(cake);
    } else {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div
      onClick={() => onQuickView(cake)}
      className="group relative bg-white border border-warmgray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-luxury-hover transition-all duration-300 flex flex-col justify-between cursor-pointer transform-gpu"
    >
      <div>
        {/* Visual Header / Image Container */}
        <div className="relative w-full aspect-[4/3] bg-cream-100 overflow-hidden">
          <Image
            src={cake.image}
            alt={cake.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            priority={false}
          />
          
          {/* Subtle hover overlay */}
          <div className="absolute inset-0 bg-charcoal-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10 max-w-[85%]">
            {cake.bestseller && (
              <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] uppercase tracking-wider font-bold bg-gold-500 text-white shadow-sm">
                <Sparkles className="w-2 h-2" />
                <span>Bestseller</span>
              </span>
            )}
            {cake.newArrival && (
              <span className="inline-block px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] uppercase tracking-wider font-bold bg-charcoal-900 text-white shadow-sm">
                New
              </span>
            )}
            {cake.eggless && (
              <span className="inline-block px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] uppercase tracking-wider font-bold bg-emerald-800 text-white shadow-sm">
                🌱 Eggless
              </span>
            )}
          </div>

          {/* Quick View Floating Eye Button on Hover */}
          <div className="absolute bottom-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
            <span className="w-7 h-7 rounded-full bg-white text-charcoal-900 flex items-center justify-center shadow-md hover:bg-gold-500 hover:text-white transition-colors">
              <Eye className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-2.5 sm:p-4">
          <h3 className="font-serif text-xs sm:text-base text-charcoal-900 font-bold tracking-tight group-hover:text-gold-600 transition-colors line-clamp-1">
            {cake.name}
          </h3>

          <p className="text-[10px] sm:text-[11px] text-warmgray-500 line-clamp-1 mt-0.5 font-normal">
            {cake.flavors.slice(0, 2).join(' • ')}
          </p>

          {/* Servings & Starting Price info */}
          <div className="flex justify-between items-center pt-2 mt-2 border-t border-warmgray-100 text-[10px] sm:text-xs">
            <span className="text-warmgray-500 font-medium truncate max-w-[50%]">{(cake.servings || '').split('(')[0]}</span>
            <span className="font-serif text-xs sm:text-sm font-bold text-gold-700 flex-shrink-0">From ₹{(cake.priceStartingFrom || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Action Footer Buttons (Responsive Stack on Mobile, Flex on Desktop) */}
      <div className="px-2.5 sm:px-4 pb-2.5 sm:pb-3.5 pt-0 flex flex-col sm:flex-row gap-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(cake);
          }}
          className="w-full sm:flex-1 py-1.5 sm:py-2 px-1.5 rounded-xl border border-warmgray-300 hover:border-gold-500 text-charcoal-900 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-colors text-center"
        >
          Quick View
        </button>
        <button
          onClick={handleOrderClick}
          className="w-full sm:flex-1 py-1.5 sm:py-2 px-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1 transition-all shadow-sm active:scale-95"
        >
          <MessageCircle className="w-3 h-3 flex-shrink-0" />
          <span>Order</span>
        </button>
      </div>
    </div>
  );
}
