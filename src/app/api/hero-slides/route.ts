import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';
import { DEFAULT_HERO_SLIDES } from '@/data/heroSlides';

// In-memory cache for hero slides (TTL 60s)
let cachedHeroSlides: { timestamp: number; slides: any[] } | null = null;
const CACHE_TTL_MS = 60 * 1000;

export async function GET(req: NextRequest) {
  try {
    const now = Date.now();
    if (cachedHeroSlides && now - cachedHeroSlides.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(
        { success: true, count: cachedHeroSlides.slides.length, slides: cachedHeroSlides.slides, cached: true },
        { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
      );
    }

    await connectToDatabase();

    // Seed default hero slides if MongoDB Atlas collection is empty
    let slides = await HeroSlide.find({}).sort({ orderIndex: 1, createdAt: -1 }).lean();

    if (!slides || slides.length === 0) {
      console.log('Seeding initial Hero Slides data into MongoDB Atlas...');
      await HeroSlide.insertMany(DEFAULT_HERO_SLIDES);
      slides = await HeroSlide.find({}).sort({ orderIndex: 1, createdAt: -1 }).lean();
    }

    cachedHeroSlides = { timestamp: now, slides };

    return NextResponse.json(
      {
        success: true,
        count: slides.length,
        slides,
      },
      { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (error: any) {
    console.error('MongoDB Atlas HeroSlides GET error:', error);
    return NextResponse.json({
      success: true,
      count: DEFAULT_HERO_SLIDES.length,
      slides: DEFAULT_HERO_SLIDES,
      source: 'static_fallback',
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.cakeName || !body.image || !body.priceStartingFrom) {
      return NextResponse.json({ error: 'Missing required hero slide fields' }, { status: 400 });
    }

    const slideId = body.id || `hero-${Date.now().toString().slice(-6)}`;
    const newSlide = await HeroSlide.create({ ...body, id: slideId });

    cachedHeroSlides = null;

    try {
      revalidatePath('/');
    } catch (e) {
      // safe fallback
    }

    return NextResponse.json({
      success: true,
      slide: newSlide,
    });
  } catch (error: any) {
    console.error('HeroSlide POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create hero slide' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Slide ID is required' }, { status: 400 });
    }

    const updatedSlide = await HeroSlide.findOneAndUpdate({ id: body.id }, body, {
      new: true,
      upsert: true,
    });

    cachedHeroSlides = null;

    try {
      revalidatePath('/');
    } catch (e) {
      // safe fallback
    }

    return NextResponse.json({
      success: true,
      slide: updatedSlide,
    });
  } catch (error: any) {
    console.error('HeroSlide PUT error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update hero slide' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Slide ID is required' }, { status: 400 });
    }

    await HeroSlide.deleteOne({ id });

    cachedHeroSlides = null;

    try {
      revalidatePath('/');
    } catch (e) {
      // safe fallback
    }

    return NextResponse.json({
      success: true,
      message: `Hero Slide ${id} deleted`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete hero slide' }, { status: 500 });
  }
}
