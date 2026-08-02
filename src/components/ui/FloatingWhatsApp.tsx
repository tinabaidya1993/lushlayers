'use client';

import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import WhatsAppInquiryModal from '@/components/ui/WhatsAppInquiryModal';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Direct WhatsApp Consultation"
        className="fixed bottom-16 right-4 sm:bottom-20 sm:right-6 z-[92] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-luxury transition-all duration-300 hover:scale-110 active:scale-95 group cursor-pointer"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30 pointer-events-none"></span>
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-current animate-bounce group-hover:rotate-12 transition-transform" />
      </button>

      <WhatsAppInquiryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
