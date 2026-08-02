'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CakeModal from '@/components/ui/CakeModal';
import { CakeItem } from '@/types';
import { MessageCircle, Eye, Award } from 'lucide-react';
import { buildCakeInquiryWhatsAppUrl } from '@/lib/whatsapp';

export default function SignatureCollection() {
  const [cakes, setCakes] = useState<CakeItem[]>([]);
  const [selectedCake, setSelectedCake] = useState<CakeItem | null>(null);

  useEffect(() => {
    fetch(`/api/cakes?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.cakes)) {
          setCakes(data.cakes);
        } else {
          setCakes([]);
        }
      })
      .catch(() => setCakes([]));
  }, []);

  const signatureCakes = cakes.filter(
    (c) => c.category === 'signature' || c.category === 'wedding' || c.featured
  ).slice(0, 2);

  if (signatureCakes.length === 0) {
    return null; // Return null if no signature cakes exist
  }

  return (
    <section className="py-10 sm:py-14 bg-cream-50 text-charcoal-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-6">
          <div className="flex items-center space-x-2 text-gold-700">
            <Award className="w-4 h-4 text-gold-600 flex-shrink-0" />
            <h2 className="font-serif text-xl sm:text-3xl text-charcoal-900 font-bold tracking-tight">
              Signature Collection
            </h2>
          </div>
          <span className="text-[11px] sm:text-xs text-warmgray-500 font-medium">Bespoke Couture</span>
        </div>

        {/* Compact 2-Grid Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {signatureCakes.map((cake) => {
            const whatsappUrl = buildCakeInquiryWhatsAppUrl(cake);

            return (
              <div
                key={cake.id}
                onClick={() => setSelectedCake(cake)}
                className="bg-white rounded-2xl border border-warmgray-200 p-3.5 sm:p-4 shadow-sm hover:shadow-luxury-hover transition-all duration-300 grid grid-cols-12 gap-3 sm:gap-4 items-center cursor-pointer transform-gpu"
              >
                {/* Visual Imagery */}
                <div className="col-span-5 relative aspect-square rounded-xl overflow-hidden bg-cream-100">
                  <Image
                    src={cake.image}
                    alt={cake.name}
                    fill
                    sizes="(max-width: 768px) 40vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <span className="px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] uppercase tracking-wider font-bold bg-white/90 text-charcoal-900 shadow-sm">
                      {cake.category}
                    </span>
                  </div>
                </div>

                {/* Cake Info */}
                <div className="col-span-7 space-y-1.5">
                  <div>
                    <h3 className="font-serif text-sm sm:text-xl text-charcoal-900 font-bold line-clamp-1">
                      {cake.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-warmgray-500 font-medium">{cake.servings?.split('(')[0] || '0.5 lb - 3 lb'}</p>
                  </div>

                  <p className="text-[11px] sm:text-xs text-warmgray-600 line-clamp-2 font-normal">
                    {cake.shortDescription || cake.description}
                  </p>

                  <div className="pt-2 flex justify-between items-center border-t border-warmgray-100">
                    <span className="font-serif text-xs sm:text-base font-bold text-gold-700">₹{(cake.priceStartingFrom || 0).toLocaleString()}</span>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCake(cake);
                        }}
                        className="p-1.5 rounded-full border border-warmgray-300 hover:border-gold-500 text-charcoal-900 transition-colors"
                        aria-label="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={whatsappUrl}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1 transition-all shadow-sm"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Order</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        <CakeModal cake={selectedCake} onClose={() => setSelectedCake(null)} />

      </div>
    </section>
  );
}
