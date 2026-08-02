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
  RefreshCw,
  Layers,
  Layout,
  CheckSquare
} from 'lucide-react';
import { CAKES_DATA, CATEGORIES } from '@/data/cakes';
import { DEFAULT_HERO_SLIDES, HeroSlideData } from '@/data/heroSlides';
import { CakeItem, CategoryInfo } from '@/types';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinaryClient';

import { useScrollLock } from '@/hooks/useScrollLock';
import { optimizeMultipleImagesClientSide, optimizeImageClientSide } from '@/lib/imageOptimizer';

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
  const [activeTab, setActiveTab] = useState<'catalog' | 'hero'>('catalog');

  // Catalog Cakes State
  const [cakes, setCakes] = useState<CakeItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingCake, setEditingCake] = useState<Partial<CakeItem> | null>(null);

  // Bulk Delete State for Cakes
  const [selectedCakeIds, setSelectedCakeIds] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  // Hero Slides State
  const [heroSlides, setHeroSlides] = useState<HeroSlideData[]>([]);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlideData> | null>(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Global Scroll Lock when editing cake or hero slide modal is open
  useScrollLock(Boolean(editingCake) || Boolean(editingSlide));

  // Weight & Base Price Calculation States
  const [baseHalfPoundPrice, setBaseHalfPoundPrice] = useState<number | string>(350);
  const [selectedWeightLbs, setSelectedWeightLbs] = useState<number[]>([0.5, 1.0, 1.5, 2.0, 2.5, 3.0]);

  useEffect(() => {
    fetchLiveCakes();
    fetchLiveCategories();
    fetchLiveHeroSlides();
  }, []);

  const fetchLiveCakes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cakes?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();

      if (data.success && Array.isArray(data.cakes)) {
        setCakes(data.cakes);
      } else {
        setCakes([]);
      }
    } catch (err) {
      console.warn('MongoDB cakes fetch error:', err);
      setCakes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveCategories = async () => {
    try {
      const res = await fetch(`/api/categories?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategoriesList(data.categories);
      }
    } catch (err) {}
  };

  const fetchLiveHeroSlides = async () => {
    try {
      const res = await fetch(`/api/hero-slides?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.slides)) {
        setHeroSlides(data.slides);
      } else {
        setHeroSlides([]);
      }
    } catch (err) {
      console.warn('MongoDB hero slides fetch error:', err);
      setHeroSlides([]);
    }
  };

  const handleBasePriceChange = (valStr: string) => {
    const numVal = valStr === '' ? '' : Number(valStr);
    setBaseHalfPoundPrice(numVal as any);

    if (!editingCake) return;

    const numericBase = valStr === '' || isNaN(Number(valStr)) ? 0 : Number(valStr);

    const updatedOptions = selectedWeightLbs.map((lb) => {
      const opt = POUND_OPTIONS.find((p) => p.lb === lb) || POUND_OPTIONS[0];
      return {
        label: opt.label,
        weightKg: Math.round(opt.lb * 0.453592 * 10) / 10,
        price: Math.round(numericBase * opt.multiplier),
      };
    });

    setEditingCake({
      ...editingCake,
      priceStartingFrom: numericBase,
      weightOptions: updatedOptions,
    });
  };

  const toggleWeightOption = (lb: number) => {
    const isSelected = selectedWeightLbs.includes(lb);
    const nextLbs = isSelected
      ? selectedWeightLbs.filter((item) => item !== lb)
      : [...selectedWeightLbs, lb].sort((a, b) => a - b);

    setSelectedWeightLbs(nextLbs);

    if (!editingCake) return;

    const updatedOptions = nextLbs.map((wLb) => {
      const opt = POUND_OPTIONS.find((p) => p.lb === wLb) || POUND_OPTIONS[0];
      return {
        label: opt.label,
        weightKg: Math.round(opt.lb * 0.453592 * 10) / 10,
        price: Math.round((Number(baseHalfPoundPrice) || 0) * opt.multiplier),
      };
    });

    setEditingCake({
      ...editingCake,
      weightOptions: updatedOptions,
    });
  };

  const handleCreateNew = () => {
    setBaseHalfPoundPrice(350);
    setSelectedWeightLbs([0.5, 1.0, 1.5, 2.0, 2.5, 3.0]);

    const initialOptions = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map((lb) => {
      const opt = POUND_OPTIONS.find((p) => p.lb === lb)!;
      return {
        label: opt.label,
        weightKg: Math.round(opt.lb * 0.453592 * 10) / 10,
        price: Math.round(350 * opt.multiplier),
      };
    });

    setEditingCake({
      id: `cake-${Date.now()}`,
      name: '',
      category: categoriesList[0]?.id || 'signature',
      priceStartingFrom: 350,
      servings: '0.5 lb - 3.0 lb',
      description: 'Handcrafted luxury eggless cake baked fresh on your order date.',
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
      additionalImages: ['https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80'],
      eggless: true,
      featured: false,
      bestseller: false,
      newArrival: true,
      flavors: ['Belgian Dark Chocolate Truffle', 'Classic Vanilla Bean & Berry', 'Red Velvet Cream Cheese'],
      weightOptions: initialOptions,
    });
  };

  const handleEdit = (cake: CakeItem) => {
    setEditingCake(cake);

    if (cake.priceStartingFrom) {
      setBaseHalfPoundPrice(cake.priceStartingFrom);
    }
    if (cake.weightOptions && cake.weightOptions.length > 0) {
      const existingLbs = cake.weightOptions.map((opt) => {
        const found = POUND_OPTIONS.find((p) => opt.label.includes(`${p.lb}`));
        return found ? found.lb : 1.0;
      });
      setSelectedWeightLbs(Array.from(new Set(existingLbs)));
    }
  };

  const handleSaveCake = async () => {
    if (!editingCake || !editingCake.name) return;

    try {
      setSaveStatus('Saving cake to MongoDB Atlas...');
      const res = await fetch('/api/cakes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCake),
      });

      const data = await res.json();

      if (data.success && data.cake) {
        await fetchLiveCakes();
        setEditingCake(null);
        setSaveStatus('Cake saved live!');
      } else {
        alert(`Failed to save cake: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert('Failed to save cake');
    } finally {
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cake permanently?')) return;

    try {
      setCakes((prev) => prev.filter((c) => c.id !== id && (c as any)._id !== id));
      setSelectedCakeIds((prev) => prev.filter((i) => i !== id));
      const res = await fetch(`/api/cakes?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchLiveCakes();
      } else {
        alert(`Failed to delete cake: ${data.error || 'Unknown error'}`);
        await fetchLiveCakes();
      }
    } catch (err) {
      alert('Failed to delete cake');
      await fetchLiveCakes();
    }
  };

  // Checkbox Selection Logic for Cakes
  const toggleSelectAllCakes = () => {
    if (selectedCakeIds.length === filteredCakes.length) {
      setSelectedCakeIds([]);
    } else {
      setSelectedCakeIds(filteredCakes.map((c) => c.id));
    }
  };

  const toggleSelectCake = (id: string) => {
    setSelectedCakeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Bulk Delete Multiple Checked Cakes
  const handleBulkDeleteCakes = async () => {
    if (selectedCakeIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedCakeIds.length} selected cakes permanently?`)) return;

    try {
      setIsDeletingBulk(true);
      setSaveStatus(`Deleting ${selectedCakeIds.length} cakes from MongoDB...`);

      // Execute batch deletes
      await Promise.all(
        selectedCakeIds.map((id) =>
          fetch(`/api/cakes?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
        )
      );

      setSelectedCakeIds([]);
      await fetchLiveCakes();
      setSaveStatus(`Successfully deleted ${selectedCakeIds.length} cakes!`);
    } catch (err) {
      alert('Failed to delete selected cakes');
      await fetchLiveCakes();
    } finally {
      setIsDeletingBulk(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Image Upload Handler with WebP Compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    try {
      setUploadingImage(true);
      const rawFiles = Array.from(e.target.files);

      const optResults = await optimizeMultipleImagesClientSide(rawFiles);
      const formData = new FormData();

      optResults.forEach((res) => {
        formData.append('files', res.file);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.images)) {
        const uploadedUrls = data.images.map((img: any) => img.secure_url || img.url);

        if (editingCake) {
          const currentImages = editingCake.additionalImages || [];
          const updatedImages = [...currentImages, ...uploadedUrls];
          setEditingCake({
            ...editingCake,
            image: updatedImages[0] || editingCake.image,
            additionalImages: updatedImages,
          });
        }
      }
    } catch (err) {
      alert('Cloudinary upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  // Hero Slide Handlers
  const handleCreateHeroSlide = () => {
    setEditingSlide({
      id: `hero-${Date.now()}`,
      cakeName: '',
      badgeTagline: 'Signature Artisanal',
      category: 'Wedding Tier',
      priceStartingFrom: 1800,
      description: 'Handcrafted with Belgian chocolate ganache and 24K gold foil accents.',
      image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1200&q=80',
      ctaLink: '/catalog',
      active: true,
    });
  };

  const handleSaveHeroSlide = async () => {
    if (!editingSlide || !editingSlide.cakeName) return;

    try {
      setSaveStatus('Saving hero slide to MongoDB...');
      const res = await fetch('/api/hero-slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSlide),
      });

      const data = await res.json();

      if (data.success && data.slide) {
        await fetchLiveHeroSlides();
        setEditingSlide(null);
        setSaveStatus('Hero slide saved permanently!');
      } else {
        alert(`Failed to save hero slide: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Failed to save hero slide');
    } finally {
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  const handleDeleteHeroSlide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero slide permanently?')) return;

    try {
      setHeroSlides((prev) => prev.filter((s) => s.id !== id && (s as any)._id !== id));
      const res = await fetch(`/api/hero-slides?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchLiveHeroSlides();
      } else {
        alert(`Failed to delete hero slide: ${data.error || 'Unknown error'}`);
        await fetchLiveHeroSlides();
      }
    } catch (err) {
      alert('Failed to delete hero slide');
      await fetchLiveHeroSlides();
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const rawFile = e.target.files[0];

    try {
      setUploadingImage(true);
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
        setEditingSlide((prev) => ({ ...prev, image: uploadedUrl }));
      }
    } catch (err) {
      alert('Hero image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  // Filtered Cakes
  const filteredCakes = cakes.filter((cake) => {
    const matchesSearch = cake.name.toLowerCase().includes(search.toLowerCase()) || cake.id.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || cake.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl text-charcoal-900">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-warmgray-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">Catalog & Hero Slide Manager</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Live MongoDB</span>
            </span>
          </div>
          <p className="text-xs text-warmgray-500 font-medium mt-1">
            Manage signature cakes, base half-pound pricing, and sleek homepage hero carousel slides.
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center space-x-2 bg-cream-100 p-1 rounded-2xl border border-warmgray-200">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-white text-gold-700 shadow-xs'
                : 'text-warmgray-600 hover:text-charcoal-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cake Catalog ({cakes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'hero'
                ? 'bg-white text-gold-700 shadow-xs'
                : 'text-warmgray-600 hover:text-charcoal-900'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Hero Carousel ({heroSlides.length})</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-2xl font-bold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* TAB 1: CAKE CATALOG MANAGER */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-warmgray-400" />
                <input
                  type="text"
                  placeholder="Search cake name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-warmgray-300 text-xs font-medium focus:border-gold-500 focus:outline-none bg-white"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-warmgray-300 text-xs font-bold text-charcoal-900 bg-white"
              >
                <option value="all">All Categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                onClick={fetchLiveCakes}
                className="p-2.5 rounded-xl border border-warmgray-300 hover:border-gold-500 text-charcoal-900 bg-white shadow-xs"
                title="Refresh List"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Cake</span>
              </button>
            </div>
          </div>

          {/* Dynamic Bulk Action Bar when Checkboxes are Ticked */}
          {selectedCakeIds.length > 0 && (
            <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center justify-between shadow-md animate-fade-in">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-red-600" />
                <span className="text-xs font-bold text-red-900">
                  {selectedCakeIds.length} {selectedCakeIds.length === 1 ? 'cake' : 'cakes'} selected
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedCakeIds([])}
                  className="px-3 py-1.5 rounded-lg border border-red-200 bg-white text-xs font-bold text-warmgray-700 hover:bg-warmgray-50"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleBulkDeleteCakes}
                  disabled={isDeletingBulk}
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeletingBulk ? 'Deleting Selected...' : `Delete Selected (${selectedCakeIds.length})`}</span>
                </button>
              </div>
            </div>
          )}

          {/* Cakes Table */}
          <div className="bg-white rounded-2xl border border-warmgray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cream-100 border-b border-warmgray-200 text-[10px] uppercase font-bold text-warmgray-700 tracking-wider">
                    <th className="p-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedCakeIds.length === filteredCakes.length && filteredCakes.length > 0}
                        onChange={toggleSelectAllCakes}
                        className="w-4 h-4 accent-gold-600 rounded cursor-pointer"
                      />
                    </th>
                    <th className="p-4">Cake Info</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Base 0.5 lb Price</th>
                    <th className="p-4">Home Sections</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warmgray-100 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-warmgray-500 font-bold">
                        Loading cakes from MongoDB Atlas...
                      </td>
                    </tr>
                  ) : filteredCakes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-warmgray-500">
                        No cakes found matching query.
                      </td>
                    </tr>
                  ) : (
                    filteredCakes.map((cake) => {
                      const isChecked = selectedCakeIds.includes(cake.id);
                      return (
                        <tr
                          key={cake.id}
                          className={`transition-colors ${
                            isChecked ? 'bg-amber-50/70 font-bold' : 'hover:bg-cream-50/50'
                          }`}
                        >
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSelectCake(cake.id)}
                              className="w-4 h-4 accent-gold-600 rounded cursor-pointer"
                            />
                          </td>

                          <td className="p-4 flex items-center space-x-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-100 border border-warmgray-200 flex-shrink-0">
                              <Image
                                src={getOptimizedCloudinaryUrl(cake.image, { width: 100, height: 100, crop: 'fill' })}
                                alt={cake.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-charcoal-900 text-sm">{cake.name}</h4>
                              <p className="text-[10px] text-warmgray-500 font-mono">ID: {cake.id}</p>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold bg-cream-100 text-gold-800 border border-gold-300">
                              {cake.category}
                            </span>
                          </td>

                          <td className="p-4 font-serif font-bold text-gold-700 text-sm">
                            ₹{(cake.priceStartingFrom || 0).toLocaleString()}
                          </td>

                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {cake.featured && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                                  Featured
                                </span>
                              )}
                              {cake.bestseller && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800">
                                  Bestseller
                                </span>
                              )}
                              {cake.newArrival && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                  New Arrival
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(cake)}
                                className="p-2 rounded-xl text-warmgray-600 hover:text-gold-700 hover:bg-gold-50 border border-warmgray-200 transition-colors"
                                title="Edit Cake"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDelete(cake.id)}
                                className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-warmgray-200 transition-colors"
                                title="Delete Cake"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SLEEK COMPACT HERO SLIDES MANAGER */}
      {activeTab === 'hero' && (
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-warmgray-200 shadow-xs flex justify-between items-center">
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal-900">Homepage Hero Slides ({heroSlides.length})</h2>
              <p className="text-xs text-warmgray-500">Add, edit, or remove slides from homepage hero slider carousel.</p>
            </div>
            <button
              onClick={handleCreateHeroSlide}
              className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hero Slide</span>
            </button>
          </div>

          {heroSlides.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-warmgray-200 space-y-2">
              <Layout className="w-8 h-8 text-warmgray-400 mx-auto" />
              <p className="text-xs text-warmgray-600 font-bold">No Hero Slides Active</p>
              <p className="text-[11px] text-warmgray-500">
                Click <strong>"Add Hero Slide"</strong> above to add your first slide.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className="bg-white p-3.5 rounded-2xl border border-warmgray-200 hover:border-gold-400 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-cream-100 border border-warmgray-200 flex-shrink-0">
                      <Image src={slide.image} alt={slide.cakeName} fill className="object-cover" />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-charcoal-900/80 text-white text-[9px] font-bold">
                        #{idx + 1}
                      </div>
                    </div>

                    <div className="truncate">
                      <div className="flex items-center space-x-2 mb-0.5">
                        <span className="text-[9px] uppercase font-bold text-gold-700 bg-gold-50 px-2 py-0.2 rounded border border-gold-200">
                          {slide.badgeTagline || 'Signature'}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.2 rounded ${slide.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-warmgray-200 text-warmgray-600'}`}>
                          {slide.active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <h3 className="font-serif text-sm font-bold text-charcoal-900 truncate">{slide.cakeName}</h3>
                      <p className="text-xs font-bold text-gold-700">₹{(slide.priceStartingFrom || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-warmgray-100 flex-shrink-0">
                    <span className="text-[10px] text-warmgray-500 font-mono truncate max-w-[140px] hidden sm:inline-block">
                      Link: {slide.ctaLink}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingSlide(slide)}
                        className="px-3 py-1.5 rounded-lg text-warmgray-700 hover:text-gold-700 hover:bg-gold-50 border border-warmgray-300 text-xs font-bold inline-flex items-center space-x-1"
                      >
                        <Edit className="w-3.5 h-3.5 text-gold-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteHeroSlide(slide.id)}
                        className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 text-xs font-bold inline-flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit/Create Cake Modal */}
      {editingCake && (
        <div className="fixed inset-0 z-[1000] bg-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-warmgray-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto text-xs text-charcoal-900 scroll-lock-overlay">
            
            <div className="flex justify-between items-center border-b border-warmgray-200 pb-3">
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                {editingCake.name ? `Edit: ${editingCake.name}` : 'Create New Cake (Tina Baidya Kitchen)'}
              </h3>
              <button onClick={() => setEditingCake(null)} className="p-1 text-warmgray-400 hover:text-charcoal-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Cake Name *</label>
                <input
                  type="text"
                  value={editingCake.name || ''}
                  onChange={(e) => setEditingCake({ ...editingCake, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-warmgray-300 focus:border-gold-500 focus:outline-none text-xs font-bold"
                  placeholder="e.g. Velvet Noir Truffle"
                />
              </div>

              {/* 0.5 LB BASE PRICE CALCULATOR */}
              <div className="p-4 bg-gold-50/70 rounded-2xl border border-gold-300 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gold-900 text-sm">0.5 Pound Base Price Calculator</h4>
                    <p className="text-[10px] text-warmgray-600">
                      Enter the price for 0.5 Pound (Half Pound). All other weight options will auto-calculate based on this base price.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gold-700 px-3 py-1 bg-white rounded-full border border-gold-400">
                    Base: ₹{baseHalfPoundPrice}
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-warmgray-800 mb-1">0.5 Pound (Half Pound) Base Price (₹) *</label>
                  <input
                    type="number"
                    value={baseHalfPoundPrice === '' || baseHalfPoundPrice === undefined || baseHalfPoundPrice === null ? '' : baseHalfPoundPrice}
                    onChange={(e) => handleBasePriceChange(e.target.value)}
                    onBlur={() => {
                      if (baseHalfPoundPrice === '' || isNaN(Number(baseHalfPoundPrice))) {
                        handleBasePriceChange('0');
                      }
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-gold-400 bg-white font-serif text-lg font-bold text-gold-800 focus:outline-none"
                    placeholder="0"
                  />
                </div>

                {/* Weight Options Selection Checkboxes */}
                <div>
                  <label className="block font-bold text-warmgray-800 mb-1">Available Weight Options for Customer</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {POUND_OPTIONS.map((opt) => {
                      const isChecked = selectedWeightLbs.includes(opt.lb);
                      const calcPrice = Math.round((Number(baseHalfPoundPrice) || 0) * opt.multiplier);
                      return (
                        <label
                          key={opt.lb}
                          onClick={() => toggleWeightOption(opt.lb)}
                          className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-white border-gold-500 text-gold-900 shadow-xs'
                              : 'bg-warmgray-100/60 border-warmgray-200 text-warmgray-500 opacity-60'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5">
                            <input type="checkbox" checked={isChecked} onChange={() => {}} className="accent-gold-600" />
                            <span>{opt.lb} lb</span>
                          </div>
                          <span className="font-bold text-gold-700">₹{calcPrice}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Homepage Sections Checkboxes */}
              <div className="p-4 bg-cream-50 rounded-2xl border border-warmgray-200 space-y-2">
                <label className="block font-bold text-charcoal-900 text-xs">Assign Homepage Sections</label>
                <div className="flex flex-wrap gap-4 text-xs font-semibold">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingCake.featured || false}
                      onChange={(e) => setEditingCake({ ...editingCake, featured: e.target.checked })}
                      className="accent-gold-600 rounded"
                    />
                    <span>Featured Signature Collection</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingCake.bestseller || false}
                      onChange={(e) => setEditingCake({ ...editingCake, bestseller: e.target.checked })}
                      className="accent-gold-600 rounded"
                    />
                    <span>Most Loved Bestsellers</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingCake.newArrival || false}
                      onChange={(e) => setEditingCake({ ...editingCake, newArrival: e.target.checked })}
                      className="accent-gold-600 rounded"
                    />
                    <span>Newest Arrivals</span>
                  </label>
                </div>
              </div>

              {/* Cloudinary Image Upload with Client WebP Compression */}
              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Cake Images (Cloudinary CDN)</label>
                <div className="flex items-center space-x-3">
                  <label className="px-4 py-2 rounded-xl border border-gold-500 text-gold-700 font-bold bg-gold-50 hover:bg-gold-500 hover:text-white transition-all cursor-pointer inline-flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImage ? 'Compressing & Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                  {editingCake.image && (
                    <span className="text-[10px] text-emerald-600 font-bold">Main Image Set!</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Category</label>
                <select
                  value={editingCake.category || 'signature'}
                  onChange={(e) => setEditingCake({ ...editingCake, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-warmgray-300 text-xs font-bold text-charcoal-900 bg-white"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={editingCake.description || ''}
                  onChange={(e) => setEditingCake({ ...editingCake, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-warmgray-300 text-xs font-medium text-charcoal-900"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-warmgray-200">
              <button
                onClick={() => setEditingCake(null)}
                className="px-5 py-2.5 rounded-full border border-warmgray-300 font-bold text-warmgray-600 text-xs hover:bg-warmgray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCake}
                className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
              >
                Save Cake to MongoDB
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Hero Slide Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-[1000] bg-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-warmgray-200 space-y-4 my-8 text-xs text-charcoal-900 scroll-lock-overlay">
            
            <div className="flex justify-between items-center border-b border-warmgray-200 pb-3">
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                {editingSlide.cakeName ? `Edit Hero Slide` : 'Add New Hero Slide'}
              </h3>
              <button onClick={() => setEditingSlide(null)} className="p-1 text-warmgray-400 hover:text-charcoal-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Cake Name / Title *</label>
                <input
                  type="text"
                  value={editingSlide.cakeName || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, cakeName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-warmgray-300 font-bold"
                  placeholder="e.g. Aurora 3-Tier Pearl Velvet Wedding Cake"
                />
              </div>

              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Badge Tagline</label>
                <input
                  type="text"
                  value={editingSlide.badgeTagline || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, badgeTagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-warmgray-300 font-medium"
                  placeholder="e.g. Signature Artisanal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-warmgray-700 mb-1">Category Label</label>
                  <input
                    type="text"
                    value={editingSlide.category || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-warmgray-300 font-medium"
                    placeholder="e.g. Wedding Tier"
                  />
                </div>

                <div>
                  <label className="block font-bold text-warmgray-700 mb-1">Starting Price (₹) *</label>
                  <input
                    type="number"
                    value={(editingSlide.priceStartingFrom as any) === '' || editingSlide.priceStartingFrom === undefined || editingSlide.priceStartingFrom === null ? '' : editingSlide.priceStartingFrom}
                    onChange={(e) => setEditingSlide({ ...editingSlide, priceStartingFrom: e.target.value === '' ? ('' as any) : Number(e.target.value) })}
                    onBlur={() => {
                      if ((editingSlide.priceStartingFrom as any) === '' || isNaN(Number(editingSlide.priceStartingFrom))) {
                        setEditingSlide({ ...editingSlide, priceStartingFrom: 0 });
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-warmgray-300 font-bold text-gold-700"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Hero Image (Auto WebP Compressed)</label>
                <div className="flex items-center space-x-3">
                  <label className="px-4 py-2 rounded-xl border border-gold-500 text-gold-700 font-bold bg-gold-50 hover:bg-gold-500 hover:text-white transition-all cursor-pointer inline-flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                  </label>
                  {editingSlide.image && (
                    <span className="text-[10px] text-emerald-600 font-bold">Image Ready!</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-warmgray-700 mb-1">CTA Redirect Link</label>
                <input
                  type="text"
                  value={editingSlide.ctaLink || '/catalog'}
                  onChange={(e) => setEditingSlide({ ...editingSlide, ctaLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-warmgray-300 font-medium"
                  placeholder="e.g. /cake/aurora-wedding-tier"
                />
              </div>

              <div>
                <label className="block font-bold text-warmgray-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingSlide.description || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-warmgray-300 font-medium"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  checked={editingSlide.active !== false}
                  onChange={(e) => setEditingSlide({ ...editingSlide, active: e.target.checked })}
                  className="accent-gold-600 rounded"
                />
                <label className="font-bold text-charcoal-900">Active in Homepage Carousel</label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-warmgray-200">
              <button
                onClick={() => setEditingSlide(null)}
                className="px-5 py-2.5 rounded-full border border-warmgray-300 font-bold text-warmgray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHeroSlide}
                className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold uppercase tracking-wider shadow-sm cursor-pointer"
              >
                Save Hero Slide
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
