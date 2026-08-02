'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Layers, Sparkles, CheckCircle2, X, RefreshCw, FolderPlus, CheckSquare, Square } from 'lucide-react';
import { CategoryInfo } from '@/types';
import { useScrollLock } from '@/hooks/useScrollLock';

const DEFAULT_PARENT_GROUPS = ['Celebration Cakes', 'Special Occasion Cakes', 'Signature Collection'];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryInfo> | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [customGroupInput, setCustomGroupInput] = useState('');

  // Multiple Selection Checkboxes state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

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
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.warn('Categories fetch error:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setCustomGroupInput('');
    setEditingCategory({
      id: `category-${Date.now()}`,
      name: '',
      group: 'Celebration Cakes',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name?.trim()) return;

    const finalGroup = customGroupInput.trim() || editingCategory.group || 'Celebration Cakes';
    const payload = {
      id: editingCategory.id || `cat-${Date.now()}`,
      name: editingCategory.name.trim(),
      group: finalGroup,
    };

    try {
      setSaveStatus('Saving category to MongoDB Atlas...');
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.category) {
        await fetchLiveCategories();
        setEditingCategory(null);
        setCustomGroupInput('');
        setSaveStatus('Category saved permanently!');
      } else {
        alert(`Failed to save category: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert('Failed to save category');
    } finally {
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}" permanently?`)) return;

    try {
      setCategories((prev) => prev.filter((c) => c.id !== id && (c as any)._id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      const res = await fetch(`/api/categories?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchLiveCategories();
        setSaveStatus(`Category "${name}" deleted!`);
      } else {
        alert(`Failed to delete category: ${data.error || 'Unknown error'}`);
        await fetchLiveCategories();
      }
    } catch (err) {
      alert('Failed to delete category');
      await fetchLiveCategories();
    } finally {
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  // Checkbox Selection Logic
  const toggleSelectAll = () => {
    if (selectedIds.length === categories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Bulk Delete Multiple Checked Categories
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected categories permanently?`)) return;

    try {
      setIsDeletingBulk(true);
      setSaveStatus(`Deleting ${selectedIds.length} categories from MongoDB...`);

      // Execute batch deletes
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/categories?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
        )
      );

      setSelectedIds([]);
      await fetchLiveCategories();
      setSaveStatus(`Successfully deleted ${selectedIds.length} categories!`);
    } catch (err) {
      alert('Failed to delete selected categories');
      await fetchLiveCategories();
    } finally {
      setIsDeletingBulk(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Group categories dynamically by Parent Group
  const groupsMap: { [key: string]: CategoryInfo[] } = {};
  categories.forEach((cat) => {
    const groupName = cat.group || 'Celebration Cakes';
    if (!groupsMap[groupName]) groupsMap[groupName] = [];
    groupsMap[groupName].push(cat);
  });

  const availableGroups = Array.from(
    new Set([...DEFAULT_PARENT_GROUPS, ...Object.keys(groupsMap)])
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl text-charcoal-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-warmgray-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">Category Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Live MongoDB Sync</span>
            </span>
          </div>
          <p className="text-xs text-warmgray-500 font-medium mt-1">
            Parent & Child category hierarchy with multiple checkbox selection and bulk delete.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchLiveCategories}
            className="p-2.5 rounded-xl border border-warmgray-300 hover:border-gold-500 text-charcoal-900 bg-white shadow-xs"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleCreateNew}
            className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Dynamic Bulk Action Bar when Checkboxes are Ticked */}
      {selectedIds.length > 0 && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-red-600" />
            <span className="text-xs font-bold text-red-900">
              {selectedIds.length} {selectedIds.length === 1 ? 'category' : 'categories'} selected
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-lg border border-red-200 bg-white text-xs font-bold text-warmgray-700 hover:bg-warmgray-50"
            >
              Clear Selection
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={isDeletingBulk}
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeletingBulk ? 'Deleting Selected...' : `Delete Selected (${selectedIds.length})`}</span>
            </button>
          </div>
        </div>
      )}

      {saveStatus && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-2xl font-bold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Simplified Category Modal Form */}
      {editingCategory && (
        <div className="fixed inset-0 z-[1000] bg-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-warmgray-200 space-y-4 text-xs text-charcoal-900 scroll-lock-overlay animate-fade-in">
            
            <div className="flex justify-between items-center border-b border-warmgray-200 pb-3">
              <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center space-x-2">
                <FolderPlus className="w-5 h-5 text-gold-600" />
                <span>{editingCategory.name ? `Edit: ${editingCategory.name}` : 'Add New Category'}</span>
              </h3>
              <button onClick={() => setEditingCategory(null)} className="p-1 text-warmgray-400 hover:text-charcoal-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Category Name */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-warmgray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Birthday Cakes, Bento Cakes, Wedding Tiers"
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:border-gold-500 font-bold text-sm"
                />
              </div>

              {/* Parent Group Selection */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-warmgray-700 mb-1">
                  Parent Section / Group <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingCategory.group || 'Celebration Cakes'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val !== 'custom') {
                      setEditingCategory({ ...editingCategory, group: val });
                      setCustomGroupInput('');
                    } else {
                      setEditingCategory({ ...editingCategory, group: '' });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-warmgray-300 focus:outline-none focus:border-gold-500 font-bold bg-white text-sm"
                >
                  {availableGroups.map((grp) => (
                    <option key={grp} value={grp}>
                      📂 {grp}
                    </option>
                  ))}
                  <option value="custom">➕ Create New Custom Parent Group...</option>
                </select>
              </div>

              {/* Custom Parent Group Input if selected */}
              {(!editingCategory.group || !availableGroups.includes(editingCategory.group)) && (
                <div className="pt-1">
                  <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1">
                    New Parent Group Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Festival Specials, Gourmet Dessert Tubs"
                    value={customGroupInput || editingCategory.group || ''}
                    onChange={(e) => {
                      setCustomGroupInput(e.target.value);
                      setEditingCategory({ ...editingCategory, group: e.target.value });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold-400 bg-gold-50/40 focus:outline-none focus:border-gold-500 font-bold text-sm"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4 border-t border-warmgray-200">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-5 py-2.5 rounded-xl border border-warmgray-300 font-bold text-xs hover:bg-warmgray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  Save Category
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Clean Category List Table View */}
      {loading ? (
        <div className="py-12 text-center space-y-2">
          <RefreshCw className="w-6 h-6 text-gold-500 animate-spin mx-auto" />
          <p className="text-xs text-warmgray-500 font-medium">Loading live categories from MongoDB Atlas...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-warmgray-200 space-y-3">
          <Layers className="w-10 h-10 text-warmgray-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-charcoal-900">No Categories Found</h3>
          <p className="text-xs text-warmgray-500 max-w-md mx-auto">
            Your category list is currently empty. Click <strong>"Add Category"</strong> above to create your first cake category!
          </p>
          <button
            onClick={handleCreateNew}
            className="mt-2 px-5 py-2.5 rounded-xl bg-gold-500 text-white text-xs uppercase tracking-wider font-bold inline-flex items-center space-x-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Category</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Select All Checkbox Header */}
          <div className="bg-cream-100/70 px-5 py-3 rounded-2xl border border-warmgray-200 flex justify-between items-center text-xs font-bold text-charcoal-800">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.length === categories.length && categories.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-gold-600 rounded cursor-pointer"
              />
              <span>Select All Categories ({categories.length})</span>
            </label>

            {selectedIds.length > 0 && (
              <span className="text-gold-800 text-xs font-bold">
                {selectedIds.length} Selected
              </span>
            )}
          </div>

          {Object.keys(groupsMap).map((parentGroup) => {
            const childCats = groupsMap[parentGroup];
            return (
              <div key={parentGroup} className="bg-white rounded-2xl border border-warmgray-200 overflow-hidden shadow-xs">
                
                {/* Parent Group Header */}
                <div className="px-5 py-3.5 bg-gradient-to-r from-cream-100 via-cream-50 to-white border-b border-warmgray-200 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold-500"></span>
                    <h2 className="font-serif text-base font-bold text-charcoal-900">{parentGroup}</h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-cream-200 text-charcoal-800 text-[11px] font-bold">
                    {childCats.length} Categories
                  </span>
                </div>

                {/* Child Category Simple Table */}
                <div className="divide-y divide-warmgray-100">
                  {childCats.map((cat, idx) => {
                    const isChecked = selectedIds.includes(cat.id);
                    return (
                      <div
                        key={cat.id}
                        className={`px-5 py-3.5 flex items-center justify-between transition-colors ${
                          isChecked ? 'bg-amber-50/70 font-bold' : 'hover:bg-cream-50/60'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectOne(cat.id)}
                            className="w-4 h-4 accent-gold-600 rounded cursor-pointer flex-shrink-0"
                          />
                          <span className="text-xs font-mono font-bold text-warmgray-400 w-5 flex-shrink-0">{idx + 1}.</span>
                          <div className="truncate">
                            <h3 className="font-sans text-sm font-bold text-charcoal-900 truncate">{cat.name}</h3>
                            <span className="text-[10px] text-warmgray-500 font-mono">ID: {cat.id}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0 pl-2">
                          <button
                            onClick={() => {
                              setCustomGroupInput('');
                              setEditingCategory(cat);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-warmgray-300 hover:border-gold-500 hover:bg-gold-50 text-charcoal-900 text-xs font-bold inline-flex items-center space-x-1 transition-all"
                          >
                            <Edit className="w-3.5 h-3.5 text-gold-600" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-500 hover:bg-red-50 text-red-700 text-xs font-bold inline-flex items-center space-x-1 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
