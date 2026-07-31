'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Sparkles, CheckCircle2, Clock, Truck, ChefHat, Lock, AlertCircle, ArrowLeft, MessageCircle } from 'lucide-react';
import { buildGeneralInquiryWhatsAppUrl } from '@/lib/whatsapp';

export default function TrackOrderPage() {
  const [orderIdInput, setOrderIdInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<any>(null);

  const whatsappUrl = buildGeneralInquiryWhatsAppUrl();

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderIdInput.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to find order');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'No order found with this ID');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'New':
        return 1;
      case 'Confirmed':
        return 2;
      case 'Preparing':
      case 'In Baking':
        return 3;
      case 'Out for Delivery':
        return 4;
      case 'Completed':
      case 'Delivered':
        return 5;
      default:
        return 1;
    }
  };

  return (
    <main className="min-h-screen bg-cream-50 pt-28 sm:pt-32 pb-20 text-charcoal-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-gold-400 text-gold-700 shadow-sm">
            <Sparkles className="w-4 h-4 text-gold-600 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">Real-Time Order Tracking</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-900 tracking-tight font-bold">
            Track Your Custom Order
          </h1>

          <p className="text-xs sm:text-sm text-warmgray-600 max-w-lg mx-auto leading-relaxed">
            Enter your 6-digit Order ID (e.g. <span className="font-mono font-bold text-gold-700">LL-894201</span>) provided during WhatsApp order placement.
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleTrackOrder} className="bg-white p-4 sm:p-6 rounded-3xl border border-warmgray-300 shadow-luxury max-w-xl mx-auto space-y-3">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Enter Order ID (e.g. LL-894201 or 894201)"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="w-full pl-11 pr-32 py-3.5 sm:py-4 rounded-2xl border border-warmgray-300 text-xs sm:text-sm text-charcoal-900 font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
            />
            <Search className="w-5 h-5 text-warmgray-400 absolute left-4 pointer-events-none" />
            
            <button
              type="submit"
              disabled={loading || !orderIdInput.trim()}
              className="absolute right-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs uppercase tracking-wider font-bold transition-all disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="max-w-xl mx-auto p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 font-medium flex items-center space-x-3 shadow-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Closed Order Tracking Notice (When status is Delivered/Completed) */}
        {result && result.isClosed && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warmgray-300 shadow-luxury text-center space-y-4 max-w-2xl mx-auto animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 mx-auto flex items-center justify-center shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-warmgray-500">Order ID: #{result.orderId}</span>
              <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                Order Delivered & Successfully Closed! 🎉
              </h3>
              <p className="text-xs text-warmgray-600 leading-relaxed max-w-md mx-auto">
                {result.message}
              </p>
            </div>

            <div className="p-4 bg-cream-50 rounded-2xl border border-warmgray-200 text-xs font-semibold text-charcoal-900 inline-block">
              Guest: <span className="font-bold">{result.customerName}</span> • Item: <span className="font-bold text-gold-700">{result.cakeName}</span>
            </div>

            <div className="pt-2">
              <Link
                href="/catalog"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-white text-xs uppercase tracking-widest font-bold shadow-sm"
              >
                <span>Browse Cake Catalog</span>
              </Link>
            </div>
          </div>
        )}

        {/* Live Active Order Status Timeline */}
        {result && !result.isClosed && result.order && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warmgray-300 shadow-luxury space-y-8 animate-fade-in">
            
            {/* Order Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-warmgray-200 pb-5 gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-gold-700 font-mono font-bold">Order ID: #{result.order.orderId}</span>
                <h2 className="font-serif text-2xl font-bold text-charcoal-900">{result.order.cakeSnapshot?.cakeName}</h2>
                <p className="text-xs text-warmgray-500">
                  Guest: <span className="font-bold text-charcoal-900">{result.order.customerDetails?.customerName}</span> • Date: <span className="font-bold text-charcoal-900">{result.order.customerDetails?.deliveryDate}</span>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-100 text-gold-800 border border-gold-300">
                  Status: {result.order.status}
                </span>
              </div>
            </div>

            {/* Interactive Timeline Stepper */}
            <div className="py-4">
              <div className="relative flex items-center justify-between">
                
                {/* Connecting Bar */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-warmgray-200 z-0"></div>

                {/* Step 1: Order Received */}
                <div className="relative z-10 flex flex-col items-center space-y-2 bg-white px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-xs font-bold ${
                    getStatusStepIndex(result.order.status) >= 1
                      ? 'bg-gold-500 border-gold-500 text-white shadow-sm'
                      : 'bg-white border-warmgray-300 text-warmgray-400'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-900 text-center">Received</span>
                </div>

                {/* Step 2: Confirmed */}
                <div className="relative z-10 flex flex-col items-center space-y-2 bg-white px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-xs font-bold ${
                    getStatusStepIndex(result.order.status) >= 2
                      ? 'bg-gold-500 border-gold-500 text-white shadow-sm'
                      : 'bg-white border-warmgray-300 text-warmgray-400'
                  }`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-900 text-center">Confirmed</span>
                </div>

                {/* Step 3: In Baking */}
                <div className="relative z-10 flex flex-col items-center space-y-2 bg-white px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-xs font-bold ${
                    getStatusStepIndex(result.order.status) >= 3
                      ? 'bg-gold-500 border-gold-500 text-white shadow-sm'
                      : 'bg-white border-warmgray-300 text-warmgray-400'
                  }`}>
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-900 text-center">In Baking</span>
                </div>

                {/* Step 4: Out for Delivery */}
                <div className="relative z-10 flex flex-col items-center space-y-2 bg-white px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-xs font-bold ${
                    getStatusStepIndex(result.order.status) >= 4
                      ? 'bg-gold-500 border-gold-500 text-white shadow-sm'
                      : 'bg-white border-warmgray-300 text-warmgray-400'
                  }`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-900 text-center">Out for Delivery</span>
                </div>

              </div>
            </div>

            {/* Order Details & Reference Image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-warmgray-200">
              <div className="space-y-2 text-xs text-warmgray-600">
                <p><span className="font-bold text-charcoal-900">Flavor:</span> {result.order.selectedOptions?.flavor}</p>
                <p><span className="font-bold text-charcoal-900">Size/Weight:</span> {result.order.selectedOptions?.weight}</p>
                <p><span className="font-bold text-charcoal-900">Plaque Message:</span> "{result.order.selectedOptions?.cakeMessage || 'None'}"</p>
                <p><span className="font-bold text-charcoal-900">Delivery Address:</span> {result.order.customerDetails?.deliveryAddress}</p>
              </div>

              {result.order.selectedOptions?.referenceImageUrl && (
                <div className="flex items-center space-x-3 p-3 bg-cream-50 rounded-2xl border border-warmgray-200">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gold-400 flex-shrink-0">
                    <Image src={result.order.selectedOptions.referenceImageUrl} alt="Reference photo" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-charcoal-900">Reference Photo Attached</p>
                    <p className="text-[11px] text-gold-700 font-semibold">Custom Design Request</p>
                  </div>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Contact Button */}
            <div className="pt-2 flex justify-end">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider font-bold shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Head Baker on WhatsApp</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
