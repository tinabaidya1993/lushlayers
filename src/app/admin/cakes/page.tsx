'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Eye,
  Star,
  Sparkles,
  CheckCircle2,
  X,
  Upload,
  RefreshCw
} from 'lucide-react';
import { CAKES_DATA, CATEGORIES } from '@/data/cakes';
import { CakeItem } from '@/types';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinaryClient';

import { useScrollLock } from '@/hooks/useScrollLock';

const POUND_OPTIONS = [
  { lb: 0.5, label: '0.5 Pound (Half Pound)', multiplier: 1 },
  { lb: 1.0, label: '1 Pound (1 lb)', multiplier: 2 },
  { lb: 1.5, label: '1.5 Pound (1.5 lb)', multiplier: 3 },
  { lb: 2.0, label: '2 Pound (2 lb)', multiplier: 4 },
  { lb: 2.5, label: '2.5 Pound (2.5 lb)', multiplier: 5 },
  { lb: 3.0, label: '3 Pound (3 lb)', multiplier: 6 },
  { lb: 3.5, label: '3.5 Pound (3.5 lb)', multiplier: 7 },
  { lb: 4.0, label: '4 Pound (4 lb)', multiplier: 8 },
  { lb: 5.0, label: '5 Pound (5 lb)', multiplier: 10 },
];

