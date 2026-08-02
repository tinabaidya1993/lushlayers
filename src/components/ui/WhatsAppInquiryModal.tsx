'use client';

import React, { useState } from 'react';
import { X, MessageCircle, Send, Sparkles, User, Phone, MessageSquare } from 'lucide-react';
import { useScrollLock } from '@/hooks/useScrollLock';

interface WhatsAppInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMessage?: string;
  cakeName?: string;
}

export default function WhatsAppInquiryModal({
  isOpen,
  onClose,
  defaultMessage = '',
  cakeName = '',
}: WhatsAppInquiryModalProps) {
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [message, setMessage] = useState<string>(defaultMessage || 'Hello! I would like to inquire about fresh home-baked cakes from Lush Layers by Tina Baidya.');

  // Lock scrolling when modal is active
  useScrollLock(isOpen);

  if (!isOpen) return null;

  // Validation: Button enabled ONLY when Name, Phone (10 digits) and Message are filled
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const isValid = customerName.trim().length >= 2 && cleanPhone.length === 10 && message.trim().length >= 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    // Construct structured WhatsApp message
    let text = `*Lush Layers Luxury Cake Inquiry*\n\n`;
    text += `👤 *Name:* ${customerName.trim()}\n`;
    text += `📱 *Mobile:* +91 ${cleanPhone}\n`;
    if (cakeName) {
      text += `🎂 *Cake Interest:* ${cakeName}\n`;
    }
    text += `💬 *Inquiry Message:* ${message.trim()}\n\n`;
    text += `_Sent via Lush Layers Official Website_`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/918768388868?text=${encodedText}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Reset and Close Modal
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-charcoal-900/70 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-warmgray-200 overflow-hidden transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
              <MessageCircle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 text-emerald-200 text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                <span>Direct WhatsApp Consultation</span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                Contact Tina Baidya
              </h3>
            </div>
          </div>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <p className="text-xs text-warmgray-600 leading-relaxed">
            Please fill in your details below. Once completed, the WhatsApp button will activate to send your inquiry directly.
          </p>

          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Your Name <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs font-medium text-charcoal-900 outline-none transition-all"
            />
          </div>

          {/* Mobile Number Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mobile / WhatsApp Number <span className="text-rose-500">*</span></span>
            </label>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-2.5 rounded-xl bg-cream-100 border border-warmgray-300 text-xs font-bold text-charcoal-800">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs font-medium text-charcoal-900 outline-none transition-all"
              />
            </div>
            {phoneNumber && cleanPhone.length !== 10 && (
              <p className="text-[10px] text-rose-500 font-semibold">Please enter valid 10-digit mobile number</p>
            )}
          </div>

          {/* Message Box */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Inquiry Details / Message <span className="text-rose-500">*</span></span>
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your custom cake requirements, date, flavor preferences, or questions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs font-medium text-charcoal-900 outline-none transition-all resize-none"
            />
          </div>

          {/* WhatsApp Submit Action Button (Disabled until filled out) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-3.5 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md ${
                isValid
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 cursor-pointer shadow-emerald-600/30'
                  : 'bg-warmgray-200 text-warmgray-400 cursor-not-allowed border border-warmgray-300'
              }`}
            >
              <Send className={`w-4 h-4 ${isValid ? 'animate-bounce' : ''}`} />
              <span>Send Message to WhatsApp</span>
            </button>
            {!isValid && (
              <p className="text-[10px] text-center text-warmgray-500 mt-1 font-medium">
                Fill in Name, 10-digit Phone & Message to enable WhatsApp button
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
