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
  Layout
} from 'lucide-react';
import { CAKES_DATA, CATEGORIES } from '@/data/cakes';
import { DEFAULT_HERO_SLIDES, HeroSlideData } from '@/data/heroSlides';
import { CakeItem } from '@/types';
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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingCake, setEditingCake] = useState<Partial<CakeItem> | null>(null);

  // Hero Slides State
  const [heroSlides, setHeroSlides] = useState<HeroSlideData[]>([]);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlideData> | null>(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Global Scroll Lock when editing cake or hero slide modal is open
  useScrollLock(Boolean(editingCake) || Boolean(editingSlide));

  // Weight & Base Price Calculation States
  const [baseHalfPoundPrice, setBaseHalfPoundPrice] = useState<number>(350);
  const [selectedWeightLbs, setSelectedWeightLbs] = useState<number[]>([0.5, 1.0, 1.5, 2.0, 2.5, 3.0]);

  useEffect(() => {
    fetchLiveCakes();
    fetchLiveHeroSlides();
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
      console.warn('MongoDB fetch failed, using fallback:', err);
      setCakes(CAKES_DATA);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveHeroSlides = async () => {
    try {
      const res = await fetch('/api/hero-slides');
      const data = await res.json();
      if (data.success && data.slides) {
        setHeroSlides(data.slides);
      } else {
        setHeroSlides(DEFAULT_HERO_SLIDES);
      }
    } catch (err) {
      setHeroSlides(DEFAULT_HERO_SLIDES);
    }
  };

  const handleBasePriceChange = (newBasePrice: number) => {
    setBaseHalfPoundPrice(newBasePrice);
    if (!editingCake) return;

    const updatedWeightOptions = POUND_OPTIONS
      .filter((opt) => selectedWeightLbs.includes(opt.lb))
      .map((opt) => ({
        weightKg: Math.round(opt.lb * 0.453592 * 100) / 100,
        label: opt.label,
        price: Math.round(newBasePrice * opt.multiplier),
      }));

    setEditingCake((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        priceStartingFrom: newBasePrice,
        weightOptions: updatedWeightOptions,
      };
    });
  };

  const toggleWeightOption = (lb: number) => {
    const isSelected = selectedWeightLbs.includes(lb);
    const newLbs = isSelected
      ? selectedWeightLbs.filter((l) => l !== lb)
      : [...selectedWeightLbs, lb].sort((a, b) => a - b);

    setSelectedWeightLbs(newLbs);

    if (!editingCake) return;

    const updatedWeightOptions = POUND_OPTIONS
      .filter((opt) => newLbs.includes(opt.lb))
      .map((opt) => ({
        weightKg: Math.round(opt.lb * 0.453592 * 100) / 100,
        label: opt.label,
        price: Math.round(baseHalfPoundPrice * opt.multiplier),
      }));

    setEditingCake((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        priceStartingFrom: baseHalfPoundPrice,
        weightOptions: updatedWeightOptions,
      };
    });
  };

  const filteredCakes = cakes.filter((cake) => {
    const matchesSearch =
      cake.name.toLowerCase().includes(search.toLowerCase()) ||
      cake.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cake.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateNew = () => {
    setBaseHalfPoundPrice(350);
    setSelectedWeightLbs([0.5, 1.0, 1.5, 2.0, 2.5, 3.0]);

    const initialWeightOptions = POUND_OPTIONS
      .filter((opt) => [0.5, 1.0, 1.5, 2.0, 2.5, 3.0].includes(opt.lb))
      .map((opt) => ({
        weightKg: Math.round(opt.lb * 0.453592 * 100) / 100,
        label: opt.label,
        price: Math.round(350 * opt.multiplier),
      }));

    setEditingCake({
      id: `cake-${Date.now().toString().slice(-6)}`,
      name: '',
      subtitle: 'Tina Manna Kitchen Special',
      category: 'signature',
      priceStartingFrom: 350,
      description: '100% Eggless artisan cake baked fresh by Tina Manna in Kolkata.',
      shortDescription: 'Fresh eggless cake baked to perfection.',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
      additionalImages: [],
      servings: '0.5 Pound (Half Pound)',
      weightOptions: initialWeightOptions,
      flavors: ['Signature Vanilla Bean', 'Belgian Truffle Chocolate'],
      eggless: true,
      bestseller: false,
      newArrival: true,
      featured: false,
      tags: ['Fresh Baked', 'Tina Manna'],
      customizable: true,
      prepTimeHours: 24,
      availabilityStatus: '24 Hours Advance',
    });
  };

  const handleEdit = (cake: CakeItem) => {
    setEditingCake(cake);
    if (cake.weightOptions && cake.weightOptions.length > 0) {
      setBaseHalfPoundPrice(cake.weightOptions[0].price || cake.priceStartingFrom || 350);
    } else {
      setBaseHalfPoundPrice(cake.priceStartingFrom || 350);
    }
  };

  const handleSaveCake = async () => {
    if (!editingCake || !editingCake.name || !editingCake.priceStartingFrom) {
      alert('Please fill out cake name and starting price');
      return;
    }

    try {
      const isExisting = cakes.some((c) => c.id === editingCake.id);
      const method = isExisting ? 'PUT' : 'POST';

      const res = await fetch('/api/cakes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCake),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSaveStatus(isExisting ? 'Cake updated in MongoDB Atlas!' : 'New Cake saved to MongoDB Atlas!');
        fetchLiveCakes();
        setEditingCake(null);
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        alert(`Failed to save to database: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error saving cake: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cake from MongoDB Atlas?')) return;

    try {
      const res = await fetch(`/api/cakes?id=${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok && data.success) {
        setSaveStatus(`Cake deleted from MongoDB Atlas`);
        fetchLiveCakes();
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        alert(`Failed to delete: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error deleting cake: ${err.message}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const rawFiles = Array.from(e.target.files);

    try {
      setUploadingImage(true);
      const optimizedResults = await optimizeMultipleImagesClientSide(rawFiles);
      const formData = new FormData();
      optimizedResults.forEach((res) => formData.append('file', res.file));

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

  // Hero Slide Handlers
  const handleCreateHeroSlide = () => {
    setEditingSlide({
      id: `hero-${Date.now().toString().slice(-6)}`,
      cakeName: 'Artisanal Celebration Cake',
      badgeTagline: 'Signature Collection',
      category: 'Featured Collection',
      priceStartingFrom: 1800,
      description: 'Handcrafted luxury 100% eggless cake.',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
      ctaLink: '/catalog',
      orderIndex: heroSlides.length,
      active: true,
    });
  };

  const handleSaveHeroSlide = async () => {
    if (!editingSlide || !editingSlide.cakeName || !editingSlide.image) {
      alert('Please enter cake name and upload an image for the hero slide.');
      return;
    }

    try {
      const isExisting = heroSlides.some((s) => s.id === editingSlide.id);
      const method = isExisting ? 'PUT' : 'POST';

      const res = await fetch('/api/hero-slides', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSlide),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus(isExisting ? 'Hero slide updated!' : 'New Hero slide added!');
        fetchLiveHeroSlides();
        setEditingSlide(null);
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        alert(`Failed to save hero slide: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error saving hero slide: ${err.message}`);
    }
  };

  const handleDeleteHeroSlide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return;
    try {
      const res = await fetch(`/api/hero-slides?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus('Hero slide deleted');
        fetchLiveHeroSlides();
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch (err: any) {
      alert(`Error deleting hero slide: ${err.message}`);
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
        const url = data.images[0].secure_url || data.images[0].url;
        setEditingSlide((prev) => (prev ? { ...prev, image: url } : prev));
      }
    } catch (err) {
      alert('Hero image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Refresh Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-warmgray-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-3xl font-bold text-charcoal-900">Lush Layers Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>MongoDB Atlas Live</span>
            </span>
          </div>
          <p className="text-xs text-warmgray-500 font-medium">
            Manage Catalog Cakes and Homepage Hero Slider for Tina Manna Master Bakery.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              fetchLiveCakes();
              fetchLiveHeroSlides();
            }}
            className="p-2.5 rounded-full border border-warmgray-300 hover:border-gold-500 text-charcoal-900 transition-colors"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          {activeTab === 'catalog' ? (
            <button
              onClick={handleCreateNew}
              className="px-5 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Cake</span>
            </button>
          ) : (
            <button
              onClick={handleCreateHeroSlide}
              className="px-5 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hero Slide</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Switcher: Catalog Cakes vs Hero Slider */}
      <div className="flex space-x-2 border-b border-warmgray-200 pb-1">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-gold-500 text-white shadow-md'
              : 'bg-white text-warmgray-600 hover:bg-warmgray-100 border border-warmgray-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Catalog Cakes ({cakes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-gold-500 text-white shadow-md'
              : 'bg-white text-warmgray-600 hover:bg-warmgray-100 border border-warmgray-200'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Homepage Hero Slider ({heroSlides.length})</span>
        </button>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-2xl font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* TAB 1: CATALOG CAKES MANAGER */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
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

          {/* Cakes Table */}
          <div className="bg-white rounded-3xl border border-warmgray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cream-100 border-b border-warmgray-200 text-[10px] uppercase font-bold text-warmgray-600 tracking-wider">
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
                      <td colSpan={5} className="p-8 text-center text-warmgray-500 font-bold">
                        Loading cakes from MongoDB Atlas...
                      </td>
                    </tr>
                  ) : filteredCakes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-warmgray-500">
                        No cakes found matching query.
                      </td>
                    </tr>
                  ) : (
                    filteredCakes.map((cake) => (
                      <tr key={cake.id} className="hover:bg-cream-50/50 transition-colors">
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOMEPAGE HERO SLIDER MANAGER */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-warmgray-200 shadow-sm flex justify-between items-center">
            <div>
              <h2 className="font-serif text-xl font-bold text-charcoal-900">Hero Section Slides ({heroSlides.length})</h2>
              <p className="text-xs text-warmgray-500">Control which slides appear in the homepage auto-swipe carousel.</p>
            </div>
            <button
              onClick={handleCreateHeroSlide}
              className="px-4 py-2 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hero Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {heroSlides.map((slide, idx) => (
              <div key={slide.id || idx} className="bg-white p-4 rounded-3xl border border-warmgray-200 shadow-sm space-y-3 relative group">
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-cream-100 border border-warmgray-300">
                  <Image src={slide.image} alt={slide.cakeName} fill className="object-cover" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-charcoal-900/80 text-white text-[10px] font-bold">
                    Slide #{idx + 1}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-gold-700 shadow-sm">
                    {slide.active !== false ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-gold-700 block">{slide.badgeTagline || 'Signature Artisanal'}</span>
                  <h3 className="font-serif text-base font-bold text-charcoal-900 truncate">{slide.cakeName}</h3>
                  <p className="text-xs font-serif font-bold text-gold-700">From ₹{(slide.priceStartingFrom || 0).toLocaleString()}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-warmgray-100">
                  <span className="text-[10px] text-warmgray-500 truncate max-w-[180px]">Link: {slide.ctaLink}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingSlide(slide)}
                      className="p-2 rounded-xl text-warmgray-600 hover:text-gold-700 hover:bg-gold-50 border border-warmgray-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteHeroSlide(slide.id)}
                      className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-warmgray-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                    value={baseHalfPoundPrice}
                    onChange={(e) => handleBasePriceChange(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gold-400 bg-white font-serif text-lg font-bold text-gold-800 focus:outline-none"
                    placeholder="350"
                  />
                </div>

                {/* Weight Options Selection Checkboxes */}
                <div>
                  <label className="block font-bold text-warmgray-800 mb-1">Available Weight Options for Customer</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {POUND_OPTIONS.map((opt) => {
                      const isChecked = selectedWeightLbs.includes(opt.lb);
                      const calcPrice = Math.round(baseHalfPoundPrice * opt.multiplier);
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
                  className="w-full px-3 py-2 rounded-xl border border-warmgray-300 text-xs font-bold text-charcoal-900"
                >
                  {CATEGORIES.map((cat) => (
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
                className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
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
                    value={editingSlide.priceStartingFrom || 1800}
                    onChange={(e) => setEditingSlide({ ...editingSlide, priceStartingFrom: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-warmgray-300 font-bold text-gold-700"
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
                className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold uppercase tracking-wider shadow-sm"
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