export default function AdminCakesPage() {
  const [cakes, setCakes] = useState<CakeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingCake, setEditingCake] = useState<Partial<CakeItem> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Global Scroll Lock when editing cake modal is open
  useScrollLock(Boolean(editingCake));

  // Weight & Base Price Calculation States
  const [baseHalfPoundPrice, setBaseHalfPoundPrice] = useState<number>(350);
  const [selectedWeightLbs, setSelectedWeightLbs] = useState<number[]>([0.5, 1.0, 1.5, 2.0, 2.5, 3.0]);

  // Fetch Live Cakes from MongoDB Atlas API
  useEffect(() => {
    fetchLiveCakes();
  }, []);

  const fetchLiveCakes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cakes');
      const data = await res.json();
      if (data.success && data.cakes) {
        setCakes(data.cakes);
      } else {
        setCakes(CAKES_DATA);
      }
    } catch (err) {
      console.warn('MongoDB Atlas fetch fallback:', err);
      setCakes(CAKES_DATA);
    } finally {
      setLoading(false);
    }
  };

  const updateWeightOptionsAndPrice = (baseP: number, lbs: number[]) => {
    const sortedLbs = [...lbs].sort((a, b) => a - b);
    const weightOpts = POUND_OPTIONS.filter((p) => sortedLbs.includes(p.lb)).map((p) => ({
      weightKg: p.lb * 0.453592,
      label: p.label,
      price: Math.round(baseP * p.multiplier),
    }));

    const minPrice = baseP;
    const minLb = sortedLbs[0] || 0.5;
    const servingsText = `${minLb} Pound onwards (₹${minPrice} starting price)`;

    setEditingCake((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        priceStartingFrom: minPrice,
        servings: servingsText,
        weightOptions: weightOpts,
      };
    });
  };

  const handleCreateNew = () => {
    const defaultHalfPoundPrice = 350;
    const defaultPounds = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
    const defaultWeightOpts = POUND_OPTIONS.filter((p) => defaultPounds.includes(p.lb)).map((p) => ({
      weightKg: p.lb * 0.453592,
      label: p.label,
      price: Math.round(defaultHalfPoundPrice * p.multiplier),
    }));

    setBaseHalfPoundPrice(defaultHalfPoundPrice);
    setSelectedWeightLbs(defaultPounds);

    setEditingCake({
      id: `cake-${Date.now()}`,
      name: '',
      category: 'signature',
      priceStartingFrom: defaultHalfPoundPrice,
      description: '',
      shortDescription: '',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
      additionalImages: [],
      servings: '0.5 Pound onwards (₹350 starting price)',
      flavors: ['Signature Vanilla Bean', 'Belgian Chocolate', 'Butterscotch Crunch'],
      eggless: true,
      bestseller: false,
      newArrival: true,
      featured: false,
      weightOptions: defaultWeightOpts,
      tags: ['Custom'],
      customizable: true,
      prepTimeHours: 24,
      availabilityStatus: '24 Hours Advance',
    });
  };

  const handleOpenEdit = (cake: CakeItem) => {
    const baseP = cake.priceStartingFrom || 350;
    const existingLbs = cake.weightOptions && cake.weightOptions.length > 0
      ? cake.weightOptions.map((opt) => {
          if (opt.label.includes('0.5')) return 0.5;
          if (opt.label.includes('1.5')) return 1.5;
          if (opt.label.includes('1')) return 1.0;
          if (opt.label.includes('2.5')) return 2.5;
          if (opt.label.includes('2')) return 2.0;
          if (opt.label.includes('3.5')) return 3.5;
          if (opt.label.includes('3')) return 3.0;
          if (opt.label.includes('4')) return 4.0;
          if (opt.label.includes('5')) return 5.0;
          return 0.5;
        })
      : [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];

    const uniqueLbs = Array.from(new Set(existingLbs));
    setBaseHalfPoundPrice(baseP);
    setSelectedWeightLbs(uniqueLbs);
    setEditingCake({ ...cake });
  };

  const filteredCakes = cakes.filter((cake) => {
    const matchesSearch = cake.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || cake.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCake || !editingCake.name) return;

    try {
      setSaveStatus('Saving to MongoDB Atlas & Cloudinary...');
      
      const res = await fetch('/api/cakes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCake),
      });

      const data = await res.json();

      if (data.success && data.cake) {
        setCakes((prev) => {
          const exists = prev.find((c) => c.id === data.cake.id);
          if (exists) {
            return prev.map((c) => (c.id === data.cake.id ? data.cake : c));
          }
          return [data.cake, ...prev];
        });
        setEditingCake(null);
        setSaveStatus('Saved successfully!');
      } else {
        throw new Error(data.error || 'Failed to save');
      }
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cake from MongoDB Atlas?')) return;

    try {
      await fetch(`/api/cakes?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      setCakes((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert('Failed to delete cake');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const files = Array.from(e.target.files);

    try {
      setUploadingImage(true);
      const formData = new FormData();
      files.forEach((file) => formData.append('file', file));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success && data.images) {
        const newUrls = data.images.map((img: any) => img.secure_url || img.url);

        setEditingCake((prev) => {
          if (!prev) return prev;
          const currentFeatured = prev.image || newUrls[0];
          const currentAdditional = prev.additionalImages || [];
          return {
            ...prev,
            image: currentFeatured,
            additionalImages: [...currentAdditional, ...newUrls],
          };
        });
      }
    } catch (err) {
      alert('Cloudinary upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const setAsFeaturedCover = (url: string) => {
    setEditingCake((prev) => {
      if (!prev) return prev;
      return { ...prev, image: url };
    });
  };

  const removeImage = (urlToRemove: string) => {
    setEditingCake((prev) => {
      if (!prev) return prev;
      const filtered = (prev.additionalImages || []).filter((u) => u !== urlToRemove);
      return { ...prev, additionalImages: filtered };
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-3xl font-bold text-charcoal-900">Lush Layers Cake Inventory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>MongoDB Atlas Live</span>
            </span>
          </div>
          <p className="text-xs text-warmgray-500 font-medium">
            Live database sync with MongoDB Atlas & Cloudinary CDN for Lush Layers by Owner Tina Manna.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchLiveCakes}
            className="p-2.5 rounded-full border border-warmgray-300 hover:border-gold-500 text-charcoal-900 transition-colors"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleCreateNew}
            className="px-5 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center space-x-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Cake</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-2xl font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3.5 rounded-2xl border border-warmgray-200 shadow-sm">
        <div className="flex-1 flex items-center space-x-2 bg-cream-50 px-3 py-2 rounded-xl border border-warmgray-200">
          <Search className="w-4 h-4 text-warmgray-400" />
          <input
            type="text"
            placeholder="Search cake name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-charcoal-900 focus:outline-none font-medium"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-cream-50 rounded-xl border border-warmgray-200 text-xs font-bold text-charcoal-900 focus:outline-none"
        >
          <option value="all">All Categories ({cakes.length})</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Edit/Create Cake Modal */}
      {editingCake && (
        <div className="fixed inset-0 z-[1000] bg-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-warmgray-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto text-xs text-charcoal-900 scroll-lock-overlay">
            
            <div className="flex justify-between items-center border-b border-warmgray-200 pb-3">
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                {editingCake.name ? `Edit: ${editingCake.name}` : 'Create New Cake (Tina Manna Kitchen)'}
              </h3>
              <button onClick={() => setEditingCake(null)} className="p-1 text-warmgray-400 hover:text-charcoal-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Cloudinary Image Upload Section */}
              <div className="space-y-2">
                <label className="block font-bold uppercase tracking-wider text-warmgray-600">
                  Cloudinary Image Gallery & Featured Cover
                </label>
                
                <div className="flex items-center space-x-3">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-cream-100 border-2 border-gold-500 flex-shrink-0">
                    <Image
                      src={editingCake.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'}
                      alt="Featured"
                      fill
                      className="object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-gold-500 text-white text-[8px] font-bold text-center uppercase py-0.5">
                      Featured
                    </span>
                  </div>

                  <div className="flex-1">
                    <label className="px-4 py-2.5 rounded-xl border border-gold-500 text-gold-700 font-bold bg-gold-50/50 hover:bg-gold-500 hover:text-white transition-all cursor-pointer inline-flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingImage ? 'Uploading to Cloudinary...' : 'Upload Images (Cloudinary CDN)'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-warmgray-500 mt-1">Direct upload to Cloudinary.</p>
                  </div>
                </div>

                {/* Additional Thumbnails */}
                {editingCake.additionalImages && editingCake.additionalImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {editingCake.additionalImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-warmgray-200 group">
                        <Image src={imgUrl} alt="Thumbnail" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setAsFeaturedCover(imgUrl)}
                          className="absolute inset-0 bg-charcoal-900/60 text-white text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-center"
                        >
                          Make Cover
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(imgUrl)}
                          className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1">Cake Name</label>
                  <input
                    type="text"
                    required
                    value={editingCake.name || ''}
                    onChange={(e) => setEditingCake({ ...editingCake, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-warmgray-300 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1">Category</label>
                  <select
                    value={editingCake.category || 'signature'}
                    onChange={(e) => setEditingCake({ ...editingCake, category: e.target.value as CakeItem['category'] })}
                    className="w-full px-3.5 py-2 rounded-xl border border-warmgray-300 focus:outline-none focus:border-gold-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 0.5 POUND BASE PRICE & WEIGHT TICKBOX CALCULATOR */}
              <div className="bg-cream-50 p-4 rounded-2xl border border-warmgray-300 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-charcoal-900 text-xs">
                      0.5 Pound (Half Pound) Base Price (₹)
                    </label>
                    <p className="text-[10px] text-warmgray-600">
                      Enter base price for 0.5 lb (e.g. ₹350). All other selected weights calculate automatically!
                    </p>
                  </div>
                  <input
                    type="number"
                    required
                    min={50}
                    value={baseHalfPoundPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setBaseHalfPoundPrice(val);
                      updateWeightOptionsAndPrice(val, selectedWeightLbs);
                    }}
                    className="w-32 px-3 py-2 rounded-xl border-2 border-gold-500 font-mono font-bold text-sm bg-white text-charcoal-900 focus:outline-none"
                  />
                </div>

                {/* Weight Selection Tick Boxes */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-warmgray-700 text-[11px] mb-1.5">
                    Available Cake Weights (Tick all options you offer for this cake):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {POUND_OPTIONS.map((p) => {
                      const isChecked = selectedWeightLbs.includes(p.lb);
                      const calculatedPrice = Math.round(baseHalfPoundPrice * p.multiplier);
                      return (
                        <label
                          key={p.lb}
                          className={`flex items-center space-x-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-gold-50 border-gold-500 text-charcoal-900 font-bold shadow-xs'
                              : 'bg-white border-warmgray-200 text-warmgray-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              let updatedLbs: number[];
                              if (e.target.checked) {
                                updatedLbs = [...selectedWeightLbs, p.lb];
                              } else {
                                updatedLbs = selectedWeightLbs.filter((item) => item !== p.lb);
                              }
                              if (updatedLbs.length === 0) updatedLbs = [0.5];
                              setSelectedWeightLbs(updatedLbs);
                              updateWeightOptionsAndPrice(baseHalfPoundPrice, updatedLbs);
                            }}
                            className="rounded text-gold-600 focus:ring-gold-500"
                          />
                          <div className="flex flex-col">
                            <span>{p.label}</span>
                            <span className="text-[10px] text-gold-700 font-mono">₹{calculatedPrice}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* HOMEPAGE DISPLAY SECTION ASSIGNMENT TICKBOXES */}
              <div className="bg-cream-50 p-4 rounded-2xl border border-warmgray-300 space-y-2">
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 text-xs">
                  Homepage Section Assignment (Tick boxes to display on website sections)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  
                  <label className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer font-bold ${
                    editingCake.featured ? 'bg-gold-50 border-gold-500 text-gold-900' : 'bg-white border-warmgray-200 text-warmgray-700'
                  }`}>
                    <input
                      type="checkbox"
                      checked={!!editingCake.featured}
                      onChange={(e) => setEditingCake({ ...editingCake, featured: e.target.checked })}
                      className="rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span>Featured Signature Cakes</span>
                  </label>

                  <label className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer font-bold ${
                    editingCake.bestseller ? 'bg-amber-50 border-amber-500 text-amber-900' : 'bg-white border-warmgray-200 text-warmgray-700'
                  }`}>
                    <input
                      type="checkbox"
                      checked={!!editingCake.bestseller}
                      onChange={(e) => setEditingCake({ ...editingCake, bestseller: e.target.checked })}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Most Loved Bestsellers</span>
                  </label>

                  <label className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer font-bold ${
                    editingCake.newArrival ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-white border-warmgray-200 text-warmgray-700'
                  }`}>
                    <input
                      type="checkbox"
                      checked={!!editingCake.newArrival}
                      onChange={(e) => setEditingCake({ ...editingCake, newArrival: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Newest Arrivals</span>
                  </label>

                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCake.description || ''}
                  onChange={(e) => setEditingCake({ ...editingCake, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-warmgray-300 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-warmgray-200">
                <button
                  type="button"
                  onClick={() => setEditingCake(null)}
                  className="px-5 py-2.5 rounded-full border border-warmgray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold uppercase tracking-wider shadow-md"
                >
                  Save Cake to MongoDB Atlas
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Cake Inventory Table & Mobile Cards */}
      <div className="bg-white rounded-3xl border border-warmgray-200 shadow-sm overflow-hidden">
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100 border-b border-warmgray-200 uppercase tracking-wider text-warmgray-600 font-bold">
              <tr>
                <th className="p-4">Cake</th>
                <th className="p-4">Category</th>
                <th className="p-4">Base Price (0.5 lb)</th>
                <th className="p-4">Homepage Sections</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-200">
              {filteredCakes.map((cake) => (
                <tr key={cake.id} className="hover:bg-cream-50 transition-colors">
                  <td className="p-4 flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0 border border-warmgray-200">
                      <Image src={cake.image} alt={cake.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-charcoal-900 text-sm">{cake.name}</p>
                      <p className="text-[10px] text-warmgray-500">{cake.servings}</p>
                    </div>
                  </td>
                  <td className="p-4 font-semibold capitalize text-charcoal-800">{cake.category}</td>
                  <td className="p-4 font-mono font-bold text-gold-700">₹{(cake.priceStartingFrom || 0).toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 text-[9px] font-bold">
                      {cake.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-gold-100 text-gold-800 border border-gold-300">
                          ✨ Featured
                        </span>
                      )}
                      {cake.bestseller && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          🔥 Bestseller
                        </span>
                      )}
                      {cake.newArrival && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          🌟 New Arrival
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(cake)}
                      className="p-2 text-warmgray-600 hover:text-gold-600 rounded-lg"
                      title="Edit Cake"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cake.id)}
                      className="p-2 text-warmgray-400 hover:text-red-600 rounded-lg"
                      title="Delete Cake"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Touch Cards View */}
        <div className="block md:hidden divide-y divide-warmgray-200">
          {filteredCakes.map((cake) => (
            <div key={cake.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0 border border-warmgray-200">
                  <Image src={cake.image} alt={cake.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-charcoal-900">{cake.name}</h4>
                  <span className="font-mono font-bold text-gold-700 text-xs">₹{(cake.priceStartingFrom || 0).toLocaleString()} (0.5 lb)</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(cake)}
                  className="p-2 rounded-xl bg-gold-50 border border-gold-400 text-gold-700"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cake.id)}
                  className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
