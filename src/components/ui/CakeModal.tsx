'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CakeItem } from '@/types';
import { X, Sparkles, MessageCircle, CheckCircle2, Flame, Clock } from 'lucide-react';
import { buildCakeInquiryWhatsAppUrl } from '@/lib/whatsapp';

interface CakeModalProps {
  cake: CakeItem | null;
  onClose: () => void;
  onOpenOrderForm?: (cake: CakeItem, selectedWeight: string, selectedPrice: number) => void;
}

export default function CakeModal({ cake, onClose, onOpenOrderForm }: CakeModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedWeightIdx, setSelectedWeightIdx] = useState<number>(0);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [customNotes, setCustomNotes] = useState<string>('');

  // Lock background body scroll when modal is active
  useEffect(() => {
    if (cake) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [cake]);

  if (!cake) return null;

  const fallbackImg = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80';
  const rawImage = selectedImage || cake.image;
  const currentImage = rawImage && rawImage.startsWith('http') ? rawImage : (cake.image && cake.image.startsWith('http') ? cake.image : fallbackImg);

  const rawAdditional = (cake.additionalImages || []).filter((img) => img && img.startsWith('http'));
  const allImages = [currentImage, ...rawAdditional];

  const hasWeights = cake.weightOptions && cake.weightOptions.length > 0;
  const currentWeightObj = hasWeights ? cake.weightOptions[selectedWeightIdx] : null;
  const currentPrice = currentWeightObj ? currentWeightObj.price : cake.priceStartingFrom;
  const currentWeightLabel = currentWeightObj ? currentWeightObj.label : cake.servings;

  const currentFlavor = selectedFlavor || (cake.flavors ? cake.flavors[0] : '');
  const whatsappUrl = buildCakeInquiryWhatsAppUrl(cake, customNotes, currentWeightLabel, currentPrice);

  const handleOrderClick = () => {
    if (onOpenOrderForm) {
      onOpenOrderForm(cake, currentWeightLabel, currentPrice);
    } else {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/75 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white border border-warmgray-200 rounded-3xl overflow-hidden shadow-2xl z-10 my-auto animate-fade-in max-h-[90vh] flex flex-col md:block overflow-y-auto md:overflow-hidden">
        
        {/* PROMINENT VISIBLE CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[100] w-10 h-10 rounded-full bg-gold-500 hover:bg-gold-400 text-charcoal-950 flex items-center justify-center font-bold transition-all shadow-xl border border-gold-300 active:scale-90 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery View */}
          <div className="bg-cream-100 p-4 sm:p-6 flex flex-col justify-between">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 shadow-sm bg-warmgray-200">
              <Image
                src={currentImage}
                alt={cake.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500"
                priority
              />
              <div className="absolute top-3 left-3 flex flex-col space-y-1.5 z-10">
                {cake.bestseller && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold bg-gold-500 text-white shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    <span>Bestseller</span>
                  </span>
                )}
                {cake.eggless && (
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-emerald-800 text-white shadow-sm">
                    🌱 100% Eggless
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail switcher */}
            {allImages.length > 1 && (
              <div className="flex space-x-2.5 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      currentImage === img ? 'border-gold-500 scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-5 sm:p-7 flex flex-col justify-between bg-white overflow-y-auto max-h-[75vh] md:max-h-[85vh]">
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-gold-700 font-bold mb-1">
                <span>{cake.category}</span>
                {cake.availabilityStatus && (
                  <span className="text-[10px] bg-gold-100 text-gold-800 px-2.5 py-0.5 rounded-full border border-gold-300">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {cake.availabilityStatus}
                  </span>
                )}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-bold mb-1 pr-8">
                {cake.name}
              </h2>

              <p className="text-xs text-warmgray-500 uppercase tracking-widest font-bold mb-4">
                {cake.subtitle}
              </p>

              {/* Weight Selector & Live Price Display */}
              <div className="bg-cream-50 border border-warmgray-200 rounded-2xl p-4 mb-4 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-warmgray-600">
                    Select Size / Weight
                  </span>
                  <span className="font-serif text-2xl font-bold text-gold-700">
                    ₹{currentPrice.toLocaleString()}
                  </span>
                </div>

                {hasWeights ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {cake.weightOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedWeightIdx(idx)}
                        className={`py-2 px-2 rounded-xl border text-center transition-all ${
                          selectedWeightIdx === idx
                            ? 'border-gold-500 bg-gold-50 text-charcoal-900 font-bold shadow-xs'
                            : 'border-warmgray-200 text-warmgray-600 hover:border-gold-400'
                        }`}
                      >
                        <p className="text-xs font-bold">{opt.weightKg} kg</p>
                        <p className="text-[10px] text-warmgray-500">₹{opt.price.toLocaleString()}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-charcoal-900 font-semibold">{cake.servings}</p>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-warmgray-600 leading-relaxed mb-4 font-normal">
                {cake.description}
              </p>

              {/* Flavors Selection */}
              {cake.flavors && cake.flavors.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs uppercase tracking-wider text-charcoal-900 font-bold mb-2 flex items-center space-x-1.5">
                    <Flame className="w-3.5 h-3.5 text-gold-600" />
                    <span>Signature Flavor Profile</span>
                  </h4>
                  <div className="space-y-1">
                    {cake.flavors.map((flavor, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs text-warmgray-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                        <span>{flavor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Input */}
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-wider text-warmgray-600 font-bold mb-1">
                  Customization Notes or Event Date (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Delivery on Oct 14th, write 'Happy Birthday' in gold"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-warmgray-300 text-xs text-charcoal-900 placeholder-warmgray-400 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="pt-3 border-t border-warmgray-100 space-y-1.5">
              <button
                onClick={handleOrderClick}
                className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4.5 h-4.5 animate-pulse" />
                <span>Book Order on WhatsApp (₹{currentPrice.toLocaleString()})</span>
              </button>
              <p className="text-[10px] text-center text-warmgray-400 font-medium">
                Generates formatted WhatsApp order query. No online payment required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
