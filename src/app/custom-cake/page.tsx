'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CUSTOMIZER_OPTIONS } from '@/data/cakes';
import { Sparkles, MessageCircle, Check, Upload, Clock, Calendar, User, Phone, MapPin, ShieldCheck, Camera } from 'lucide-react';
import { buildCustomCakeWhatsAppUrl } from '@/lib/whatsapp';
import { optimizeImageClientSide } from '@/lib/imageOptimizer';

export default function CustomCakePage() {
  // Customer Details State
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');

  // Cake Specifications State
  const [cakeCategory, setCakeCategory] = useState<string>('Grand Birthday Celebration');
  const [weightLabel, setWeightLabel] = useState<string>('1.5 Pound (1.5 lb)');
  const [tiers, setTiers] = useState<number>(1);
  const [shape, setShape] = useState<'round' | 'square' | 'heart' | 'hexagonal'>('round');
  const [spongeFlavor, setSpongeFlavor] = useState<string>(CUSTOMIZER_OPTIONS.spongeFlavors[0].name);
  const [fillingFlavor, setFillingFlavor] = useState<string>(CUSTOMIZER_OPTIONS.fillingFlavors[0].name);
  const [colorPalette, setColorPalette] = useState<string>(CUSTOMIZER_OPTIONS.colorPalettes[0].name);
  const [customMessage, setCustomMessage] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deliveryTime, setDeliveryTime] = useState<string>('02:00 PM - 05:00 PM (Afternoon)');
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Reference Image State
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Reference Image Upload Handler (with client-side WebP compression)
  const handleReferenceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const rawFile = e.target.files[0];

    try {
      setUploadingImage(true);
      const optRes = await optimizeImageClientSide(rawFile);
      const formData = new FormData();
      formData.append('file', optRes.file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.images?.[0]) {
        setReferenceImageUrl(data.images[0].secure_url || data.images[0].url);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      alert(`Reference image upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const isFormValid = customerName.trim().length >= 2 && phoneNumber.trim().length >= 8 && deliveryAddress.trim().length >= 5;

  const whatsappUrl = buildCustomCakeWhatsAppUrl({
    occasion: cakeCategory,
    tiers,
    shape,
    servings: 12,
    spongeFlavor,
    fillingFlavor,
    frostingStyle: 'Silk Smooth Buttercream',
    colorPalette,
    toppings: [],
    customMessage,
    deliveryDate,
    notes: specialNotes,
    referenceImageUrl,
    customerName,
    phoneNumber,
    deliveryAddress,
    deliveryTime,
    cakeCategory,
  });

  return (
    <div className="min-h-screen bg-cream-50 text-charcoal-900 pt-20 pb-20 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-cream-100 via-white to-cream-50 border-b border-warmgray-200 py-10 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-gold-700 text-xs font-bold uppercase tracking-widest bg-gold-50 px-3.5 py-1.5 rounded-full border border-gold-300">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <span>Tina Manna Bespoke Atelier</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 tracking-tight">
            Custom Cake Request
          </h1>
          <p className="text-xs sm:text-sm text-warmgray-600 max-w-2xl mx-auto leading-relaxed">
            Upload your dream cake reference image and customize your preferences. Master Pastry Chef Tina Manna will estimate & discuss the final price directly with you on WhatsApp!
          </p>
        </div>
      </div>

      {/* Main Request Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-warmgray-200 shadow-sm space-y-8">
          
          {/* Section 1: Customer Details */}
          <div className="space-y-4 pb-6 border-b border-warmgray-200">
            <div className="flex items-center space-x-2.5 text-gold-700">
              <User className="w-5 h-5" />
              <h2 className="font-serif text-xl font-bold text-charcoal-900">1. Customer Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Tina Manna"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:border-gold-500 focus:outline-none text-charcoal-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  placeholder="e.g. 98300XXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:border-gold-500 focus:outline-none text-charcoal-900 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-warmgray-700 mb-1">Delivery Address *</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 4B, Green View Towers, Salt Lake Sector 5, Kolkata"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:border-gold-500 focus:outline-none text-charcoal-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Reference Image Upload */}
          <div className="space-y-4 pb-6 border-b border-warmgray-200">
            <div className="flex items-center space-x-2.5 text-gold-700">
              <Camera className="w-5 h-5" />
              <h2 className="font-serif text-xl font-bold text-charcoal-900">2. Reference Image Upload</h2>
            </div>
            <p className="text-xs text-warmgray-600">
              Upload a sample photo of the cake design you would like us to replicate or draw inspiration from.
            </p>

            <div className="p-5 rounded-2xl bg-cream-50 border-2 border-dashed border-gold-300 flex flex-col items-center justify-center text-center space-y-3">
              {referenceImageUrl ? (
                <div className="space-y-2">
                  <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-gold-500 shadow-md mx-auto">
                    <Image src={referenceImageUrl} alt="Reference sample" fill className="object-cover" />
                  </div>
                  <span className="text-xs font-bold text-emerald-700 flex items-center justify-center">
                    <Check className="w-4 h-4 mr-1" /> Reference Photo Uploaded!
                  </span>
                  <label className="text-[11px] text-gold-700 underline font-bold cursor-pointer block">
                    Change Reference Image
                    <input type="file" accept="image/*" onChange={handleReferenceUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gold-600 animate-bounce" />
                  <div>
                    <p className="text-xs font-bold text-charcoal-900">Click to upload sample cake picture</p>
                    <p className="text-[10px] text-warmgray-500">Supports JPG, PNG, WebP (Auto WebP compressed client-side)</p>
                  </div>
                  <label className="px-5 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer transition-all inline-block">
                    <span>{uploadingImage ? 'Compressing & Uploading...' : 'Browse Image File'}</span>
                    <input type="file" accept="image/*" onChange={handleReferenceUpload} className="hidden" />
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Section 3: Cake Specifications */}
          <div className="space-y-4 pb-6 border-b border-warmgray-200">
            <div className="flex items-center space-x-2.5 text-gold-700">
              <Sparkles className="w-5 h-5" />
              <h2 className="font-serif text-xl font-bold text-charcoal-900">3. Cake Specifications</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Occasion / Theme</label>
                <select
                  value={cakeCategory}
                  onChange={(e) => setCakeCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:border-gold-500 focus:outline-none text-charcoal-900 font-medium"
                >
                  <option value="Grand Birthday Celebration">Grand Birthday Celebration</option>
                  <option value="Luxury Wedding Tier">Luxury Wedding Tier</option>
                  <option value="Anniversary & Romance">Anniversary & Romance</option>
                  <option value="Baby Shower / Gender Reveal">Baby Shower / Gender Reveal</option>
                  <option value="Theme / Sculpted Novelty">Theme / Sculpted Novelty</option>
                  <option value="Corporate / Event Celebration">Corporate / Event Celebration</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Estimated Weight / Size</label>
                <select
                  value={weightLabel}
                  onChange={(e) => setWeightLabel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:border-gold-500 focus:outline-none text-charcoal-900 font-medium"
                >
                  <option value="0.5 Pound (Half Pound)">0.5 Pound (Half Pound)</option>
                  <option value="1 Pound (1 lb)">1 Pound (1 lb)</option>
                  <option value="1.5 Pound (1.5 lb)">1.5 Pound (1.5 lb)</option>
                  <option value="2 Pound (2 lb)">2 Pound (2 lb)</option>
                  <option value="3 Pound (3 lb)">3 Pound (3 lb)</option>
                  <option value="4 Pound (4 lb)">4 Pound (4 lb)</option>
                  <option value="5 Pound (Multi-Tier)">5 Pound (Multi-Tier)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Sponge Base Flavor</label>
                <select
                  value={spongeFlavor}
                  onChange={(e) => setSpongeFlavor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:border-gold-500 focus:outline-none text-charcoal-900 font-medium"
                >
                  {CUSTOMIZER_OPTIONS.spongeFlavors.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Gourmet Filling</label>
                <select
                  value={fillingFlavor}
                  onChange={(e) => setFillingFlavor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:border-gold-500 focus:outline-none text-charcoal-900 font-medium"
                >
                  {CUSTOMIZER_OPTIONS.fillingFlavors.map((f) => (
                    <option key={f.name} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Event Delivery Date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:border-gold-500 focus:outline-none text-charcoal-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Delivery Time Slot</label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:border-gold-500 focus:outline-none text-charcoal-900 font-medium"
                >
                  <option value="10:00 AM - 01:00 PM">Morning (10:00 AM - 01:00 PM)</option>
                  <option value="02:00 PM - 05:00 PM">Afternoon (02:00 PM - 05:00 PM)</option>
                  <option value="06:00 PM - 09:00 PM">Evening (06:00 PM - 09:00 PM)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-warmgray-700 mb-1">Custom Cake Plaque Text</label>
                <input
                  type="text"
                  placeholder='e.g. "Happy 30th Birthday Rahul!"'
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:border-gold-500 focus:outline-none text-charcoal-900 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-warmgray-700 mb-1">Special Design Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Mention specific color preferences, eggless requirements, or special decorative details..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:border-gold-500 focus:outline-none text-charcoal-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 4: WhatsApp Price Estimate Banner & Action Button */}
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-amber-50 border border-gold-300 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center text-gold-800 text-sm">
                💬 Price Estimate & Quote Discussion
              </span>
              <p>
                Bespoke custom reference cakes are priced based on the complexity of handcrafted decorations and work involved. Final price quote will be estimated and discussed directly with Master Chef Tina Manna over WhatsApp after evaluating your sample photo.
              </p>
            </div>

            <a
              href={isFormValid ? whatsappUrl : '#'}
              target={isFormValid ? '_blank' : '_self'}
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!isFormValid) {
                  e.preventDefault();
                  alert('Please fill out all required fields: Name, Phone, and Delivery Address.');
                }
              }}
              className={`w-full py-4 px-6 rounded-full font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center space-x-2 ${
                isFormValid
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-600/30 active:scale-95'
                  : 'bg-warmgray-200 text-warmgray-400 cursor-not-allowed'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Custom Inquiry via WhatsApp</span>
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
