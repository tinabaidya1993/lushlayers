'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Layers, Sparkles, CheckCircle2, X, Upload, RefreshCw } from 'lucide-react';
import { CATEGORIES } from '@/data/cakes';
import { CategoryInfo } from '@/types';
import { useScrollLock } from '@/hooks/useScrollLock';
import { optimizeImageClientSide } from '@/lib/imageOptimizer';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryInfo> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useScrollLock(Boolean(editingCategory));

  useEffect(() => {
    fetchLiveCategories();
  }, []);

  const fetchLiveCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/categories?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.warn('MongoDB categories fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingCategory({
      id: `category-${Date.now()}`,
      name: '',
      tagline: 'Artisanal Collection',
      description: 'Handcrafted luxury cakes designed for special occasions.',
      heroImage: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=1200',
      badge: 'New Collection',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;

    try {
      setSaveStatus('Saving category to MongoDB Atlas...');
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      });

      const data = await res.json();

      if (data.success && data.category) {
        fetchLiveCategories();
        setEditingCategory(null);
        setSaveStatus('Category saved live!');
      } else {
        alert(`Failed to save category: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert('Failed to save category');
    } finally {
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category from MongoDB Atlas?')) return;

    try {
      setCategories((prev) => prev.filter((c) => c.id !== id && (c as any)._id !== id));
      const res = await fetch(`/api/categories?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchLiveCategories();
      } else {
        alert(`Failed to delete category: ${data.error || 'Unknown error'}`);
        fetchLiveCategories();
      }
    } catch (err) {
      alert('Failed to delete category');
      fetchLiveCategories();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const rawFile = e.target.files[0];

    try {
      setUploadingImage(true);
      
      // Auto-compress and resize image client-side before upload
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
        setEditingCategory((prev) => ({ ...prev, heroImage: uploadedUrl }));
      }
    } catch (err) {
      alert('Cloudinary upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-3xl font-bold text-charcoal-900">Category Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>MongoDB Live Sync</span>
            </span>
          </div>
          <p className="text-xs text-warmgray-500 font-medium">
            Categories added or modified here reflect instantly across the entire website and filter bars.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchLiveCategories}
            className="p-2.5 rounded-full border border-warmgray-300 hover:border-gold-500 text-charcoal-900"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleCreateNew}
            className="px-5 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center space-x-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-2xl font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Edit/Create Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-[1000] bg-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-warmgray-200 space-y-4 my-8 text-xs text-charcoal-900 scroll-lock-overlay">
            
            <div className="flex justify-between items-center border-b border-warmgray-200 pb-3">
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                {editingCategory.name ? `Edit: ${editingCategory.name}` : 'Add New Cake Category'}
              </h3>
              <button onClick={() => setEditingCategory(null)} className="p-1 text-warmgray-400 hover:text-charcoal-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Category Cover Image */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1">Category Cover Image (Cloudinary)</label>
                <div className="flex items-center space-x-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream-100 border border-warmgray-200 flex-shrink-0">
                    <Image
                      src={editingCategory.heroImage || 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80'}
                      alt="Category Cover"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <label className="px-4 py-2 rounded-xl border border-gold-500 text-gold-700 font-bold bg-gold-50/50 hover:bg-gold-500 hover:text-white transition-all cursor-pointer inline-flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Cover Image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-warmgray-300 focus:outline-none focus:border-gold-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingCategory.tagline || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-warmgray-300 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-warmgray-300 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-warmgray-200">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-5 py-2.5 rounded-full border border-warmgray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold uppercase tracking-wider"
                >
                  Save Category Live
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Category Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-warmgray-200 overflow-hidden shadow-sm hover:shadow-luxury-hover transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] bg-cream-100">
              <Image src={cat.heroImage} alt={cat.name} fill className="object-cover" />
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => setEditingCategory(cat)}
                  className="p-2 rounded-full bg-white/90 text-charcoal-900 hover:bg-gold-500 hover:text-white shadow-sm transition-colors"
                  title="Edit Category"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 rounded-full bg-white/90 text-red-600 hover:bg-red-600 hover:text-white shadow-sm transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-1">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-base font-bold text-charcoal-900">{cat.name}</h3>
                <span className="text-[10px] uppercase font-bold text-gold-700 bg-gold-50 px-2 py-0.5 rounded-full border border-gold-200">
                  {cat.badge || 'Collection'}
                </span>
              </div>
              <p className="text-[11px] text-warmgray-500 italic">{cat.tagline}</p>
              <p className="text-xs text-warmgray-600 line-clamp-2 pt-1">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
