'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function GoToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Go to top"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[90] w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-charcoal-900 text-gold-400 border border-gold-500/50 shadow-luxury hover:bg-gold-500 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group transform-gpu cursor-pointer"
    >
      <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
    </button>
  );
}
