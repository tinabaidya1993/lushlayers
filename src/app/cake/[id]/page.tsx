'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { getCakeById, CAKES_DATA, CUSTOMIZER_OPTIONS } from '@/data/cakes';
import CakeCard from '@/components/ui/CakeCard';
import CakeModal from '@/components/ui/CakeModal';
import OrderFormModal from '@/components/catalog/OrderFormModal';
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
import { OrderFormDetails } from '@/types';

export default function CakeDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const cake = getCakeById(id);

  if (!cake) {
    return (
      <main className="min-h-screen bg-cream-50 pt-32 pb-24 text-center px-4">
        <h1 className="font-serif text-3xl text-charcoal-900 mb-4">Cake Masterpiece Not Found</h1>
        <p className="text-xs text-warmgray-600 mb-6">The requested cake design could not be located in our atelier catalog.</p>
        <Link href="/catalog" className="px-6 py-3 rounded-full bg-gold-500 text-white text-xs font-bold uppercase tracking-widest">
          Return to Catalog
        </Link>
      </main>
    );
  }

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
  const [quickViewCake, setQuickViewCake] = useState<typeof cake | null>(null);

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
    eggless: cake.eggless,
  };

  const whatsappUrl = buildOnePageOrderWhatsAppUrl(orderPayload);

  // Related Cakes
  const relatedCakes = CAKES_DATA.filter((c) => c.category === cake.category && c.id !== cake.id).slice(0, 4);

  return (
    <main className="min-h-screen bg-cream-50 pt-28 pb-24 text-charcoal-900">
      
      {/* Top Back Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link
          href="/catalog"
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-warmgray-600 hover:text-gold-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Atelier Catalog</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Large Immersive Image Gallery (60% on desktop) */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-28">
            
            {/* Main Featured Image Box */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] rounded-3xl overflow-hidden bg-cream-100 shadow-luxury border border-warmgray-200 group">
              <Image
                src={allImages[activeImgIndex]}
                alt={cake.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-1.5 z-10">
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

              {/* Fullscreen Expand Button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 text-charcoal-900 hover:bg-gold-500 hover:text-white flex items-center justify-center shadow-md backdrop-blur-md transition-all"
                aria-label="Expand Image"
              >
                <Maximize2 className="w-4.5 h-4.5" />
              </button>

              {/* Next/Prev Image Overlay Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 text-charcoal-900 hover:bg-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 text-charcoal-900 hover:bg-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Row */}
            {allImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImgIndex === idx ? 'border-gold-500 scale-105 shadow-sm' : 'border-warmgray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Cake Info Highlights Card */}
            <div className="bg-white rounded-3xl p-6 border border-warmgray-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-warmgray-600 border-b border-warmgray-100 pb-3 font-semibold">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gold-600" />
                  <span>Capacity: <strong className="text-charcoal-900">{cake.servings}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gold-600" />
                  <span>Status: <strong className="text-gold-700">{cake.availabilityStatus || '24 Hours Advance'}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Dietary: <strong className="text-emerald-800">{cake.eggless ? '100% Eggless' : 'Contains Egg'}</strong></span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-warmgray-700 leading-relaxed font-normal">
                {cake.description}
              </p>

              {/* Flavor Profile List */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-charcoal-900 font-bold mb-2 flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-gold-600" />
                  <span>Chef's Signature Flavors</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cake.flavors.map((fl, i) => (
                    <span key={i} className="px-3.5 py-1 rounded-full text-xs bg-cream-100 border border-warmgray-300 text-charcoal-800 font-semibold">
                      {fl}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Live Customization & Order Panel (40% on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warmgray-300 shadow-luxury space-y-6">
              
              {/* Header & Dynamic Live Price */}
              <div className="border-b border-warmgray-200 pb-5">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs uppercase tracking-widest text-gold-700 font-bold">{cake.category}</span>
                  <span className="text-xs uppercase tracking-wider font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    Custom Atelier
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-bold mb-2">
                  {cake.name}
                </h1>

                {/* Animated Live Calculated Price */}
                <div className="bg-gold-50/80 border border-gold-300/80 rounded-2xl p-4 flex justify-between items-center mt-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-warmgray-600 font-bold">Total Calculated Price</p>
                    <p className="text-xs text-warmgray-500 font-medium">{currentWeightLabel}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-3xl font-bold text-gold-700 transition-all animate-fade-in">
                      ₹{(livePrice || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 1. Weight Selector Buttons (Live Price Trigger) */}
              {hasWeights && (
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-900">
                    1. Select Weight / Size
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {cake.weightOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedWeightIdx(idx)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          selectedWeightIdx === idx
                            ? 'border-gold-500 bg-gold-50 text-charcoal-900 font-bold shadow-sm ring-1 ring-gold-500'
                            : 'border-warmgray-200 text-warmgray-700 hover:border-gold-400 bg-white'
                        }`}
                      >
                        <p className="text-xs font-bold">{opt.weightKg} kg</p>
                        <p className="text-[10px] text-warmgray-500 mt-0.5">₹{opt.price.toLocaleString()}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Silhouette Shape */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-900">
                  2. Silhouette Shape
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CUSTOMIZER_OPTIONS.shapes.map((sh) => (
                    <button
                      key={sh.id}
                      onClick={() => setSelectedShape(sh.name)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        selectedShape === sh.name
                          ? 'border-gold-500 bg-gold-50 text-charcoal-900 font-bold'
                          : 'border-warmgray-200 text-warmgray-700 hover:border-gold-400'
                      }`}
                    >
                      {sh.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Frosting Texture & Cream */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-900">
                  3. Frosting Texture Style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CUSTOMIZER_OPTIONS.frostingStyles.map((fr) => (
                    <button
                      key={fr.name}
                      onClick={() => setSelectedCream(fr.name)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        selectedCream === fr.name
                          ? 'border-gold-500 bg-gold-50 text-charcoal-900 font-bold'
                          : 'border-warmgray-200 text-warmgray-700 hover:border-gold-400'
                      }`}
                    >
                      {fr.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Color Theme Swatches */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-900">
                  4. Curated Color Palette
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CUSTOMIZER_OPTIONS.colorPalettes.map((cp) => (
                    <button
                      key={cp.name}
                      onClick={() => setSelectedPalette(cp.name)}
                      className={`p-2.5 rounded-xl border text-left flex items-center space-x-2.5 text-xs transition-all ${
                        selectedPalette === cp.name
                          ? 'border-gold-500 bg-gold-50 text-charcoal-900 font-bold'
                          : 'border-warmgray-200 text-warmgray-700 hover:border-gold-400'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-warmgray-400 flex-shrink-0" style={{ backgroundColor: cp.colorHex }}></span>
                      <span className="truncate">{cp.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Decorative Accents */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-900">
                  5. Handcrafted Decorative Accents
                </label>
                <div className="space-y-2">
                  {CUSTOMIZER_OPTIONS.toppings.map((top) => {
                    const isSelected = selectedToppings.includes(top);
                    return (
                      <button
                        key={top}
                        onClick={() => toggleTopping(top)}
                        className={`w-full p-3 rounded-xl border text-left text-xs flex justify-between items-center transition-all ${
                          isSelected
                            ? 'border-gold-500 bg-gold-50 text-charcoal-900 font-bold shadow-sm'
                            : 'border-warmgray-200 text-warmgray-700 hover:border-gold-400'
                        }`}
                      >
                        <span>{top}</span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-gold-500 border-gold-500 text-white' : 'border-warmgray-300'}`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Custom Plaque Lettering */}
              <div className="space-y-2 pt-2 border-t border-warmgray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-900">
                  6. Plaque Lettering Message
                </label>
                <input
                  type="text"
                  placeholder="e.g. Happy Birthday Sarah! ✨"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 text-xs text-charcoal-900 focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* 7. Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-warmgray-300 text-xs text-charcoal-900 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-warmgray-300 text-xs text-charcoal-900 focus:outline-none focus:border-gold-500 bg-white"
                  >
                    <option value="10:00 AM - 12:00 PM (Morning)">Morning</option>
                    <option value="12:00 PM - 02:00 PM (Afternoon)">Afternoon</option>
                    <option value="05:00 PM - 08:00 PM (Evening)">Evening</option>
                  </select>
                </div>
              </div>

              {/* Primary Order Action Button */}
              <div className="pt-4 border-t border-warmgray-200 space-y-2">
                <button
                  onClick={() => setOrderModalOpen(true)}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                  <span>Book Order on WhatsApp (₹{(livePrice || 0).toLocaleString()})</span>
                </button>
                <p className="text-[10px] text-center text-warmgray-400 font-medium">
                  Direct WhatsApp consultation. No cart, no online payment, zero hassle.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* RELATED CAKES SHOWCASE SECTION */}
        {relatedCakes.length > 0 && (
          <section className="mt-20 pt-12 border-t border-warmgray-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold-700 font-bold block mb-1">Couture Collection</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-bold">
                  You May Also Admire
                </h3>
              </div>
              <Link href="/catalog" className="text-xs uppercase tracking-widest font-bold text-gold-700 hover:text-gold-800">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedCakes.map((relCake) => (
                <CakeCard
                  key={relCake.id}
                  cake={relCake}
                  onQuickView={(c) => setQuickViewCake(c)}
                  onOrderNow={(c) => {
                    window.location.href = `/cake/${c.id}`;
                  }}
                />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* MOBILE STICKY BOTTOM ORDER BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-warmgray-300 p-4 flex justify-between items-center shadow-2xl">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-warmgray-500 font-bold">Estimated Price</p>
          <p className="font-serif text-xl font-bold text-gold-700">₹{(livePrice || 0).toLocaleString()}</p>
        </div>
        <button
          onClick={() => setOrderModalOpen(true)}
          className="px-6 py-3 rounded-full bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest flex items-center space-x-1.5 shadow-md active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Order on WhatsApp</span>
        </button>
      </div>

      {/* LIGHTBOX FULLSCREEN IMAGE VIEWER */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/40 flex items-center justify-center z-50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-4xl aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={allImages[activeImgIndex]}
              alt={cake.name}
              fill
              className="object-contain"
            />
          </div>

          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setActiveImgIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/40 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setActiveImgIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/40 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}

      {/* QUICK VIEW MODAL FOR RELATED CAKES */}
      <CakeModal cake={quickViewCake} onClose={() => setQuickViewCake(null)} />

      {/* ONE-PAGE ORDER FORM MODAL */}
      <OrderFormModal
        cake={orderModalOpen ? cake : null}
        selectedWeightLabel={currentWeightLabel}
        selectedPrice={livePrice}
        selectedFlavor={`${selectedSponge} with ${selectedFilling}`}
        selectedShape={selectedShape}
        onClose={() => setOrderModalOpen(false)}
      />

    </main>
  );
}
