'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Sparkles, MessageCircle, Phone, MapPin, Clock, Search } from 'lucide-react';
import { useScrollLock } from '@/hooks/useScrollLock';
import WhatsAppInquiryModal from '@/components/ui/WhatsAppInquiryModal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Global Scroll Lock when mobile menu is active
  useScrollLock(mobileMenuOpen);

  // 3 Fast Clicks on Logo to Open Admin Panel
  const [clickCount, setClickCount] = useState<number>(0);

  const handleLogoTripleClick = (e: React.MouseEvent) => {
    setClickCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount >= 3) {
        e.preventDefault();
        router.push('/admin');
        return 0;
      }
      return nextCount;
    });
  };

  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Catalog', href: '/catalog' },
    { name: 'Categories', href: '/#categories' },
    { name: 'Track Order', href: '/track' },
    { name: 'Our Story', href: '/#story' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 transform-gpu ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-warmgray-200/80 py-2.5 shadow-sm'
            : 'bg-cream-100/90 backdrop-blur-sm py-3.5 border-b border-warmgray-200/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2">
            
            {/* Brand Logo & Title (3 Fast Clicks Triggers Admin Panel) */}
            <Link
              href="/"
              onClick={handleLogoTripleClick}
              className="group flex items-center space-x-2 focus:outline-none flex-shrink-0 cursor-pointer"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gold-500/40 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0 bg-charcoal-900">
                <Image
                  src="/logo.jpg"
                  alt="Lush Layers Official Logo"
                  fill
                  sizes="40px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-serif text-lg sm:text-xl xl:text-2xl tracking-tight text-charcoal-900 group-hover:text-gold-600 transition-colors font-bold leading-none">
                  Lush Layers
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-gold-600 font-sans font-bold mt-0.5">
                  Made With Love
                </span>
              </div>
            </Link>

            {/* Streamlined Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative text-[11px] tracking-[0.16em] uppercase transition-all duration-300 font-bold whitespace-nowrap py-1 px-1.5 rounded-lg ${
                      isActive
                        ? 'text-gold-600 bg-cream-200/60'
                        : 'text-charcoal-800 hover:text-gold-600 hover:bg-cream-100/80'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-1.5 right-1.5 h-0.5 bg-gold-500 rounded-full animate-fade-in" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 flex-shrink-0">
              
              {/* Premium Custom Studio Button */}
              <Link
                href="/custom-cake"
                className="group relative inline-flex items-center space-x-1.5 text-[10px] xl:text-[11px] uppercase tracking-wider font-bold py-2 px-3.5 xl:px-4 rounded-full border border-gold-400 text-gold-800 bg-gradient-to-r from-cream-50 via-white to-amber-50 shadow-xs hover:shadow-gold-soft hover:border-gold-500 hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap overflow-hidden flex-shrink-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse"></span>
                <Sparkles className="w-3.5 h-3.5 text-gold-600 group-hover:rotate-45 transition-transform duration-300" />
                <span className="relative z-10 font-bold">Custom Studio</span>
              </Link>

              {/* Dynamic Animated WhatsApp Action Button */}
              <button
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="group relative inline-flex items-center space-x-1.5 text-[10px] xl:text-[11px] uppercase tracking-wider font-bold py-2 px-3.5 xl:px-4 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white transition-all duration-300 shadow-sm hover:shadow-emerald-600/40 hover:scale-105 active:scale-95 whitespace-nowrap flex-shrink-0 overflow-hidden cursor-pointer"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                <MessageCircle className="w-3.5 h-3.5 text-white animate-bounce group-hover:scale-110 transition-transform" />
                <span className="relative z-10 font-bold">WhatsApp</span>
              </button>
            </div>

            {/* Mobile & Tablet Hamburger Toggle */}
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="p-2 rounded-full bg-emerald-600 text-white text-xs shadow-sm active:scale-95 cursor-pointer"
                aria-label="WhatsApp order"
              >
                <MessageCircle className="w-4 h-4 animate-pulse" />
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-xl transition-all border font-bold ${
                  mobileMenuOpen
                    ? 'bg-charcoal-900 text-gold-400 border-charcoal-900'
                    : 'bg-white text-charcoal-900 border-warmgray-300 hover:border-gold-500'
                }`}
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* FAILSAFE FIXED MOBILE & TABLET DROPDOWN MENU CONTAINER */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[60px] sm:top-[64px] z-[999] bg-white border-b border-warmgray-300 shadow-2xl animate-fade-in lg:hidden overflow-y-auto max-h-[calc(100vh-64px)] scroll-lock-overlay">
          <div className="max-w-4xl mx-auto px-4 py-5 space-y-4 bg-white text-charcoal-900">
            
            {/* Header Title inside Dropdown */}
            <div className="flex justify-between items-center pb-2 border-b border-warmgray-200">
              <div className="flex items-center space-x-2">
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gold-500">
                  <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
                </div>
                <span className="text-xs uppercase tracking-widest text-gold-700 font-bold">Lush Layers Menu</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-warmgray-500 hover:text-charcoal-900 text-xs font-bold uppercase tracking-wider flex items-center"
              >
                <span>Close</span>
                <X className="w-4 h-4 ml-1 text-charcoal-900" />
              </button>
            </div>

            {/* Menu Navigation Grid */}
            <nav className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-900">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3.5 rounded-2xl bg-cream-50 border border-warmgray-200 hover:border-gold-500 hover:bg-gold-50 transition-all flex items-center justify-between shadow-xs"
                >
                  <span>{link.name}</span>
                  <span className="text-gold-600 text-xs font-bold">→</span>
                </Link>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 border-t border-warmgray-200">
              <Link
                href="/custom-cake"
                onClick={() => setMobileMenuOpen(false)}
                className="group relative w-full text-center py-3.5 px-6 rounded-2xl border-2 border-gold-500 text-gold-700 text-xs uppercase tracking-widest font-bold bg-gold-50/70 flex items-center justify-center space-x-2 shadow-xs hover:bg-gold-500 hover:text-white transition-all overflow-hidden"
              >
                <Sparkles className="w-4 h-4 text-gold-600 group-hover:text-white animate-pulse" />
                <span>Custom Cake Studio</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsWhatsAppModalOpen(true);
                }}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-2xl bg-emerald-600 text-white text-xs uppercase tracking-widest font-bold shadow-md hover:bg-emerald-500 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 animate-bounce" />
                <span>Inquire via WhatsApp</span>
              </button>
            </div>

            {/* Contact Information */}
            <div className="pt-2 flex flex-col sm:flex-row justify-between items-center text-[11px] text-warmgray-700 font-semibold border-t border-warmgray-100 bg-cream-50 p-3 rounded-xl gap-2">
              <span className="flex items-center"><Phone className="w-3.5 h-3.5 text-gold-600 mr-1.5" /> +91 8768388868</span>
              <span className="flex items-center"><MapPin className="w-3.5 h-3.5 text-gold-600 mr-1.5" /> PB Road, Behala, Kolkata-41</span>
              <span className="flex items-center"><Clock className="w-3.5 h-3.5 text-gold-600 mr-1.5" /> Tue-Sun: 10AM-8PM</span>
            </div>

          </div>
        </div>
      )}

      {/* Solid Backdrop overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[990] bg-charcoal-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* WhatsApp Inquiry Form Modal */}
      <WhatsAppInquiryModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />
    </>
  );
}
