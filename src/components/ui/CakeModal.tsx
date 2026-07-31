'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CakeItem } from '@/types';
import { X, Sparkles, MessageCircle, CheckCircle2, Users, Flame, Clock, ShieldCheck, UploadCloud } from 'lucide-react';
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

  if (!cake) return null;

  const currentImage = selectedImage || cake.image;
  const allImages = [cake.image, ...(cake.additionalImages || [])];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white border border-warmgray-200 rounded-3xl overflow-hidden shadow-2xl z-10 my-6 animate-fade-in max-h-[92vh] flex flex-col md:block overflow-y-auto md:overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-charcoal-900 flex items-center justify-center transition-colors shadow-md border border-warmgray-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery View */}
          <div className="bg-cream-100 p-5 sm:p-6 flex flex-col justify-between">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm">
              <Image
                src={currentImage}
                alt={cake.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500"
                priority
              />
              <div className="absolute top-3.5 left-3.5 flex flex-col space-y-1.5">
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
              <div className="flex space-x-3 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      currentImage === img ? 'border-gold-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-5 sm:p-8 flex flex-col justify-between bg-white overflow-y-auto max-h-[80vh] md:max-h-[88vh]">
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-gold-700 font-bold mb-1.5">
                <span>{cake.category}</span>
                {cake.availabilityStatus && (
                  <span className="text-[10px] bg-gold-100 text-gold-800 px-2.5 py-0.5 rounded-full border border-gold-300">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {cake.availabilityStatus}
                  </span>
                )}
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl text-charcoal-900 font-bold mb-1">
                {cake.name}
              </h2>

              <p className="text-xs text-warmgray-500 uppercase tracking-widest font-bold mb-4">
                {cake.subtitle}
              </p>

              {/* Weight Selector & Live Price Display */}
              <div className="bg-cream-50 border border-warmgray-200 rounded-2xl p-4 mb-5 space-y-3">
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
                        className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                          selectedWeightIdx === idx
                            ? 'border-gold-500 bg-gold-50 text-charcoal-900 font-bold shadow-sm'
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
              <p className="text-xs text-warmgray-600 leading-relaxed mb-5 font-normal">
                {cake.description}
              </p>

              {/* Flavors Selection */}
              {cake.flavors && cake.flavors.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs uppercase tracking-wider text-charcoal-900 font-bold mb-2.5 flex items-center space-x-1.5">
                    <Flame className="w-3.5 h-3.5 text-gold-600" />
                    <span>Signature Flavor Profile</span>
                  </h4>
                  <div className="space-y-1.5">
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
              <div className="mb-5">
                <label className="block text-xs uppercase tracking-wider text-warmgray-600 font-bold mb-1.5">
                  Customization Notes or Event Date (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Delivery on Oct 14th, write 'Happy Birthday Sarah' in gold"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 text-xs text-charcoal-900 placeholder-warmgray-400 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* Direct WhatsApp Action Button & Order Booking */}
            <div className="pt-3 border-t border-warmgray-100 space-y-2">
              <button
                onClick={handleOrderClick}
                className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-95"
              >
                <MessageCircle className="w-4.5 h-4.5" />
                <span>Book Order on WhatsApp (₹{currentPrice.toLocaleString()})</span>
              </button>
              <p className="text-[10px] text-center text-warmgray-400 font-medium">
                Generates a formatted WhatsApp order query directly. No online payment required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
