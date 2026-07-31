'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Phone, Mail, MapPin, Clock, Globe } from 'lucide-react';
import { BOUTIQUE_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Lush Layers (Made With Love)',
    whatsappNumber: BOUTIQUE_WHATSAPP_NUMBER,
    supportEmail: 'concierge@lushlayers.com',
    boutiqueAddress: 'PB Road, Behala, Kolkata-41',
    openingHours: 'Tuesday - Sunday: 10:00 AM - 08:00 PM',
    instagram: '@lushlayers.cakes',
    facebook: 'facebook.com/lushlayers.cakes',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">Website Global Settings</h1>
          <p className="text-xs text-warmgray-500 font-medium">Configure boutique contact numbers, hours, address, and brand identity.</p>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-2xl font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Website configurations saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-warmgray-200 shadow-sm space-y-6 text-xs text-charcoal-900">
        
        {/* Brand & WhatsApp */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-warmgray-100 pb-2">
            1. Brand Identity & Primary WhatsApp Number
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1.5">Website Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1.5">Primary WhatsApp Order Number</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:border-gold-500 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 pt-2">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-warmgray-100 pb-2">
            2. Contact & Atelier Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1.5">Concierge Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1.5">Opening Hours</label>
              <input
                type="text"
                value={settings.openingHours}
                onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1.5">Boutique Address</label>
            <input
              type="text"
              value={settings.boutiqueAddress}
              onChange={(e) => setSettings({ ...settings, boutiqueAddress: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {/* Save Action */}
        <div className="pt-4 border-t border-warmgray-200 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center space-x-2 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}
