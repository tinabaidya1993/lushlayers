'use client';

import React, { useState, useEffect } from 'react';
import { Star, X, Send, CheckCircle2, Sparkles, BadgeCheck } from 'lucide-react';

export default function FloatingReviewsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'read' | 'write'>('read');
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Submit Form State (All fields mandatory)
  const [customerName, setCustomerName] = useState('');
  const [orderId, setOrderId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Lock background body scroll when reviews modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

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
      console.warn('Feedback fetch error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !orderId.trim() || !comment.trim()) {
      alert('Please fill out all required fields: Name, Order ID, and Review Message.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          orderId,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitSuccess(true);
        setReviews((prev) => [data.review, ...prev]);
        setCustomerName('');
        setOrderId('');
        setComment('');
        setTimeout(() => setSubmitSuccess(false), 4000);
      } else {
        alert(data.error || 'Failed to submit feedback');
      }
    } catch (err) {
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = customerName.trim().length > 0 && orderId.trim().length > 0 && comment.trim().length > 0 && rating > 0;

  return (
    <>
      {/* SMALL ROUND CIRCULAR FLOATING REVIEWS BUTTON */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          fetchReviews();
        }}
        aria-label="Client Reviews & Feedback"
        className="fixed bottom-[112px] sm:bottom-[136px] right-4 sm:right-6 z-[95] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold-500 hover:bg-gold-600 text-white flex items-center justify-center shadow-luxury transition-all duration-300 hover:scale-110 active:scale-95 group cursor-pointer"
      >
        <span className="absolute inset-0 rounded-full bg-gold-400 animate-ping opacity-30 pointer-events-none"></span>
        <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current animate-pulse group-hover:rotate-12 transition-transform" />
      </button>

      {/* REVIEWS & FEEDBACK MODAL DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal-900/80 backdrop-blur-md animate-fade-in cursor-pointer"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-warmgray-200 shadow-2xl z-10 my-auto animate-fade-in overflow-hidden max-h-[85vh] flex flex-col">
            
            {/* Header with HIGH CONTRAST GOLDEN CLOSE BUTTON */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-charcoal-950 text-white flex justify-between items-center border-b border-gold-500/30">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center text-gold-400">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-gold-300">Client Praise & Reviews</h3>
                  <p className="text-[10px] text-warmgray-400">Verified Guest Reviews & Feedback</p>
                </div>
              </div>

              {/* HIGHLY VISIBLE GOLDEN CLOSE BUTTON */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full bg-gold-500 hover:bg-gold-400 text-charcoal-950 flex items-center justify-center font-bold transition-all shadow-md cursor-pointer border border-gold-300 active:scale-90"
                aria-label="Close reviews modal"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-warmgray-200 bg-cream-50 text-xs font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setActiveTab('read')}
                className={`flex-1 py-3 text-center transition-all cursor-pointer ${
                  activeTab === 'read'
                    ? 'bg-white text-gold-700 border-b-2 border-gold-500 shadow-xs'
                    : 'text-warmgray-500 hover:text-charcoal-900'
                }`}
              >
                Read Reviews ({reviews.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`flex-1 py-3 text-center transition-all cursor-pointer ${
                  activeTab === 'write'
                    ? 'bg-white text-gold-700 border-b-2 border-gold-500 shadow-xs'
                    : 'text-warmgray-500 hover:text-charcoal-900'
                }`}
              >
                + Write Feedback
              </button>
            </div>

            {/* Tab 1: Read Reviews */}
            {activeTab === 'read' && (
              <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 max-h-[60vh]">
                {loading ? (
                  <div className="text-center py-8 text-xs text-warmgray-500 font-medium">Loading verified client reviews...</div>
                ) : reviews.length > 0 ? (
                  reviews.map((rev, i) => (
                    <div key={rev._id || i} className="p-4 rounded-2xl bg-cream-50/80 border border-warmgray-200/80 space-y-2 text-xs">
                      {/* Customer Header */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-gold-100 border border-gold-300 text-gold-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {rev.customerName ? rev.customerName[0] : 'G'}
                          </div>
                          <div>
                            <p className="font-bold text-charcoal-900 leading-tight flex items-center text-sm">
                              <span>{rev.customerName}</span>
                              <BadgeCheck className="w-4 h-4 text-emerald-600 ml-1 inline" />
                            </p>
                            {rev.orderId && (
                              <span className="text-[10px] font-mono text-gold-700 font-bold">Order #{rev.orderId}</span>
                            )}
                          </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating || 5 }).map((_, starIdx) => (
                            <Star key={starIdx} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      {/* Clean Direct Review Text */}
                      <p className="text-xs text-charcoal-800 leading-relaxed pt-1 font-normal">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-warmgray-500">No client reviews yet. Be the first to share!</div>
                )}
              </div>
            )}

            {/* Tab 2: Write Feedback Form */}
            {activeTab === 'write' && (
              <form onSubmit={handleSubmitReview} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1 max-h-[60vh] text-xs">
                {submitSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Thank you! Your feedback has been saved directly to database.</span>
                  </div>
                )}

                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-800 font-medium">
                  ⚠️ Note: All 4 fields (Name, Order ID, Rating & Review) are strictly required to submit your feedback.
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-warmgray-600 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-warmgray-300 text-xs text-charcoal-900 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-warmgray-600 mb-1">
                    Order ID * (Required for Verification)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LL-894201"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-warmgray-300 text-xs font-mono font-bold text-charcoal-900 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-warmgray-600 mb-1">
                    Rating *
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-125 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${rating >= star ? 'fill-current text-amber-400' : 'text-warmgray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-warmgray-600 mb-1">
                    Your Review / Message *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your cake experience, flavor, packaging, or delivery..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-warmgray-300 text-xs text-charcoal-900 focus:outline-none focus:border-gold-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !isFormValid}
                  className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Saving Review...' : 'Submit Feedback'}</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
}
