'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  Image as ImageIcon,
  Copy,
  Trash2,
  Check,
  Search,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinaryClient';

interface UploadItem {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  cloudinaryUrl?: string;
  public_id?: string;
  errorMsg?: string;
}

export default function AdminMediaPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Media List
  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.success) {
        setMediaList(data.media || []);
      }
    } catch (err) {
      console.warn('Using local fallback media:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newItems: UploadItem[] = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: 'pending',
    }));

    setUploadQueue((prev) => [...prev, ...newItems]);
    // Auto start upload
    newItems.forEach((item) => uploadFileToCloudinary(item));
  };

  const uploadFileToCloudinary = async (item: UploadItem) => {
    setUploadQueue((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'uploading', progress: 25 } : i))
    );

    try {
      const formData = new FormData();
      formData.append('file', item.file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success && data.images?.[0]) {
        const uploaded = data.images[0];
        setUploadQueue((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: 'success',
                  progress: 100,
                  cloudinaryUrl: uploaded.secure_url || uploaded.url,
                  public_id: uploaded.public_id,
                }
              : i
          )
        );

        // Add to media list
        setMediaList((prev) => [uploaded, ...prev]);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setUploadQueue((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, status: 'error', progress: 0, errorMsg: err.message || 'Failed' }
            : i
        )
      );
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (publicId: string, id: string) => {
    if (!confirm('Are you sure you want to delete this image from Cloudinary CDN?')) return;

    try {
      await fetch(`/api/media?public_id=${encodeURIComponent(publicId)}`, {
        method: 'DELETE',
      });
      setMediaList((prev) => prev.filter((m) => m._id !== id && m.public_id !== publicId));
    } catch (err) {
      alert('Failed to delete image');
    }
  };

  const filteredMedia = mediaList.filter((m) =>
    (m.filename || m.public_id || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">Cloudinary Media Library</h1>
          <p className="text-xs text-warmgray-500 font-medium">
            Images uploaded here are stored directly on Cloudinary CDN with automatic WebP/AVIF compression.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center space-x-2 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Batch Upload Images</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
        />
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? 'border-gold-500 bg-gold-50/70 scale-[1.01]'
            : 'border-warmgray-300 bg-white hover:border-gold-400 hover:bg-cream-50'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center mx-auto mb-3">
          <Upload className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-lg font-bold text-charcoal-900">
          Drag & Drop Cake Images Here
        </h3>
        <p className="text-xs text-warmgray-500 mt-1">
          Supports Batch Multiple Uploads (JPG, PNG, WebP, AVIF, Max 10MB per file)
        </p>
      </div>

      {/* Real-time Upload Progress Queue */}
      {uploadQueue.length > 0 && (
        <div className="bg-white p-5 rounded-3xl border border-warmgray-200 shadow-sm space-y-3">
          <h4 className="font-serif text-sm font-bold text-charcoal-900 border-b border-warmgray-100 pb-2">
            Recent Upload Queue ({uploadQueue.filter((q) => q.status === 'success').length}/{uploadQueue.length})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {uploadQueue.map((item) => (
              <div key={item.id} className="p-3 bg-cream-50 rounded-2xl border border-warmgray-200 flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-warmgray-200">
                  <Image src={item.previewUrl} alt="Preview" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate text-charcoal-900">{item.file.name}</p>
                  <p className="text-[10px] text-warmgray-500">{(item.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  
                  {item.status === 'uploading' && (
                    <div className="w-full bg-warmgray-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-gold-500 h-full transition-all duration-300" style={{ width: `${item.progress}%` }} />
                    </div>
                  )}
                </div>

                <div>
                  {item.status === 'success' && <FileCheck className="w-5 h-5 text-emerald-600" />}
                  {item.status === 'error' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        uploadFileToCloudinary(item);
                      }}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Retry upload"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-warmgray-200 shadow-sm">
        <Search className="w-4 h-4 text-warmgray-400 ml-2" />
        <input
          type="text"
          placeholder="Search Cloudinary images by filename or public_id..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs focus:outline-none text-charcoal-900"
        />
      </div>

      {/* Cloudinary Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((media) => {
          const cdnUrl = media.secure_url || media.url;
          const displayUrl = getOptimizedCloudinaryUrl(cdnUrl, { width: 400, quality: 'auto' });

          return (
            <div
              key={media._id || media.public_id}
              className="bg-white rounded-2xl border border-warmgray-200 overflow-hidden shadow-sm hover:shadow-luxury-hover transition-all group flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-cream-100">
                <Image
                  src={displayUrl}
                  alt={media.filename || 'Cloudinary Cake Image'}
                  fill
                  sizes="300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(media.public_id, media._id)}
                    className="p-1.5 rounded-full bg-white/90 text-red-600 hover:bg-red-600 hover:text-white shadow-sm transition-colors"
                    title="Delete from Cloudinary"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3 text-xs space-y-1">
                <p className="font-bold text-charcoal-900 truncate">{media.filename || media.public_id}</p>
                <div className="flex justify-between items-center text-[10px] text-warmgray-500 font-mono">
                  <span>{media.width}x{media.height} px</span>
                  <span>{media.format?.toUpperCase()}</span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => handleCopy(cdnUrl, media._id || media.public_id)}
                    className="w-full py-1.5 px-3 rounded-xl border border-warmgray-300 hover:border-gold-500 text-charcoal-900 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1 transition-colors"
                  >
                    {copiedId === (media._id || media.public_id) ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-gold-600" />
                        <span>Copy CDN URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
