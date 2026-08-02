'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CUSTOMIZER_OPTIONS } from '@/data/cakes';
import { CustomizationSelection } from '@/types';
import { Sparkles, MessageCircle, Check, AlertCircle, Upload, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { buildCustomCakeWhatsAppUrl } from '@/lib/whatsapp';

const RealisticCakeCanvas = dynamic(() => import('@/components/customizer/RealisticCakeCanvas'), {
  ssr: false,
  loading: () => <div className="w-full aspect-square rounded-2xl bg-cream-100 animate-pulse border border-warmgray-200" />,
});

export default function CustomCakePage() {
  const [step, setStep] = useState<number>(1);
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const [selection, setSelection] = useState<CustomizationSelection>({
    occasion: 'Grand Birthday Celebration',
    tiers: 1,
    shape: 'round',
    servings: 12,
    spongeFlavor: 'Madagascar Bourbon Vanilla Bean',
    fillingFlavor: 'Velvet Belgian Dark Chocolate Ganache',
    frostingStyle: 'Silk Smooth Buttercream',
    colorPalette: 'Pure White & 24K Gold Foil',
    toppings: ['Handcrafted 24K Gold Leafing'],
    customMessage: '',
    deliveryDate: '',
    notes: '',
    referenceImageUrl: '',
  });

  const customMsg = (selection.customMessage || '').trim();
  const dateVal = (selection.deliveryDate || '').trim();

  // Validate missing fields
  const missingFields: { step: number; field: string; message: string }[] = [];

  if (!selection.occasion) {
    missingFields.push({ step: 1, field: 'occasion', message: 'Select celebration occasion' });
  }
  if (!selection.tiers || !selection.shape) {
    missingFields.push({ step: 2, field: 'tiers', message: 'Select tier structure & shape' });
  }
  if (!selection.spongeFlavor || !selection.fillingFlavor) {
    missingFields.push({ step: 3, field: 'flavors', message: 'Select sponge base & filling flavor' });
  }
  if (!selection.frostingStyle || !selection.colorPalette) {
    missingFields.push({ step: 4, field: 'design', message: 'Select frosting style & color theme' });
  }
  if (!selection.toppings || selection.toppings.length === 0) {
    missingFields.push({ step: 5, field: 'toppings', message: 'Select at least 1 decorative accent' });
  }
  if (!customMsg) {
    missingFields.push({ step: 5, field: 'customMessage', message: 'Enter custom plaque lettering or type "None"' });
  }
  if (!dateVal) {
    missingFields.push({ step: 5, field: 'deliveryDate', message: 'Select preferred event date' });
  }

  const isFormComplete = missingFields.length === 0;

  // Real-time price calculation
  const basePrice = 3500;
  const tierMultiplier = selection.tiers === 3 ? 3.8 : selection.tiers === 2 ? 2.2 : selection.tiers === 1.5 ? 1.35 : 1;
  const toppingsAddon = selection.toppings.length * 600;
  const estimatedPrice = Math.round(basePrice * tierMultiplier + toppingsAddon);

  const toggleTopping = (topping: string) => {
    setSelection((prev) => {
      const exists = prev.toppings.includes(topping);
      const updated = exists
        ? prev.toppings.filter((t) => t !== topping)
        : [...prev.toppings, topping];
      return { ...prev, toppings: updated };
    });
  };

  // Direct Cloudinary Upload for Reference Image
  const handleReferenceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success && data.images?.[0]) {
        const cdnUrl = data.images[0].secure_url || data.images[0].url;
        setSelection((prev) => ({ ...prev, referenceImageUrl: cdnUrl }));
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      alert(`Reference image upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const whatsappUrl = buildCustomCakeWhatsAppUrl(selection);

  const handleWhatsAppClick = async (e: React.MouseEvent) => {
    setAttemptedSubmit(true);
    if (!isFormComplete) {
      e.preventDefault();
      const firstMissing = missingFields[0];
      if (firstMissing) setStep(firstMissing.step);
      return;
    }

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerDetails: {
            customerName: 'Custom Atelier Guest',
            phoneNumber: 'WhatsApp Direct',
            deliveryAddress: 'To be confirmed on WhatsApp',
            deliveryDate: selection.deliveryDate || 'Flexible',
            deliveryTime: 'Standard',
          },
          cakeSnapshot: {
            cakeName: `Bespoke Custom Cake (${selection.tiers} Tiers)`,
            cakeCategory: 'custom',
            image: selection.referenceImageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
          },
          weight: `${selection.tiers} Tier(s) (${selection.servings} Servings)`,
          flavor: `${selection.spongeFlavor} with ${selection.fillingFlavor}`,
          estimatedPrice,
          selectedOptions: {
            shape: selection.shape,
            creamType: selection.frostingStyle,
            themeColor: selection.colorPalette,
            cakeMessage: selection.customMessage,
            referenceImageUrl: selection.referenceImageUrl,
            specialNotes: selection.notes,
          },
        }),
      });
    } catch (err) {
      console.warn('MongoDB pre-save fallback');
    }
  };

  return (
    <main className="min-h-screen bg-cream-50 pt-24 sm:pt-28 pb-36 lg:pb-28 text-charcoal-900">
      
      {/* Header */}
      <section className="bg-gradient-to-b from-cream-100 to-cream-50 text-charcoal-900 py-8 sm:py-12 px-4 mb-6 sm:mb-8 border-b border-warmgray-200/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-2 sm:space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white border border-gold-400 text-gold-700 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold">Real-Time Bespoke Atelier</span>
          </div>
          
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl text-charcoal-900 tracking-tight font-bold">
            Interactive Custom Cake Studio
          </h1>

          <p className="text-xs sm:text-sm text-warmgray-600 max-w-xl mx-auto font-normal leading-relaxed">
            Customize every layer in real-time. Upload reference photos directly for instant WhatsApp delivery.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
        
        {/* Missing Fields Global Warning Notice */}
        {attemptedSubmit && !isFormComplete && (
          <div className="p-4 sm:p-5 bg-amber-50 border border-amber-300 rounded-2xl sm:rounded-3xl shadow-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Action Required: Complete custom cake options ({missingFields.length} remaining)
              </h4>
              <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside font-medium">
                {missingFields.map((mf, i) => (
                  <li key={i}>
                    Step {mf.step}: {mf.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 
          DESKTOP (WINDOWS VIEW): Side-by-Side 2 Columns (Col 7 Options, Col 5 Live Canvas Sticky Preview).
          MOBILE & TABLET VIEW: Sequential Stack (Form -> Canvas -> Reference Upload -> Price & WhatsApp).
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* OPTIONS STEPPER & INPUTS COLUMN (Col 7 on Desktop) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. FORM OPTIONS STEPPER */}
            <div className="bg-white p-5 sm:p-8 rounded-3xl border border-warmgray-200 space-y-6 shadow-sm">
              
              {/* Step Navigation Pills */}
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-warmgray-200">
                {[
                  { num: 1, name: 'Occasion' },
                  { num: 2, name: 'Tiers & Shape' },
                  { num: 3, name: 'Flavors' },
                  { num: 4, name: 'Design & Colors' },
                  { num: 5, name: 'Accents & Plaque' },
                ].map((s) => {
                  const hasErrorInStep = missingFields.some((mf) => mf.step === s.num);
                  return (
                    <button
                      key={s.num}
                      onClick={() => setStep(s.num)}
                      className={`flex items-center space-x-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-[11px] sm:text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all ${
                        step === s.num
                          ? 'bg-gold-500 text-white shadow-sm'
                          : attemptedSubmit && hasErrorInStep
                          ? 'bg-amber-100 text-amber-900 border border-amber-400'
                          : 'bg-white text-warmgray-600 hover:bg-warmgray-200 border border-warmgray-200'
                      }`}
                    >
                      <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] ${step === s.num ? 'bg-white text-gold-700' : 'bg-warmgray-200 text-warmgray-600'}`}>
                        {s.num}
                      </span>
                      <span>{s.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* STEP 1: Occasion */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-charcoal-900 mb-1 font-bold">1. What is the celebration?</h3>
                    <p className="text-xs text-warmgray-500">Select event style to curate matching decorative tiers.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CUSTOMIZER_OPTIONS.occasions.map((occ) => (
                      <button
                        key={occ}
                        onClick={() => setSelection({ ...selection, occasion: occ })}
                        className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${
                          selection.occasion === occ
                            ? 'border-gold-500 bg-gold-50/60 text-charcoal-900 font-bold shadow-sm'
                            : 'border-warmgray-200 hover:border-gold-400 text-warmgray-700'
                        }`}
                      >
                        <span className="text-xs font-bold uppercase tracking-wider">{occ}</span>
                        {selection.occasion === occ && <Check className="w-4 h-4 text-gold-600" />}
                      </button>
                    ))}
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gold-500 text-white text-xs font-bold uppercase tracking-widest shadow-sm"
                    >
                      Next: Tiers & Shape →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Tiers & Shape */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-charcoal-900 mb-1 font-bold">2. Structure & Guest Sizing</h3>
                    <p className="text-xs text-warmgray-500">Choose the number of cake tiers and silhouette shape.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-warmgray-600 mb-2 font-bold">
                      Number of Tiers & Servings
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {CUSTOMIZER_OPTIONS.tierOptions.map((opt) => (
                        <button
                          key={opt.tiers}
                          onClick={() => setSelection({ ...selection, tiers: opt.tiers, servings: parseInt(opt.servings) || 12 })}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            selection.tiers === opt.tiers
                              ? 'border-gold-500 bg-gold-50/60 shadow-sm'
                              : 'border-warmgray-200 hover:border-gold-400'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-serif text-base font-bold text-charcoal-900">
                              {opt.tiers === 1 ? '1 Classic Tier' : opt.tiers === 1.5 ? '1 Tall Tier (Extended Height)' : `${opt.tiers} Tiers`}
                            </span>
                            {selection.tiers === opt.tiers && <Check className="w-4 h-4 text-gold-600" />}
                          </div>
                          <p className="text-xs text-warmgray-500">{opt.servings}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-warmgray-600 mb-2 font-bold">
                      Silhouette Shape
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {CUSTOMIZER_OPTIONS.shapes.map((sh) => (
                        <button
                          key={sh.id}
                          onClick={() => setSelection({ ...selection, shape: sh.id as any })}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            selection.shape === sh.id
                              ? 'border-gold-500 bg-gold-50/60 text-charcoal-900 font-bold'
                              : 'border-warmgray-200 hover:border-gold-400 text-warmgray-700'
                          }`}
                        >
                          <span className="text-xs font-bold uppercase tracking-wider">{sh.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between items-center">
                    <button onClick={() => setStep(1)} className="text-xs font-bold uppercase tracking-widest text-warmgray-500">← Back</button>
                    <button onClick={() => setStep(3)} className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gold-500 text-white text-xs font-bold uppercase tracking-widest shadow-sm">Next: Flavors →</button>
                  </div>
                </div>
              )}

              {/* STEP 3: Sponge & Filling Flavors */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-charcoal-900 mb-1 font-bold">3. Gourmet Flavor Pairings</h3>
                    <p className="text-xs text-warmgray-500 font-medium">Formulated with organic butter and single-origin ingredients.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-warmgray-600 mb-2">
                      Sponge Base Flavor
                    </label>
                    <div className="space-y-2">
                      {CUSTOMIZER_OPTIONS.spongeFlavors.map((sp) => (
                        <button
                          key={sp.name}
                          onClick={() => setSelection({ ...selection, spongeFlavor: sp.name })}
                          className={`w-full p-3.5 rounded-2xl border text-left flex justify-between items-center transition-all ${
                            selection.spongeFlavor === sp.name
                              ? 'border-gold-500 bg-gold-50/60 shadow-sm'
                              : 'border-warmgray-200 hover:border-gold-400'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold text-charcoal-900">{sp.name}</p>
                            <p className="text-[11px] text-warmgray-500">{sp.desc}</p>
                          </div>
                          {selection.spongeFlavor === sp.name && <Check className="w-4 h-4 text-gold-600 flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-warmgray-600 mb-2">
                      Gourmet Filling
                    </label>
                    <div className="space-y-2">
                      {CUSTOMIZER_OPTIONS.fillingFlavors.map((fl) => (
                        <button
                          key={fl.name}
                          onClick={() => setSelection({ ...selection, fillingFlavor: fl.name })}
                          className={`w-full p-3.5 rounded-2xl border text-left flex justify-between items-center transition-all ${
                            selection.fillingFlavor === fl.name
                              ? 'border-gold-500 bg-gold-50/60 shadow-sm'
                              : 'border-warmgray-200 hover:border-gold-400'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold text-charcoal-900">{fl.name}</p>
                            <p className="text-[11px] text-warmgray-500">{fl.desc}</p>
                          </div>
                          {selection.fillingFlavor === fl.name && <Check className="w-4 h-4 text-gold-600 flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between items-center">
                    <button onClick={() => setStep(2)} className="text-xs font-bold uppercase tracking-widest text-warmgray-500">← Back</button>
                    <button onClick={() => setStep(4)} className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gold-500 text-white text-xs font-bold uppercase tracking-widest shadow-sm">Next: Design & Colors →</button>
                  </div>
                </div>
              )}

              {/* STEP 4: Frosting & Palette */}
              {step === 4 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-charcoal-900 mb-1 font-bold">4. Exterior Finish & Color Theme</h3>
                    <p className="text-xs text-warmgray-500 font-medium">Define visual texture and color theme.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-warmgray-600 mb-2">
                      Frosting Texture Style
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {CUSTOMIZER_OPTIONS.frostingStyles.map((fr) => (
                        <button
                          key={fr.name}
                          onClick={() => setSelection({ ...selection, frostingStyle: fr.name })}
                          className={`p-3.5 rounded-2xl border text-left transition-all ${
                            selection.frostingStyle === fr.name
                              ? 'border-gold-500 bg-gold-50/60 shadow-sm'
                              : 'border-warmgray-200 hover:border-gold-400'
                          }`}
                        >
                          <p className="text-xs font-bold text-charcoal-900 mb-0.5">{fr.name}</p>
                          <p className="text-[11px] text-warmgray-500">{fr.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-warmgray-600 mb-2">
                      Curated Palette
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {CUSTOMIZER_OPTIONS.colorPalettes.map((cp) => (
                        <button
                          key={cp.name}
                          onClick={() => setSelection({ ...selection, colorPalette: cp.name })}
                          className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                            selection.colorPalette === cp.name
                              ? 'border-gold-500 bg-gold-50/60 shadow-sm'
                              : 'border-warmgray-200 hover:border-gold-400'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full border border-warmgray-400 flex-shrink-0" style={{ backgroundColor: cp.colorHex }}></span>
                          <span className="text-xs font-bold text-charcoal-900">{cp.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between items-center">
                    <button onClick={() => setStep(3)} className="text-xs font-bold uppercase tracking-widest text-warmgray-500">← Back</button>
                    <button onClick={() => setStep(5)} className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gold-500 text-white text-xs font-bold uppercase tracking-widest shadow-sm">Next: Accents & Plaque →</button>
                  </div>
                </div>
              )}

              {/* STEP 5: Accents, Custom Plaque, Date */}
              {step === 5 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-charcoal-900 mb-1 font-bold">5. Decorative Accents & Plaque Lettering</h3>
                    <p className="text-xs text-warmgray-500 font-medium">Customize handcrafted accents and plaque text.</p>
                  </div>

                  {/* Toppings Checklist */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-warmgray-600 mb-2 flex items-center justify-between">
                      <span>Decorative Accents (Required: Select at least 1)</span>
                      {selection.toppings.length === 0 && (
                        <span className="text-amber-600 font-bold text-[10px] uppercase">Selection required</span>
                      )}
                    </label>
                    <div className="space-y-2">
                      {CUSTOMIZER_OPTIONS.toppings.map((top) => {
                        const isSelected = selection.toppings.includes(top);
                        return (
                          <button
                            key={top}
                            onClick={() => toggleTopping(top)}
                            className={`w-full p-3.5 rounded-2xl border text-left flex justify-between items-center transition-all ${
                              isSelected
                                ? 'border-gold-500 bg-gold-50/60 shadow-sm'
                                : attemptedSubmit && selection.toppings.length === 0
                                ? 'border-amber-400 bg-amber-50/30'
                                : 'border-warmgray-200 hover:border-gold-400'
                            }`}
                          >
                            <span className="text-xs font-bold text-charcoal-900">{top}</span>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected ? 'bg-gold-500 border-gold-500 text-white' : 'border-warmgray-300'}`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Plaque text & Date */}
                  <div className="space-y-3 pt-3 border-t border-warmgray-100">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-warmgray-600 mb-1.5 flex justify-between">
                        <span>Custom Plaque Lettering / Message *</span>
                        {!customMsg && (
                          <span className="text-amber-600 font-bold text-[10px] uppercase">Required</span>
                        )}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Happy 30th Birthday Sarah! ✨ (or type 'None')"
                        value={selection.customMessage || ''}
                        onChange={(e) => setSelection({ ...selection, customMessage: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-charcoal-900 placeholder-warmgray-400 focus:outline-none ${
                          attemptedSubmit && !customMsg
                            ? 'border-amber-500 bg-amber-50/30 focus:ring-1 focus:ring-amber-500'
                            : 'border-warmgray-300 focus:border-gold-500'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-warmgray-600 mb-1.5 flex justify-between">
                        <span>Preferred Event Date *</span>
                        {!dateVal && (
                          <span className="text-amber-600 font-bold text-[10px] uppercase">Required</span>
                        )}
                      </label>
                      <input
                        type="date"
                        value={selection.deliveryDate || ''}
                        onChange={(e) => setSelection({ ...selection, deliveryDate: e.target.value })}
                        className={`w-full sm:w-64 px-3.5 py-2.5 rounded-xl border text-xs text-charcoal-900 focus:outline-none ${
                          attemptedSubmit && !dateVal
                            ? 'border-amber-500 bg-amber-50/30 focus:ring-1 focus:ring-amber-500'
                            : 'border-warmgray-300 focus:border-gold-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between items-center">
                    <button onClick={() => setStep(4)} className="text-xs font-bold uppercase tracking-widest text-warmgray-500">← Back</button>
                  </div>
                </div>
              )}

            </div>

            {/* 2. UPLOAD REFERENCE PHOTO SECTION */}
            <div className="bg-white p-5 sm:p-7 rounded-3xl border border-warmgray-200 shadow-sm space-y-3">
              <h3 className="font-serif text-lg font-bold text-charcoal-900">Upload Reference Photo</h3>
              <p className="text-xs text-warmgray-500">Upload an optional Pinterest or Instagram inspiration photo.</p>

              <div className="flex items-center space-x-3 pt-1">
                <label className="px-5 py-2.5 rounded-xl border border-gold-500 text-gold-700 font-bold bg-cream-50 hover:bg-gold-500 hover:text-white transition-all cursor-pointer inline-flex items-center space-x-2 text-xs shadow-sm">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload Reference Photo'}</span>
                  <input type="file" accept="image/*" onChange={handleReferenceUpload} className="hidden" />
                </label>

                {selection.referenceImageUrl && (
                  <div className="flex items-center space-x-2">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-emerald-500">
                      <Image src={selection.referenceImageUrl} alt="Reference photo" fill className="object-cover" />
                    </div>
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Photo Attached!
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. ESTIMATED PRICE & ORDER VIA WHATSAPP BUTTON */}
            <div className="bg-white text-charcoal-900 rounded-3xl p-5 sm:p-7 border border-warmgray-300 shadow-luxury flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-warmgray-500 font-bold">Total Estimated Price</p>
                <p className="font-serif text-3xl font-bold text-gold-700">₹{(estimatedPrice || 0).toLocaleString()}</p>
              </div>

              <a
                href={isFormComplete ? whatsappUrl : '#'}
                onClick={handleWhatsAppClick}
                target={isFormComplete ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className={`w-full sm:w-auto px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2 transition-all shadow-md ${
                  isFormComplete
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95'
                    : 'bg-warmgray-200 text-warmgray-500 border border-warmgray-300 cursor-not-allowed'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isFormComplete ? 'Inquire via WhatsApp' : 'Complete All Fields to Inquire'}</span>
              </a>
            </div>

          </div>

          {/* REALTIME CAKE PREVIEW CANVAS COLUMN (Col 5 on Desktop, Sticky Side-by-Side View) */}
          <div className="lg:col-span-5 w-full lg:sticky lg:top-28 space-y-4">
            <RealisticCakeCanvas selection={selection} estimatedPrice={estimatedPrice} />
          </div>

        </div>

      </div>
    </main>
  );
}
