'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
  Upload,
  Heart,
  Sparkles,
} from 'lucide-react';
import { optimizeImageClientSide } from '@/lib/imageOptimizer';

interface AccessoryItem {
  id: string;
  name: string;
  emoji: string;
  price: number | string;
  active: boolean;
}

interface OurStoryData {
  badgeTagline?: string;
  title?: string;
  description?: string;
  bakerName?: string;
  image1?: string;
  image2?: string;
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
  ourStory: OurStoryData;
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
  ourStory: {
    badgeTagline: 'Made With Love & Passion',
    title: 'Artisanal Ingredients & 24K Gold Leafing',
    description: 'Freshly baked to order using authentic gourmet baking techniques, Valrhona single-origin chocolate, Madagascar bourbon vanilla pods, and organic berries.',
    bakerName: 'Tina Manna (Owner & Pastry Chef)',
    image1: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=85',
    image2: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=85',
  },
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  // New Accessory Form State
  const [showAddAccessory, setShowAddAccessory] = useState(false);
  const [newAccessory, setNewAccessory] = useState<{
    name: string;
    emoji: string;
    price: number | string;
    active: boolean;
  }>({
    name: '',
    emoji: '🎁',
    price: '',
    active: true,
  });

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
          ourStory: {
            badgeTagline: data.settings.ourStory?.badgeTagline || DEFAULT_SETTINGS.ourStory.badgeTagline,
            title: data.settings.ourStory?.title || DEFAULT_SETTINGS.ourStory.title,
            description: data.settings.ourStory?.description || DEFAULT_SETTINGS.ourStory.description,
            bakerName: data.settings.ourStory?.bakerName || DEFAULT_SETTINGS.ourStory.bakerName,
            image1: data.settings.ourStory?.image1 || DEFAULT_SETTINGS.ourStory.image1,
            image2: data.settings.ourStory?.image2 || DEFAULT_SETTINGS.ourStory.image2,
          },
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
      // Clean up accessory prices to numeric before sending to backend
      const sanitizedAccessories = settings.accessories.map((a) => ({
        ...a,
        price: a.price === '' || isNaN(Number(a.price)) ? 0 : Number(a.price),
      }));

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, accessories: sanitizedAccessories }),
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

  // Cloudinary Image Upload with Client WebP Compression for Story Images
  const handleStoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageKey: 'image1' | 'image2') => {
    if (!e.target.files || !e.target.files[0]) return;
    const rawFile = e.target.files[0];

    try {
      setUploadingImage(imageKey);
      const optRes = await optimizeImageClientSide(rawFile);
      const formData = new FormData();
      formData.append('file', optRes.file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success && data.images?.[0]) {
        const uploadedUrl = data.images[0].secure_url || data.images[0].url;
        setSettings((prev) => ({
          ...prev,
          ourStory: {
            ...prev.ourStory,
            [imageKey]: uploadedUrl,
          },
        }));
      }
    } catch (err) {
      alert('Story image upload failed');
    } finally {
      setUploadingImage(null);
    }
  };

  // Accessory Inline Editing Handlers
  const handleUpdateAccessoryName = (id: string, name: string) => {
    setSettings((prev) => ({
      ...prev,
      accessories: prev.accessories.map((a) => (a.id === id ? { ...a, name } : a)),
    }));
  };

  const handleUpdateAccessoryEmoji = (id: string, emoji: string) => {
    setSettings((prev) => ({
      ...prev,
      accessories: prev.accessories.map((a) => (a.id === id ? { ...a, emoji } : a)),
    }));
  };

  const handleUpdateAccessoryPrice = (id: string, valueStr: string) => {
    setSettings((prev) => ({
      ...prev,
      accessories: prev.accessories.map((a) =>
        a.id === id ? { ...a, price: valueStr === '' ? '' : Number(valueStr) } : a
      ),
    }));
  };

  const handleAddAccessory = () => {
    if (!newAccessory.name.trim()) return;
    const acc: AccessoryItem = {
      id: `acc-${Date.now().toString().slice(-6)}`,
      name: newAccessory.name.trim(),
      emoji: newAccessory.emoji || '🎁',
      price: newAccessory.price === '' ? 0 : Number(newAccessory.price),
      active: newAccessory.active,
    };
    setSettings((prev) => ({ ...prev, accessories: [...prev.accessories, acc] }));
    setNewAccessory({ name: '', emoji: '🎁', price: '', active: true });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-gold-600" />
        <span className="ml-3 text-warmgray-500 font-medium text-sm">Loading settings from MongoDB...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl text-charcoal-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-warmgray-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">Website Global Settings</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>MongoDB Persisted</span>
            </span>
          </div>
          <p className="text-xs text-warmgray-500 font-medium mt-1">
            Manage Website Brand Details, Our Story Section, Accessories & WhatsApp Order Settings.
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
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-2xl font-bold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All settings & Our Story section updated permanently in MongoDB Atlas!</span>
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-900 text-xs rounded-2xl font-bold">
          ❌ Failed to save. Check database connection.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs text-charcoal-900">

        {/* SECTION: HOMEPAGE "OUR STORY" SECTION MANAGER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-400 shadow-md space-y-5">
          <div className="flex items-center space-x-2 border-b border-warmgray-200 pb-3">
            <Heart className="w-5 h-5 text-gold-600 fill-current" />
            <div>
              <h2 className="font-serif text-xl font-bold text-charcoal-900">
                Homepage "Our Story" Section Manager
              </h2>
              <p className="text-[11px] text-warmgray-500">
                Customize the title, tagline, images, and description shown on the homepage "Our Story / Craftsmanship" section.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Badge / Tagline *</label>
                <input
                  type="text"
                  value={settings.ourStory.badgeTagline || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ourStory: { ...settings.ourStory, badgeTagline: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-warmgray-300 font-bold focus:border-gold-500 focus:outline-none"
                  placeholder="e.g. Made With Love & Passion"
                />
              </div>

              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Baker / Owner Name</label>
                <input
                  type="text"
                  value={settings.ourStory.bakerName || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ourStory: { ...settings.ourStory, bakerName: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-warmgray-300 font-bold focus:border-gold-500 focus:outline-none"
                  placeholder="e.g. Tina Manna (Master Baker & Owner)"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-warmgray-700 mb-1">Main Heading / Title *</label>
              <input
                type="text"
                value={settings.ourStory.title || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    ourStory: { ...settings.ourStory, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-warmgray-300 font-serif text-sm font-bold text-charcoal-900 focus:border-gold-500 focus:outline-none"
                placeholder="e.g. Artisanal Ingredients & 24K Gold Leafing"
              />
            </div>

            <div>
              <label className="block font-bold text-warmgray-700 mb-1">Full Story Description *</label>
              <textarea
                rows={4}
                value={settings.ourStory.description || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    ourStory: { ...settings.ourStory, description: e.target.value },
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-warmgray-300 font-medium text-charcoal-900 focus:border-gold-500 focus:outline-none leading-relaxed"
                placeholder="Write your baking story, ingredients used, and artisan philosophy..."
              />
            </div>

            {/* Upload Story Image 1 & Image 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-warmgray-100">
              {/* Image 1 */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-warmgray-200 space-y-2">
                <label className="block font-bold text-charcoal-900">Story Frame Image #1</label>
                <div className="flex items-center space-x-3">
                  {settings.ourStory.image1 && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-warmgray-300 flex-shrink-0 bg-white">
                      <Image src={settings.ourStory.image1} alt="Story 1" fill className="object-cover" />
                    </div>
                  )}
                  <label className="px-4 py-2 rounded-xl border border-gold-500 text-gold-700 font-bold bg-white hover:bg-gold-50 transition-all cursor-pointer inline-flex items-center space-x-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage === 'image1' ? 'Uploading...' : 'Upload Image 1'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleStoryImageUpload(e, 'image1')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Image 2 */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-warmgray-200 space-y-2">
                <label className="block font-bold text-charcoal-900">Story Frame Image #2</label>
                <div className="flex items-center space-x-3">
                  {settings.ourStory.image2 && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-warmgray-300 flex-shrink-0 bg-white">
                      <Image src={settings.ourStory.image2} alt="Story 2" fill className="object-cover" />
                    </div>
                  )}
                  <label className="px-4 py-2 rounded-xl border border-gold-500 text-gold-700 font-bold bg-white hover:bg-gold-50 transition-all cursor-pointer inline-flex items-center space-x-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage === 'image2' ? 'Uploading...' : 'Upload Image 2'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleStoryImageUpload(e, 'image2')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

          </div>
        </div>

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

        {/* Section 4: Celebration Add-on Accessories Manager (FULLY EDITABLE & BLANK PRICE FRIENDLY) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warmgray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-warmgray-100 pb-2">
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900">
                4. Celebration Add-on Accessories (Order Form)
              </h3>
              <p className="text-[10px] text-warmgray-500 mt-0.5">
                Edit accessory name, emoji icon, or price directly inline. Prices auto-add to customer cake orders.
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

          <div className="space-y-3">
            {settings.accessories.map((acc) => (
              <div
                key={acc.id}
                className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
                  acc.active
                    ? 'bg-cream-50 border-warmgray-200'
                    : 'bg-warmgray-50 border-warmgray-100 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-2 flex-grow">
                  {/* Editable Emoji */}
                  <input
                    type="text"
                    value={acc.emoji || ''}
                    onChange={(e) => handleUpdateAccessoryEmoji(acc.id, e.target.value)}
                    className="w-10 text-center text-lg py-1 rounded-xl border border-warmgray-300 focus:border-gold-500 focus:outline-none bg-white font-bold"
                    maxLength={2}
                    title="Edit Emoji"
                  />
                  {/* Editable Name */}
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={acc.name || ''}
                      onChange={(e) => handleUpdateAccessoryName(acc.id, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-warmgray-300 font-bold text-charcoal-900 focus:border-gold-500 focus:outline-none bg-white text-xs"
                      placeholder="Accessory Name (e.g. Birthday Candles Pack)"
                    />
                    <span className="text-[10px] text-warmgray-400 pl-1 mt-0.5 block">
                      {acc.active ? '✓ Visible to customers' : 'Hidden from customers'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  {/* Blank-friendly Price Input */}
                  <div className="flex items-center space-x-1 bg-white px-2.5 py-1 rounded-xl border border-warmgray-300 focus-within:border-gold-500">
                    <span className="font-bold text-gold-700">₹</span>
                    <input
                      type="number"
                      value={acc.price === '' || acc.price === undefined || acc.price === null ? '' : acc.price}
                      onChange={(e) => handleUpdateAccessoryPrice(acc.id, e.target.value)}
                      onBlur={() => {
                        if (acc.price === '' || isNaN(Number(acc.price))) {
                          handleUpdateAccessoryPrice(acc.id, '0');
                        }
                      }}
                      placeholder="0"
                      className="w-16 font-bold text-gold-800 focus:outline-none text-center text-xs"
                    />
                  </div>

                  {/* Toggle Active / Hidden */}
                  <button
                    type="button"
                    onClick={() => handleToggleAccessoryActive(acc.id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
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
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete accessory"
                  >
                    <Trash2 className="w-4 h-4" />
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
                  <label className="block font-bold text-warmgray-700 mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    value={newAccessory.emoji}
                    onChange={(e) => setNewAccessory({ ...newAccessory, emoji: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-warmgray-300 text-center text-xl focus:outline-none bg-white font-bold"
                    maxLength={2}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-warmgray-700 mb-1">Accessory Name</label>
                  <input
                    type="text"
                    value={newAccessory.name}
                    onChange={(e) => setNewAccessory({ ...newAccessory, name: e.target.value })}
                    placeholder="e.g. Premium Gift Box Packaging"
                    className="w-full px-3 py-2 rounded-xl border border-warmgray-300 font-medium focus:border-gold-500 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-warmgray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newAccessory.price === '' ? '' : newAccessory.price}
                    onChange={(e) => setNewAccessory({ ...newAccessory, price: e.target.value === '' ? '' : Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-warmgray-300 font-bold text-gold-800 focus:outline-none bg-white"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddAccessory}
                className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-xs"
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
