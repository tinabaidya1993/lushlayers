import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import SiteSettings from '@/models/SiteSettings';

// In-memory cache (TTL 5 min)
let cachedSettings: { timestamp: number; data: any } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function GET() {
  try {
    const now = Date.now();
    if (cachedSettings && now - cachedSettings.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({ success: true, settings: cachedSettings.data, cached: true });
    }

    let conn = null;
    try {
      conn = await connectToDatabase();
    } catch (e) {
      console.warn('DB connection skipped for settings:', e);
    }

    if (conn) {
      let settings = await SiteSettings.findOne({ key: 'main' }).lean();

      if (!settings) {
        // Auto-create default settings
        const created = await SiteSettings.create({ key: 'main' });
        settings = created.toObject();
      }

      cachedSettings = { timestamp: now, data: settings };
      return NextResponse.json({ success: true, settings });
    }

    // Return cached or fallback if DB unreachable
    return NextResponse.json({
      success: true,
      settings: {
        key: 'main',
        siteName: 'Lush Layers (Made With Love)',
        whatsappNumber: '918768388868',
        supportEmail: 'concierge@lushlayers.com',
        boutiqueAddress: 'PB Road, Behala, Kolkata-41',
        openingHours: 'Tuesday - Sunday: 10:00 AM - 08:00 PM',
        accessories: [
          { id: 'candles', name: 'Birthday Candles Pack', emoji: '🎂', price: 50, active: true },
          { id: 'knife', name: 'Premium Cake Knife / Server', emoji: '🔪', price: 40, active: true },
          { id: 'balloons', name: 'Party Balloons (Pack of 5)', emoji: '🎈', price: 100, active: true },
          { id: 'sparklers', name: 'Golden Party Sparklers (Pack of 2)', emoji: '💖', price: 80, active: true },
          { id: 'crown', name: 'Birthday Crown / Sash', emoji: '👑', price: 120, active: true },
        ],
        ourStory: {
          badgeTagline: 'Made With Love & Passion',
          title: 'Artisanal Ingredients & 24K Gold Leafing',
          description: 'Freshly baked to order using authentic gourmet baking techniques, Valrhona single-origin chocolate, Madagascar bourbon vanilla pods, and organic berries.',
          bakerName: 'Tina Manna (Owner & Pastry Chef)',
          image1: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=85',
          image2: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=85',
        },
      },
      fallback: true,
    });
  } catch (error: any) {
    console.error('Settings GET error:', error);
    return NextResponse.json({
      success: true,
      settings: {
        key: 'main',
        accessories: [
          { id: 'candles', name: 'Birthday Candles Pack', emoji: '🎂', price: 50, active: true },
          { id: 'knife', name: 'Premium Cake Knife / Server', emoji: '🔪', price: 40, active: true },
          { id: 'balloons', name: 'Party Balloons (Pack of 5)', emoji: '🎈', price: 100, active: true },
          { id: 'sparklers', name: 'Golden Party Sparklers (Pack of 2)', emoji: '💖', price: 80, active: true },
          { id: 'crown', name: 'Birthday Crown / Sash', emoji: '👑', price: 120, active: true },
        ],
      },
      fallback: true,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const updated = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      { ...body, key: 'main' },
      { new: true, upsert: true }
    );

    cachedSettings = null; // invalidate cache

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save settings' }, { status: 500 });
  }
}
