'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { buildGeneralInquiryWhatsAppUrl } from '@/lib/whatsapp';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappUrl = buildGeneralInquiryWhatsAppUrl();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Popup Bubble */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-3xl p-4 shadow-luxury border border-warmgray-200 animate-fade-in text-charcoal-900">
          <div className="flex justify-between items-start mb-2 pb-2 border-b border-warmgray-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                LL
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm leading-none">Lush Layers</h4>
                <span className="text-[10px] text-emerald-600 font-semibold">● Online for Cake Orders</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-warmgray-400 hover:text-charcoal-900 p-1"
              aria-label="Close message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-warmgray-600 mb-3 leading-relaxed">
            Hello! 👋 Looking for a custom celebration tier or quick catalog query? Connect directly on WhatsApp now.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-white"
        aria-label="Contact via WhatsApp"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
      </button>
    </div>
  );
}
