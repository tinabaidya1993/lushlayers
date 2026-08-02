'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CUSTOMIZER_OPTIONS } from '@/data/cakes';
import CakeCard from '@/components/ui/CakeCard';
import CakeModal from '@/components/ui/CakeModal';
import OrderFormModal from '@/components/catalog/OrderFormModal';
import { CakeItem, OrderFormDetails } from '@/types';
import {
  Sparkles,
  MessageCircle,
  Check,
  Users,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  UploadCloud,
  Flame,
  ArrowLeft,
} from 'lucide-react';
import { buildCakeInquiryWhatsAppUrl, buildOnePageOrderWhatsAppUrl } from '@/lib/whatsapp';

interface CakeDetailClientProps {
  cake: CakeItem;
  relatedCakes?: CakeItem[];
}

export default function CakeDetailClient({ cake, relatedCakes = [] }: CakeDetailClientProps) {
  // Gallery States
  const allImages = [cake.image, ...(cake.additionalImages || [])];
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  // Customization States
  const [selectedWeightIdx, setSelectedWeightIdx] = useState<number>(0);
  const [selectedSponge, setSelectedSponge] = useState<string>(CUSTOMIZER_OPTIONS.spongeFlavors[0].name);
  const [selectedFilling, setSelectedFilling] = useState<string>(CUSTOMIZER_OPTIONS.fillingFlavors[0].name);
  const [selectedShape, setSelectedShape] = useState<string>('Classic Round');
  const [selectedCream, setSelectedCream] = useState<string>(CUSTOMIZER_OPTIONS.frostingStyles[0].name);
  const [selectedPalette, setSelectedPalette] = useState<string>(CUSTOMIZER_OPTIONS.colorPalettes[0].name);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([CUSTOMIZER_OPTIONS.toppings[0]]);
  const [customMessage, setCustomMessage] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deliveryTime, setDeliveryTime] = useState<string>('12:00 PM - 02:00 PM (Afternoon)');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [referenceFile, setReferenceFile] = useState<string>('');

  // Modals
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);
  const [quickViewCake, setQuickViewCake] = useState<CakeItem | null>(null);

  // Calculations
  const hasWeights = cake.weightOptions && cake.weightOptions.length > 0;
  const currentWeightObj = hasWeights ? cake.weightOptions[selectedWeightIdx] : null;
  const baseWeightPrice = currentWeightObj ? currentWeightObj.price : cake.priceStartingFrom;
  const currentWeightLabel = currentWeightObj ? currentWeightObj.label : cake.servings;
  const toppingsAddon = selectedToppings.length * 500;
  const livePrice = baseWeightPrice + toppingsAddon;

  const toggleTopping = (topping: string) => {
    setSelectedToppings((prev) =>
      prev.includes(topping) ? prev.filter((t) => t !== topping) : [...prev, topping]
    );
  };

  // WhatsApp Order payload
  const orderPayload: OrderFormDetails = {
    customerName: 'Guest Customer',
    phoneNumber: '',
    deliveryAddress: 'To be provided in WhatsApp chat',
    deliveryDate: deliveryDate || 'Preferred Date TBD',
    deliveryTime,
    cakeName: cake.name,
    cakeCategory: cake.category,
    selectedWeight: currentWeightLabel,
    selectedPrice: livePrice,
    selectedFlavor: `${selectedSponge} with ${selectedFilling}`,
    selectedShape,
    selectedCreamType: selectedCream,
    selectedThemeColor: selectedPalette,
    cakeMessage: customMessage || 'None',
    referenceFileName: referenceFile,
    specialNotes: `Accents: ${selectedToppings.join(', ')}. ${specialNotes}`,
    eggless: cake.eggless ?? true,
  };

  const directWhatsAppUrl = buildOnePageOrderWhatsAppUrl(orderPayload);

  return (
    <div className="min-h-screen bg-cream-50 text-charcoal-900 pt-20 pb-20 font-sans">
      
      {/* Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-warmgray-500">
          <Link href="/" className="hover:text-gold-700 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-gold-700 transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-charcoal-900 font-bold truncate max-w-xs">{cake.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Product Spotlight Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-warmgray-200 shadow-sm">
          
          {/* Left Column: Image Gallery & Lightbox */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-cream-100 border border-warmgray-300/80 shadow-md group">
              <Image
                src={allImages[activeImgIndex] || cake.image}
                alt={cake.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 text-charcoal-900 backdrop-blur-md shadow-md hover:bg-gold-500 hover:text-white transition-all cursor-pointer"
                title="Expand Gallery Lightbox"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-charcoal-900 hover:bg-white shadow-md transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-charcoal-900 hover:bg-white shadow-md transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                      activeImgIndex === idx ? 'border-gold-500 scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Customizer & Details Panel */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-gold-700 text-xs font-bold uppercase tracking-widest mb-1.5">
                <Sparkles className="w-4 h-4 text-gold-600" />
                <span>100% Eggless Home-Baked Atelier</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight leading-tight">
                {cake.name}
              </h1>
              <p className="text-xs text-warmgray-600 font-normal mt-2 leading-relaxed">
                {cake.description}
              </p>
            </div>

            {/* Price Banner */}
            <div className="p-4 rounded-2xl bg-cream-50 border border-warmgray-300/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-warmgray-500 tracking-wider">Estimated Price</span>
                <p className="font-serif text-3xl font-bold text-gold-700">₹{(livePrice || 0).toLocaleString()}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                🌱 100% Eggless
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setOrderModalOpen(true)}
                className="w-full py-4 px-6 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
              >
                <span>Customize & Order Now</span>
              </button>

              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <MessageCircle className="w-4.5 h-4.5" />
                <span>WhatsApp Order</span>
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[1100] bg-charcoal-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 p-3 text-white hover:text-gold-400">
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-4xl aspect-square max-h-[85vh]">
            <Image src={allImages[activeImgIndex] || cake.image} alt={cake.name} fill className="object-contain" />
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <CakeModal cake={quickViewCake} onClose={() => setQuickViewCake(null)} />

      {/* Order Booking Form Modal */}
      <OrderFormModal
        cake={orderModalOpen ? cake : null}
        selectedWeightLabel={currentWeightLabel}
        selectedPrice={livePrice}
        selectedFlavor={`${selectedSponge} with ${selectedFilling}`}
        selectedShape={selectedShape}
        onClose={() => setOrderModalOpen(false)}
      />

    </div>
  );
}
