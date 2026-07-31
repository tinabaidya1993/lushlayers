'use client';

import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

const REVIEWS = [
  {
    quote: "Lush Layers created our 3-tiered wedding cake with 24K gold foil and elderflower cream. It was literally the centerpiece of our reception — guests loved the flavor!",
    author: "Elena & Marcus Vance",
    event: "Wedding at St. Regis",
    stars: 5,
  },
  {
    quote: "The direct WhatsApp custom ordering flow was so seamless. Selected the Earl Grey lavender sponge for my 30th birthday, delivered in flawless condition.",
    author: "Sophia Sterling",
    event: "30th Birthday Party",
    stars: 5,
  },
  {
    quote: "Finding a luxury cake atelier that produces plant-based cakes without sacrificing rich texture was impossible until Lush Layers. Supreme craftsmanship.",
    author: "David K. Chen",
    event: "Anniversary Event",
    stars: 5,
  }
];

export default function Testimonials() {
  return (
    <section className="py-10 sm:py-12 bg-white text-charcoal-900 relative border-t border-warmgray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 text-gold-700">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-bold tracking-tight">
              Client Praise
            </h2>
          </div>
          <span className="text-xs text-warmgray-500 font-medium">Verified Reviews</span>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {REVIEWS.map((rev, i) => (
            <div
              key={i}
              className="bg-cream-50 rounded-2xl p-4 sm:p-5 border border-warmgray-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex space-x-1 text-gold-500">
                    {[...Array(rev.stars)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-gold-400/40" />
                </div>

                <p className="text-xs text-warmgray-700 leading-relaxed italic mb-4">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-warmgray-200">
                <h4 className="font-serif text-sm font-bold text-charcoal-900">{rev.author}</h4>
                <p className="text-[10px] uppercase tracking-wider text-gold-700 font-bold">{rev.event}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
