'use client';

import React from 'react';
import Image from 'next/image';
import { CustomizationSelection } from '@/types';
import { Sparkles, Layers } from 'lucide-react';

interface RealisticCakeCanvasProps {
  selection: CustomizationSelection;
  estimatedPrice: number;
}

export default function RealisticCakeCanvas({ selection, estimatedPrice }: RealisticCakeCanvasProps) {

  // 1. DYNAMIC SPONGE FLAVOR COLORS (Changes sponge cutout & inner layer accents!)
  const getSpongeTheme = () => {
    const sponge = (selection.spongeFlavor || '').toLowerCase();
    if (sponge.includes('chocolate') || sponge.includes('cocoa')) {
      return { spongeBg: '#2D150B', spongeName: 'Belgian Dark Chocolate', layerBorder: '#4A2818' };
    }
    if (sponge.includes('red velvet')) {
      return { spongeBg: '#7A141D', spongeName: 'Crimson Red Velvet', layerBorder: '#9E1F2A' };
    }
    if (sponge.includes('lemon') || sponge.includes('citrus')) {
      return { spongeBg: '#E2BF42', spongeName: 'Sicilian Lemon Zest', layerBorder: '#F0D465' };
    }
    if (sponge.includes('matcha') || sponge.includes('green tea')) {
      return { spongeBg: '#486B38', spongeName: 'Kyoto Matcha Green Tea', layerBorder: '#618C4D' };
    }
    if (sponge.includes('earl grey') || sponge.includes('lavender')) {
      return { spongeBg: '#6B587B', spongeName: 'Earl Grey Lavender', layerBorder: '#836F94' };
    }
    // Default Vanilla Bean
    return { spongeBg: '#E3C594', spongeName: 'Madagascar Vanilla Bean', layerBorder: '#F3D9AB' };
  };

  // 2. DYNAMIC FILLING FLAVOR COLORS
  const getFillingTheme = () => {
    const filling = (selection.fillingFlavor || '').toLowerCase();
    if (filling.includes('chocolate') || filling.includes('ganache')) return '#1B0C07';
    if (filling.includes('berry') || filling.includes('raspberry') || filling.includes('compote')) return '#911339';
    if (filling.includes('caramel') || filling.includes('dulce')) return '#B86F28';
    if (filling.includes('pistachio')) return '#7B9A57';
    return '#FFF9EE'; // Vanilla Cream
  };

  // 3. DYNAMIC COLOR PALETTE & FROSTING FINISH (Changes main tier icing & drips!)
  const getPaletteStyle = () => {
    switch (selection.colorPalette) {
      case 'Soft Pastel Pink & Cream':
        return {
          icingBg: 'bg-gradient-to-r from-pink-300 via-rose-100 to-pink-300',
          dripBg: 'bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600',
          borderColor: 'border-pink-400',
          textColor: 'text-pink-950',
          plaqueBg: 'bg-white text-pink-950 border-pink-400 shadow-md',
          accentText: 'Soft Pastel Pink',
        };
      case 'Midnight Black & 24K Gold':
        return {
          icingBg: 'bg-gradient-to-r from-neutral-950 via-charcoal-900 to-neutral-950',
          dripBg: 'bg-gradient-to-r from-gold-300 via-yellow-100 to-gold-500',
          borderColor: 'border-gold-400',
          textColor: 'text-gold-300',
          plaqueBg: 'bg-gold-500 text-charcoal-950 border-gold-300 shadow-md',
          accentText: 'Midnight Black & Gold',
        };
      case 'Emerald Green & Gold Leaf':
        return {
          icingBg: 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950',
          dripBg: 'bg-gradient-to-r from-gold-300 via-yellow-100 to-gold-500',
          borderColor: 'border-gold-400',
          textColor: 'text-gold-200',
          plaqueBg: 'bg-gold-500 text-emerald-950 border-gold-300 shadow-md',
          accentText: 'Emerald & Gold',
        };
      case 'Lavender Mist & Silver':
        return {
          icingBg: 'bg-gradient-to-r from-purple-300 via-purple-100 to-indigo-300',
          dripBg: 'bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-600',
          borderColor: 'border-purple-400',
          textColor: 'text-purple-950',
          plaqueBg: 'bg-white text-purple-950 border-purple-400 shadow-md',
          accentText: 'Lavender Mist',
        };
      default: // Pure White & 24K Gold Foil
        return {
          icingBg: 'bg-gradient-to-r from-amber-50 via-white to-cream-100',
          dripBg: 'bg-gradient-to-r from-gold-400 via-amber-200 to-gold-500',
          borderColor: 'border-gold-400',
          textColor: 'text-charcoal-900',
          plaqueBg: 'bg-charcoal-900 text-gold-400 border-gold-500 shadow-md',
          accentText: 'Pure White & Gold',
        };
    }
  };

  const sponge = getSpongeTheme();
  const fillingColor = getFillingTheme();
  const palette = getPaletteStyle();

  const isSemiNaked = selection.frostingStyle === 'Semi-Naked Rustic Finish';
  const isRosettes = selection.frostingStyle === 'Textured Rosette Swirls';
  const isConcrete = selection.frostingStyle === 'Artisanal Concrete Finish';

  const hasGoldLeaf = selection.toppings.some((t) => t.toLowerCase().includes('gold') || t.toLowerCase().includes('leaf'));
  const hasRoses = selection.toppings.some((t) => t.toLowerCase().includes('rose') || t.toLowerCase().includes('flower'));
  const hasPearls = selection.toppings.some((t) => t.toLowerCase().includes('pearl'));
  const hasMacarons = selection.toppings.some((t) => t.toLowerCase().includes('macaron'));

  // Render individual cake tier with inner sponge cutout & frosting theme
  const renderTier = (tierWidthClass: string, tierHeightClass: string, isTopTier: boolean = false) => {
    return (
      <div
        className={`relative ${tierWidthClass} ${tierHeightClass} ${
          selection.shape === 'square'
            ? 'rounded-lg'
            : selection.shape === 'heart'
            ? 'rounded-t-[35%] rounded-b-[10%]'
            : selection.shape === 'hexagonal'
            ? 'rounded-2xl clip-hexagon'
            : 'rounded-2xl'
        } ${palette.icingBg} border-2 ${palette.borderColor} shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-700 relative`}
      >
        {/* Semi-Naked Exposed Sponge & Filling Layers */}
        {isSemiNaked ? (
          <div className="w-full h-full flex flex-col justify-around py-1 px-1 opacity-95 z-10">
            <div className="w-full h-2.5 rounded-xs transition-colors duration-500" style={{ backgroundColor: sponge.spongeBg }}></div>
            <div className="w-full h-1 rounded-xs transition-colors duration-500" style={{ backgroundColor: fillingColor }}></div>
            <div className="w-full h-2.5 rounded-xs transition-colors duration-500" style={{ backgroundColor: sponge.spongeBg }}></div>
            <div className="w-full h-1 rounded-xs transition-colors duration-500" style={{ backgroundColor: fillingColor }}></div>
            <div className="w-full h-2.5 rounded-xs transition-colors duration-500" style={{ backgroundColor: sponge.spongeBg }}></div>
          </div>
        ) : (
          /* Sponge Color Cutout Window (Shows sponge flavor inside smooth frosting) */
          <div
            className="absolute left-2 right-2 top-2 bottom-2 rounded-xl opacity-90 border transition-all duration-700 flex flex-col justify-center items-center overflow-hidden"
            style={{ backgroundColor: sponge.spongeBg, borderColor: sponge.layerBorder }}
          >
            {/* Sponge Flavor Label Overlay */}
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/90 drop-shadow-sm px-2 py-0.5 bg-black/30 rounded-full">
              {sponge.spongeName}
            </span>
          </div>
        )}

        {/* Concrete Finish Texture */}
        {isConcrete && (
          <div className="absolute inset-0 bg-stone-900/30 mix-blend-overlay pointer-events-none"></div>
        )}

        {/* Rosette Swirls Texture */}
        {isRosettes && (
          <div className="absolute inset-0 flex flex-wrap justify-around items-center opacity-40 pointer-events-none p-1 z-20">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="text-xs">🌸</span>
            ))}
          </div>
        )}

        {/* Gold Leaf Overlays */}
        {hasGoldLeaf && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute top-2 left-3 w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-300 via-amber-100 to-yellow-500 opacity-90 shadow-sm animate-pulse"></div>
            <div className="absolute bottom-2 right-4 w-5 h-5 rounded-full bg-gradient-to-br from-yellow-200 via-amber-300 to-yellow-600 opacity-90 shadow-sm"></div>
          </div>
        )}

        {/* Plaque Message Lettering */}
        {!isTopTier && selection.customMessage && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center z-30 px-2">
            <div className={`px-3 py-1 rounded-full border text-[10px] font-serif font-bold italic tracking-wide truncate max-w-[90%] ${palette.plaqueBg}`}>
              "{selection.customMessage}"
            </div>
          </div>
        )}

        {/* Pearl Border Accent */}
        {hasPearls && (
          <div className="absolute bottom-0 inset-x-1 flex justify-around items-center z-20 pb-0.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-white border border-warmgray-300 shadow-xs"></span>
            ))}
          </div>
        )}

        {/* Top Icing Drip */}
        <div className={`absolute top-0 inset-x-0 h-3 ${palette.dripBg} opacity-90 rounded-t-xl shadow-xs z-20`}></div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-warmgray-300 shadow-luxury space-y-4">
      
      {/* Canvas Header */}
      <div className="flex justify-between items-center border-b border-warmgray-100 pb-2.5">
        <span className="text-[11px] uppercase tracking-widest text-gold-700 font-bold flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-gold-600 animate-spin" />
          <span>Real-Time Photorealistic Atelier</span>
        </span>
        <span className="text-[10px] text-warmgray-500 font-mono font-bold bg-cream-100 px-2.5 py-0.5 rounded-full border border-warmgray-200">
          3D Live Preview
        </span>
      </div>

      {/* Realistic Cake Render Podium */}
      <div className="relative aspect-square rounded-2xl bg-gradient-to-b from-cream-100 via-warmgray-100 to-cream-200 border border-warmgray-200 p-4 sm:p-6 flex flex-col items-center justify-end overflow-hidden shadow-inner">
        
        {/* Studio Ambient Backlight */}
        <div className="absolute inset-0 bg-radial-vignette opacity-30 pointer-events-none"></div>

        {/* Reference Image Badge Overlay */}
        {selection.referenceImageUrl && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-gold-400 shadow-md flex items-center space-x-2 z-40 animate-fade-in">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-warmgray-200 flex-shrink-0">
              <Image src={selection.referenceImageUrl} alt="Reference photo" fill className="object-cover" />
            </div>
            <div className="pr-1">
              <p className="text-[9px] font-bold text-charcoal-900 leading-tight">Photo Attached</p>
              <p className="text-[8px] text-gold-700 font-semibold">Reference Design</p>
            </div>
          </div>
        )}

        {/* Shape & Structure Badge */}
        <div className="absolute top-3 right-3 bg-charcoal-900 text-gold-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm z-40">
          {selection.tiers} Tier(s) • {selection.shape}
        </div>

        {/* DYNAMIC REALISTIC CAKE STRUCTURE */}
        <div className="w-full flex flex-col items-center justify-end space-y-1.5 z-20 py-2 max-h-[85%]">
          
          {/* TOPPER ACCENTS (Roses / Macarons / Gold Flakes) */}
          <div className="flex items-center justify-center space-x-2 z-30 mb-[-6px] animate-fade-in">
            {hasRoses && (
              <span className="text-2xl filter drop-shadow-md animate-bounce">🌹</span>
            )}
            {hasMacarons && (
              <span className="text-xl filter drop-shadow-md">🍥</span>
            )}
            {hasGoldLeaf && (
              <span className="text-lg text-gold-400 filter drop-shadow-md">✨</span>
            )}
          </div>

          {/* 3RD TIER (Top Tier for 3 Tiers) */}
          {selection.tiers === 3 && renderTier('w-28 sm:w-32', 'h-16 sm:h-20', true)}

          {/* 2ND TIER (Middle Tier for 2 or 3 Tiers) */}
          {(selection.tiers === 2 || selection.tiers === 3) && renderTier('w-40 sm:w-48', 'h-20 sm:h-24', false)}

          {/* BASE TIER (1st Tier) */}
          {renderTier('w-56 sm:w-64', selection.tiers === 1.5 ? 'h-32 sm:h-36' : 'h-24 sm:h-28', false)}

        </div>

        {/* Realistic Silver Stand Podium */}
        <div className="w-64 sm:w-72 h-4 bg-gradient-to-r from-warmgray-300 via-white to-warmgray-400 rounded-t-xl border-t border-warmgray-300 shadow-md flex items-center justify-center z-10">
          <div className="w-24 h-1 bg-warmgray-400 rounded-full"></div>
        </div>
        <div className="w-72 sm:w-80 h-3 bg-charcoal-900/30 rounded-full blur-xs"></div>

      </div>

      {/* Live Specifications Footer */}
      <div className="p-3 bg-cream-50 rounded-2xl border border-warmgray-200 text-xs space-y-1">
        <div className="flex justify-between items-center">
          <span className="font-bold text-charcoal-900 text-xs">Live Color & Sponge:</span>
          <span className="font-serif font-bold text-gold-700 text-base">₹{estimatedPrice.toLocaleString()}</span>
        </div>
        <p className="text-[11px] text-warmgray-600 font-medium truncate">
          <span className="font-bold text-charcoal-900">{sponge.spongeName}</span> • {palette.accentText}
        </p>
      </div>

    </div>
  );
}
