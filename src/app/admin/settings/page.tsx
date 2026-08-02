'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  X,
} from 'lucide-react';

interface AccessoryItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  active: boolean;
}

interface SiteSettingsData {
  siteName: string;
  whatsappNumber: string;
  supportEmail: string;
  boutiqueAddress: string;
  openingHours: string;
  instagram: string;
  facebook: string;
  accessories: AccessoryItem[];
}

const DEFAULT_SETTINGS: SiteSettingsData = {
  siteName: 'Lush Layers (Made With Love)',
  whatsappNumber: '918768388868',
  supportEmail: 'concierge@lushlayers.com',
  boutiqueAddress: 'PB Road, Behala, Kolkata-41',
  openingHours: 'Tuesday - Sunday: 10:00 AM - 08:00 PM',
  instagram: '@lushlayers.cakes',
  facebook: 'facebook.com/lushlayers.cakes',
  accessories: [
    { id: 'candles', name: 'Birthday Candles Pack', emoji: '🎂', price: 50, active: true },
    { id: 'knife', name: 'Premium Cake Knife / Server', emoji: '🔪', price: 40, active: true },
    { id: 'balloons', name: 'Party Balloons (Pack of 5)', emoji: '🎈', price: 100, active: true },
    { id: 'sparklers', name: 'Golden Party Sparklers (Pack of 2)', emoji: '💖', price: 80, active: true },
    { id: 'crown', name: 'Birthday Crown / Sash', emoji: '👑', price: 120, active: true },
  ],
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  // New Accessory Form State
  const [showAddAccessory, setShowAddAccessory] = useState(false);
  const [newAccessory, setNewAccessory] = useState<Omit<AccessoryItem, 'id'>>({
    name: '',
    emoji: '🎁',
    price: 50,
    active: true,
  });
  const [editingAccessoryId, setEditingAccessoryId] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings({
          siteName: data.settings.siteName || DEFAULT_SETTINGS.siteName,
          whatsappNumber: data.settings.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
          supportEmail: data.settings.supportEmail || DEFAULT_SETTINGS.supportEmail,
          boutiqueAddress: data.settings.boutiqueAddress || DEFAULT_SETTINGS.boutiqueAddress,
          openingHours: data.settings.openingHours || DEFAULT_SETTINGS.openingHours,
          instagram: data.settings.instagram || DEFAULT_SETTINGS.instagram,
          facebook: data.settings.facebook || DEFAULT_SETTINGS.facebook,
          accessories:
            data.settings.accessories && data.settings.accessories.length > 0
              ? data.settings.accessories
              : DEFAULT_SETTINGS.accessories,
        });
      }
    } catch (err) {
      console.warn('Settings fetch failed, using defaults');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus('success');
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleAddAccessory = () => {
    if (!newAccessory.name.trim()) return;
    const acc: AccessoryItem = {
      id: `acc-${Date.now().toString().slice(-6)}`,
      ...newAccessory,
    };
    setSettings((prev) => ({ ...prev, accessories: [...prev.accessories, acc] }));
    setNewAccessory({ name: '', emoji: '🎁', price: 50, active: true });
    setShowAddAccessory(false);
  };

  const handleDeleteAccessory = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      accessories: prev.accessories.filter((a) => a.id !== id),
    }));
  };

  const handleToggleAccessoryActive = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      accessories: prev.accessories.map((a) =>
        a.id === id ? { ...a, active: !a.active } : a
      ),
    }));
  };

  const handleUpdateAccessoryPrice = (id: string, price: number) => {
    setSettings((prev) => ({
      ...prev,
      accessories: prev.accessories.map((a) => (a.id === id ? { ...a, price } : a)),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-gold-600" />
        <span className="ml-3 text-warmgray-500 font-medium text-sm">Loading settings from MongoDB...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-warmgray-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-3xl font-bold text-charcoal-900">Website Global Settings</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>MongoDB Persisted</span>
            </span>
          </div>
          <p className="text-xs text-warmgray-500 font-medium mt-1">
            All settings are saved permanently to MongoDB Atlas. Changes take effect immediately.
          </p>
        </div>
        <button
          onClick={fetchSettings}
          className="p-2.5 rounded-full border border-warmgray-300 hover:border-gold-500 text-charcoal-900 transition-colors"
          title="Refresh from database"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {saveStatus === 'success' && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-2xl font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All settings saved successfully to MongoDB Atlas!</span>
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-900 text-xs rounded-2xl font-bold">
          ❌ Failed to save. Check database connection.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs text-charcoal-900">

        {/* Section 1: Brand & WhatsApp */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warmgray-200 shadow-sm space-y-5">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-warmgray-100 pb-2">
            1. Brand Identity & Primary WhatsApp Number
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-warmgray-700 mb-1">Boutique Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-warmgray-300 font-medium focus:border-gold-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-warmgray-700 mb-1 flex items-center">
                <Phone className="w-3 h-3 mr-1 text-emerald-600" /> WhatsApp Number (International)
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-warmgray-300 font-medium focus:border-gold-500 focus:outline-none font-mono"
                placeholder="918768388868"
              />
              <p className="text-[10px] text-warmgray-400 mt-1">Country code + number, no spaces (e.g. 918768388868)</p>
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Studio */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warmgray-200 shadow-sm space-y-5">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-warmgray-100 pb-2">
            2. Studio Contact & Location
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-warmgray-700 mb-1 flex items-center">
                <Mail className="w-3 h-3 mr-1 text-gold-600" /> Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-warmgray-300 font-medium focus:border-gold-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-warmgray-700 mb-1 flex items-center">
                <Clock className="w-3 h-3 mr-1 text-gold-600" /> Opening Hours
              </label>
              <input
                type="text"
                value={settings.openingHours}
                onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-warmgray-300 font-medium focus:border-gold-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-warmgray-700 mb-1 flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-gold-600" /> Studio Address
              </label>
              <input
                type="text"
                value={settings.boutiqueAddress}
                onChange={(e) => setSettings({ ...settings, boutiqueAddress: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-warmgray-300 font-medium focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Social Media */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warmgray-200 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-warmgray-100 pb-2">
            3. Social Media Handles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-warmgray-700 mb-1 flex items-center">
                <Globe className="w-3 h-3 mr-1 text-gold-600" /> Instagram Handle
              </label>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-warmgray-300 font-medium focus:border-gold-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-warmgray-700 mb-1">Facebook Page</label>
              <input
                type="text"
                value={settings.facebook}
                onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-warmgray-300 font-medium focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Celebration Add-on Accessories Manager */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warmgray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-warmgray-100 pb-2">
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900">
                4. Celebration Add-on Accessories (Order Form)
              </h3>
              <p className="text-[10px] text-warmgray-500 mt-0.5">
                These appear as checkboxes in the Order Form. Prices auto-add to the cake total.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddAccessory(true)}
              className="px-4 py-2 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {settings.accessories.map((acc) => (
              <div
                key={acc.id}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  acc.active
                    ? 'bg-cream-50 border-warmgray-200'
                    : 'bg-warmgray-50 border-warmgray-100 opacity-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{acc.emoji}</span>
                  <div>
                    <span className="font-bold text-charcoal-900 block">{acc.name}</span>
                    <span className="text-[10px] text-warmgray-500">{acc.active ? 'Visible to customers' : 'Hidden'}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Inline Price Editor */}
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-gold-700">₹</span>
                    <input
                      type="number"
                      value={acc.price}
                      min={0}
                      onChange={(e) => handleUpdateAccessoryPrice(acc.id, Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg border border-warmgray-300 font-bold text-gold-800 focus:border-gold-500 focus:outline-none text-center"
                    />
                  </div>

                  {/* Toggle Active */}
                  <button
                    type="button"
                    onClick={() => handleToggleAccessoryActive(acc.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      acc.active
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-warmgray-200 text-warmgray-600 hover:bg-warmgray-300'
                    }`}
                  >
                    {acc.active ? 'Active' : 'Hidden'}
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDeleteAccessory(acc.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete accessory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Accessory Form */}
          {showAddAccessory && (
            <div className="p-4 rounded-2xl border border-gold-300 bg-gold-50/40 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-gold-900">
                <span>Add New Accessory</span>
                <button type="button" onClick={() => setShowAddAccessory(false)}>
                  <X className="w-4 h-4 text-warmgray-500" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="col-span-1">
                  <label className="block font-bold text-warmgray-700 mb-1">Emoji</label>
                  <input
                    type="text"
                    value={newAccessory.emoji}
                    onChange={(e) => setNewAccessory({ ...newAccessory, emoji: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-warmgray-300 text-center text-xl focus:outline-none"
                    maxLength={2}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-warmgray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newAccessory.name}
                    onChange={(e) => setNewAccessory({ ...newAccessory, name: e.target.value })}
                    placeholder="e.g. Gift Box Packaging"
                    className="w-full px-3 py-2 rounded-xl border border-warmgray-300 font-medium focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-warmgray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newAccessory.price}
                    min={0}
                    onChange={(e) => setNewAccessory({ ...newAccessory, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-warmgray-300 font-bold text-gold-800 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddAccessory}
                className="w-full py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider"
              >
                Add Accessory
              </button>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-widest shadow-md flex items-center space-x-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving to MongoDB...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
