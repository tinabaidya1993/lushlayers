'use client';

import React, { useState, useEffect } from 'react';
import { Star, Trash2, Search, RefreshCw, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminFeedbackPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (data.success && data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.warn('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const res = await fetch(`/api/feedback?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews((prev) => prev.filter((r) => r._id !== id));
      } else {
        alert('Failed to delete review');
      }
    } catch (err) {
      alert('Error deleting review');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.customerName.toLowerCase().includes(q) ||
      (r.orderId && r.orderId.toLowerCase().includes(q)) ||
      r.comment.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-warmgray-200 pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-bold">
            Customer Feedback & Reviews Management
          </h1>
          <p className="text-xs text-warmgray-500 font-medium">
            Manage verified client reviews submitted via website or floating reviews drawer.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          className="px-4 py-2 rounded-xl bg-white border border-warmgray-300 text-xs font-bold text-charcoal-900 flex items-center space-x-1.5 shadow-xs hover:border-gold-500 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-warmgray-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by customer name, Order ID, or review text..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-warmgray-300 text-xs text-charcoal-900 focus:outline-none focus:border-gold-500 bg-white"
        />
      </div>

      {/* Reviews Table */}
      <div className="bg-white border border-warmgray-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-warmgray-500 font-medium">Loading reviews from database...</div>
        ) : filteredReviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-cream-100/70 border-b border-warmgray-200 text-[11px] font-bold uppercase tracking-wider text-warmgray-700">
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Review Comment</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmgray-200">
                {filteredReviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-charcoal-900">{rev.customerName}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-warmgray-600">
                      {rev.orderId ? `#${rev.orderId}` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-warmgray-700 max-w-sm italic">
                      "{rev.comment}"
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(rev._id)}
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-warmgray-500">No reviews found matching query.</div>
        )}
      </div>

    </div>
  );
}
