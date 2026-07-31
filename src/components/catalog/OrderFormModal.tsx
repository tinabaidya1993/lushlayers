'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Sparkles, MessageCircle, CheckCircle2, Upload, Check } from 'lucide-react';
import { CakeItem } from '@/types';

interface OrderFormModalProps {
  cake: CakeItem | null;
  selectedWeightOption?: { weightKg: number; label: string; price: number };
  selectedWeightLabel?: string;
  selectedPrice?: number;
  selectedFlavor?: string;
  selectedShape?: string;
  onClose: () => void;
}

export default function OrderFormModal({
  cake,
  selectedWeightOption,
  selectedWeightLabel,
  selectedPrice,
  selectedFlavor,
  selectedShape,
  onClose,
}: OrderFormModalProps) {
  // Lock background body scroll when order modal is active
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

  const defaultWeight = selectedWeightOption || {
    weightKg: 1.5,
    label: selectedWeightLabel || cake.servings,
    price: selectedPrice || cake.priceStartingFrom,
  };

  const [weight, setWeight] = useState(defaultWeight);
  const [flavor, setFlavor] = useState(selectedFlavor || cake.flavors[0] || 'Signature Vanilla Bean');
  const [shape, setShape] = useState(selectedShape || 'Classic Round');
  const [creamType, setCreamType] = useState('Swiss Meringue Buttercream');
  const [themeColor, setThemeColor] = useState('Ivory & Gold Leaf');

  // Customer Input Fields
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('10:00 AM - 01:00 PM');
  const [cakeMessage, setCakeMessage] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Image Upload
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Flow & State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ orderId: string; whatsappUrl: string } | null>(null);

  // Form Validation
  const isValid = customerName.trim().length >= 2 && phoneNumber.trim().length >= 8 && deliveryAddress.trim().length >= 5;

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

      if (data.success && data.images?.[0]) {
        setReferenceImageUrl(data.images[0].secure_url || data.images[0].url);
      }
    } catch (err) {
      alert('Failed to upload reference image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setIsSubmitting(true);

      const payload = {
        customerDetails: {
          customerName,
          phoneNumber,
          deliveryAddress,
          deliveryDate: deliveryDate || 'Preferred Date',
          deliveryTime,
        },
        cakeSnapshot: {
          cakeId: cake.id,
          cakeName: cake.name,
          cakeCategory: cake.category,
          image: cake.image,
        },
        weight: weight.label,
        flavor,
        estimatedPrice: weight.price,
        selectedOptions: {
          shape,
          creamType,
          themeColor,
          cakeMessage,
          referenceImageUrl,
          specialNotes,
        },
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setOrderSuccess({
          orderId: data.orderId,
          whatsappUrl: data.whatsappUrl,
        });
      } else {
        throw new Error(data.error || 'Failed to submit order');
      }
    } catch (err: any) {
      alert(`Error submitting order: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-charcoal-900/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl border border-warmgray-200 space-y-5 my-auto max-h-[90vh] overflow-y-auto text-xs text-charcoal-900 animate-fade-in relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gold-500 hover:bg-gold-400 text-charcoal-950 flex items-center justify-center font-bold transition-all shadow-md cursor-pointer border border-gold-300 active:scale-90"
          aria-label="Close form"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* SUCCESS SCREEN EXPERIENCE */}
        {orderSuccess ? (
          <div className="text-center py-8 space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-700">Order ID: #{orderSuccess.orderId}</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-bold">
                Order Details Prepared Successfully!
              </h2>
              <p className="text-xs text-warmgray-600 max-w-md mx-auto leading-relaxed">
                Your order has been saved to our database. Click below to continue to WhatsApp and confirm your date with our head cake artist.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
              <a
                href={orderSuccess.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-md hover:shadow-emerald-600/30 active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Continue to WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-full border border-warmgray-300 font-bold text-xs uppercase tracking-wider text-charcoal-900 hover:border-gold-500"
              >
                Back to Catalog
              </button>
            </div>
          </div>
        ) : (
          /* ONE-PAGE RESPONSIVE ORDER FORM */
          <>
            <div className="border-b border-warmgray-200 pb-3 pr-8">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold-50 border border-gold-300 text-gold-700 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold tracking-wider">One-Page WhatsApp Booking</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                Order Booking: {cake.name}
              </h2>
            </div>

            {/* Cake Summary Card */}
            <div className="p-3.5 bg-cream-50 rounded-2xl border border-warmgray-200 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-warmgray-200">
                  <Image src={cake.image} alt={cake.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-charcoal-900">{cake.name}</h4>
                  <span className="text-[11px] text-warmgray-500">{weight.label}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-warmgray-500 block">Estimated Price</span>
                <span className="font-serif text-lg font-bold text-gold-700">₹{weight.price.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Customer Required Information */}
              <div className="space-y-3 pt-1">
                <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-warmgray-100 pb-1.5 flex items-center justify-between">
                  <span>1. Customer Details (Required)</span>
                  {!isValid && <span className="text-[10px] text-red-500 font-normal">Fill required fields to enable order</span>}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-warmgray-700 mb-1">
                      Customer Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Roy"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none text-xs font-medium ${
                        customerName.length > 0 && customerName.length < 2 ? 'border-red-400 bg-red-50/30' : 'border-warmgray-300 focus:border-gold-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-warmgray-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none text-xs font-medium ${
                        phoneNumber.length > 0 && phoneNumber.length < 8 ? 'border-red-400 bg-red-50/30' : 'border-warmgray-300 focus:border-gold-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-warmgray-700 mb-1">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Full delivery address with landmark..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-warmgray-300 focus:border-gold-500 focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Cake Customization Options */}
              <div className="space-y-3 pt-2">
                <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-warmgray-100 pb-1.5">
                  2. Cake Options & Live Weight Selection
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-warmgray-700 mb-1">Weight / Servings</label>
                    <select
                      value={weight.label}
                      onChange={(e) => {
                        const opt = cake.weightOptions?.find((w) => w.label === e.target.value);
                        if (opt) setWeight(opt);
                        else setWeight({ weightKg: 1.5, label: e.target.value, price: weight.price });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-warmgray-300 font-bold text-charcoal-900 focus:border-gold-500 focus:outline-none text-xs"
                    >
                      {cake.weightOptions?.map((w, idx) => (
                        <option key={idx} value={w.label}>
                          {w.label} — ₹{w.price.toLocaleString()}
                        </option>
                      )) || <option value={weight.label}>{weight.label} — ₹{weight.price.toLocaleString()}</option>}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-warmgray-700 mb-1">Flavor Selection</label>
                    <select
                      value={flavor}
                      onChange={(e) => setFlavor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-warmgray-300 text-charcoal-900 focus:border-gold-500 focus:outline-none text-xs font-semibold"
                    >
                      {cake.flavors.map((flv, idx) => (
                        <option key={idx} value={flv}>
                          {flv}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-warmgray-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-warmgray-300 text-charcoal-900 focus:border-gold-500 focus:outline-none text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-warmgray-700 mb-1">Time Slot</label>
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-warmgray-300 text-charcoal-900 focus:border-gold-500 focus:outline-none text-xs font-semibold"
                    >
                      <option value="10:00 AM - 01:00 PM">Morning (10:00 AM - 01:00 PM)</option>
                      <option value="02:00 PM - 05:00 PM">Afternoon (02:00 PM - 05:00 PM)</option>
                      <option value="06:00 PM - 09:00 PM">Evening (06:00 PM - 09:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-warmgray-700 mb-1">Cake Plaque Message</label>
                  <input
                    type="text"
                    placeholder='e.g. "Happy Birthday Riya!"'
                    value={cakeMessage}
                    onChange={(e) => setCakeMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-warmgray-300 focus:border-gold-500 focus:outline-none text-xs font-medium"
                  />
                </div>

                {/* Upload Reference Image */}
                <div>
                  <label className="block font-bold text-warmgray-700 mb-1">Upload Reference Image (Cloudinary)</label>
                  <div className="flex items-center space-x-3">
                    <label className="px-3.5 py-2 rounded-xl border border-gold-500 text-gold-700 font-bold bg-gold-50 hover:bg-gold-500 hover:text-white transition-all cursor-pointer inline-flex items-center space-x-2 text-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading to CDN...' : 'Choose File'}</span>
                      <input type="file" accept="image/*" onChange={handleReferenceUpload} className="hidden" />
                    </label>
                    {referenceImageUrl && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                        <Check className="w-3 h-3 mr-1" /> Reference Uploaded!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-3 border-t border-warmgray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-left w-full sm:w-auto">
                  <span className="text-[10px] text-warmgray-500 uppercase tracking-wider block font-semibold">Total Estimated</span>
                  <span className="font-serif text-2xl font-bold text-gold-700">₹{weight.price.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center space-x-2 ${
                    isValid && !isSubmitting
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-600/30 active:scale-95'
                      : 'bg-warmgray-200 text-warmgray-400 cursor-not-allowed'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving Order...' : 'Submit & Open WhatsApp'}</span>
                </button>
              </div>

            </form>
          </>
        )}

      </div>
    </div>
  );
}
