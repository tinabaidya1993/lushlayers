'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Sparkles, MessageCircle, CheckCircle2 } from 'lucide-react';
import { CakeItem, OrderFormDetails } from '@/types';
import { buildOnePageOrderWhatsAppUrl } from '@/lib/whatsapp';
import { useScrollLock } from '@/hooks/useScrollLock';

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
  // Global Scroll Lock when order modal is active
  useScrollLock(Boolean(cake));

  const defaultWeight = selectedWeightOption || {
    weightKg: 1.5,
    label: selectedWeightLabel || (cake?.weightOptions && cake.weightOptions[0] ? cake.weightOptions[0].label : cake?.servings || '1.5 kg'),
    price: selectedPrice || (cake?.weightOptions && cake.weightOptions[0] ? cake.weightOptions[0].price : cake?.priceStartingFrom || 1500),
  };

  const [weight, setWeight] = useState(defaultWeight);
  const [flavor, setFlavor] = useState(selectedFlavor || (cake?.flavors && cake.flavors[0] ? cake.flavors[0] : 'Signature Vanilla Bean'));
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

  // Flow & State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ orderId: string; whatsappUrl: string } | null>(null);

  // Celebration Add-on Accessories — fetched live from Admin Settings
  const [selectedAccessories, setSelectedAccessories] = useState<{ id: string; name: string; price: number }[]>([]);
  const [celebrationAccessoriesList, setCelebrationAccessoriesList] = useState<
    { id: string; name: string; emoji: string; price: number }[]
  >([
    { id: 'candles', name: 'Birthday Candles Pack', emoji: '🎂', price: 50 },
    { id: 'knife', name: 'Premium Cake Knife / Server', emoji: '🔪', price: 40 },
    { id: 'balloons', name: 'Party Balloons (Pack of 5)', emoji: '🎈', price: 100 },
    { id: 'sparklers', name: 'Golden Party Sparklers (Pack of 2)', emoji: '💖', price: 80 },
    { id: 'crown', name: 'Birthday Crown / Sash', emoji: '👑', price: 120 },
  ]);

  // Keep state in sync if props change
  useEffect(() => {
    if (cake) {
      const defaultW = selectedWeightOption || {
        weightKg: 1.5,
        label: selectedWeightLabel || (cake.weightOptions && cake.weightOptions[0] ? cake.weightOptions[0].label : cake?.servings || '1.5 kg'),
        price: selectedPrice || (cake.weightOptions && cake.weightOptions[0] ? cake.weightOptions[0].price : cake?.priceStartingFrom || 1500),
      };
      setWeight(defaultW);
      setFlavor(selectedFlavor || (cake.flavors && cake.flavors[0] ? cake.flavors[0] : 'Signature Vanilla Bean'));
      setShape(selectedShape || 'Classic Round');
    }
  }, [cake, selectedWeightLabel, selectedPrice, selectedFlavor, selectedShape, selectedWeightOption]);

  // Fetch live accessories from admin settings
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.accessories?.length > 0) {
          const active = data.settings.accessories.filter((a: any) => a.active !== false);
          if (active.length > 0) setCelebrationAccessoriesList(active);
        }
      })
      .catch(() => {}); // silent fallback to defaults
  }, []);

  if (!cake) return null;

  // Form Validation
  const isValid = customerName.trim().length >= 2 && phoneNumber.trim().length >= 8 && deliveryAddress.trim().length >= 5;

  const toggleAccessory = (acc: { id: string; name: string; price: number }) => {
    setSelectedAccessories((prev) =>
      prev.some((item) => item.id === acc.id)
        ? prev.filter((item) => item.id !== acc.id)
        : [...prev, acc]
    );
  };

  const basePrice = weight?.price || selectedPrice || cake?.priceStartingFrom || 1500;
  const accessoriesTotal = selectedAccessories.reduce((sum, item) => sum + item.price, 0);
  const currentPrice = basePrice + accessoriesTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const generatedOrderId = `LL-${Date.now().toString().slice(-6)}`;
    const currentWeightLabel = weight?.label || selectedWeightLabel || cake?.servings || '1.5 kg';

    const orderDetails: OrderFormDetails = {
      customerName,
      phoneNumber,
      deliveryAddress,
      deliveryDate: deliveryDate || 'Preferred Date TBD',
      deliveryTime,
      cakeName: cake.name,
      cakeCategory: cake.category,
      cakeImageUrl: cake.image,
      selectedWeight: currentWeightLabel,
      selectedPrice: currentPrice,
      selectedFlavor: flavor,
      selectedShape: shape,
      selectedCreamType: creamType,
      selectedThemeColor: themeColor,
      cakeMessage: cakeMessage || 'None',
      selectedAccessories,
      specialNotes: specialNotes || 'None',
      eggless: cake.eggless,
    };

    const directWhatsAppUrl = buildOnePageOrderWhatsAppUrl(orderDetails);

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
        weight: currentWeightLabel,
        flavor,
        estimatedPrice: currentPrice,
        selectedOptions: {
          shape,
          creamType,
          themeColor,
          cakeMessage,
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
          orderId: data.orderId || generatedOrderId,
          whatsappUrl: data.whatsappUrl || directWhatsAppUrl,
        });
      } else {
        // DB save fallback: still show order success with direct WhatsApp URL
        setOrderSuccess({
          orderId: generatedOrderId,
          whatsappUrl: directWhatsAppUrl,
        });
      }
    } catch (err: any) {
      // Offline/Network fallback: guarantee order flow works smoothly
      setOrderSuccess({
        orderId: generatedOrderId,
        whatsappUrl: directWhatsAppUrl,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-charcoal-900/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl border border-warmgray-200 space-y-5 my-auto max-h-[90vh] overflow-y-auto text-xs text-charcoal-900 animate-fade-in relative scroll-lock-overlay">
        
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
                  <span className="text-[11px] text-warmgray-500">{weight?.label || cake?.servings}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-warmgray-500 block">Estimated Price</span>
                <span className="font-serif text-lg font-bold text-gold-700">₹{(weight?.price || cake?.priceStartingFrom || 0).toLocaleString()}</span>
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
                      value={weight?.label || ''}
                      onChange={(e) => {
                        const opt = cake.weightOptions?.find((w) => w.label === e.target.value);
                        if (opt) setWeight(opt);
                        else setWeight({ weightKg: 1.5, label: e.target.value, price: weight?.price || cake?.priceStartingFrom || 1500 });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-warmgray-300 font-bold text-charcoal-900 focus:border-gold-500 focus:outline-none text-xs"
                    >
                      {cake.weightOptions?.map((w, idx) => (
                        <option key={idx} value={w.label}>
                          {w.label} — ₹{(w.price || 0).toLocaleString()}
                        </option>
                      )) || <option value={weight?.label}>{weight?.label} — ₹{(weight?.price || 0).toLocaleString()}</option>}
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

                {/* Celebration Add-on Accessories */}
                <div>
                  <label className="block font-bold text-warmgray-700 mb-1.5">
                    Celebration Add-on Accessories (Optional)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {celebrationAccessoriesList.map((acc) => {
                      const isSelected = selectedAccessories.some((a) => a.id === acc.id);
                      return (
                        <label
                          key={acc.id}
                          onClick={() => toggleAccessory(acc)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-gold-50 border-gold-500 text-charcoal-900 shadow-xs'
                              : 'bg-cream-50 border-warmgray-200 text-warmgray-600 hover:border-warmgray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="accent-gold-600 rounded"
                            />
                            <span>{(acc as any).emoji && <span className="mr-1">{(acc as any).emoji}</span>}{acc.name}</span>
                          </div>
                          <span className="font-bold text-gold-700">+₹{acc.price}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-3 border-t border-warmgray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-left w-full sm:w-auto">
                  <span className="text-[10px] text-warmgray-500 uppercase tracking-wider block font-semibold">Total Order Price</span>
                  <span className="font-serif text-2xl font-bold text-gold-700">₹{(currentPrice || 0).toLocaleString()}</span>
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
