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

export default function AdminCakesPage() {
  const [cakes, setCakes] = useState<CakeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingCake, setEditingCake] = useState<Partial<CakeItem> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

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

  const filteredCakes = cakes.filter((cake) => {
    const matchesSearch = cake.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || cake.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateNew = () => {
    setEditingCake({
      id: `cake-${Date.now()}`,
      name: '',
      category: 'signature',
      priceStartingFrom: 3500,
      description: '',
      shortDescription: '',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
      additionalImages: [],
      servings: '10 - 15 Guests (1.5 kg)',
      flavors: ['Vanilla Bean', 'Belgian Chocolate'],
      eggless: true,
      bestseller: false,
      newArrival: true,
      featured: false,
      tags: ['Custom'],
      customizable: true,
      prepTimeHours: 24,
      availabilityStatus: '24 Hours Advance',
    });
  };

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
            <h1 className="font-serif text-3xl font-bold text-charcoal-900">Cake Inventory Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>MongoDB Atlas Live</span>
            </span>
          </div>
          <p className="text-xs text-warmgray-500 font-medium">
            Live database sync with MongoDB Atlas (<code className="text-gold-700">lushlayers.felkulm.mongodb.net</code>) & Cloudinary CDN.
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
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-warmgray-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto text-xs text-charcoal-900">
            
            <div className="flex justify-between items-center border-b border-warmgray-200 pb-3">
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                {editingCake.name ? `Edit: ${editingCake.name}` : 'Create New Boutique Cake'}
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
                    <p className="text-[10px] text-warmgray-500 mt-1">Direct upload to Cloudinary (ls9bjogq).</p>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingCake.priceStartingFrom || 0}
                    onChange={(e) => setEditingCake({ ...editingCake, priceStartingFrom: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-warmgray-300 focus:outline-none focus:border-gold-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1">Servings / Weight</label>
                  <input
                    type="text"
                    value={editingCake.servings || ''}
                    onChange={(e) => setEditingCake({ ...editingCake, servings: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-warmgray-300 focus:outline-none focus:border-gold-500"
                  />
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
                  className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold uppercase tracking-wider"
                >
                  Save to MongoDB Atlas
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
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
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
                  <td className="p-4 font-mono font-bold text-gold-700">₹{cake.priceStartingFrom.toLocaleString()}</td>
                  <td className="p-4">
                    {cake.eggless && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                        🌱 Eggless
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => setEditingCake(cake)}
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
                  <span className="font-mono font-bold text-gold-700 text-xs">₹{cake.priceStartingFrom.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingCake(cake)}
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
