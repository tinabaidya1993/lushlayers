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

    await connectToDatabase();

    let settings = await SiteSettings.findOne({ key: 'main' }).lean();

    if (!settings) {
      // Auto-create default settings
      const created = await SiteSettings.create({ key: 'main' });
      settings = created.toObject();
    }

    cachedSettings = { timestamp: now, data: settings };

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch settings' }, { status: 500 });
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
