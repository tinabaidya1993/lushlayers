import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';
import SiteSettings from '@/models/SiteSettings';
import { DEFAULT_HERO_SLIDES } from '@/data/heroSlides';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    let slides = await HeroSlide.find({}).sort({ orderIndex: 1, createdAt: -1 }).lean();

    if (!slides || slides.length === 0) {
      await HeroSlide.insertMany(DEFAULT_HERO_SLIDES);
      slides = await HeroSlide.find({}).sort({ orderIndex: 1, createdAt: -1 }).lean();
    }

    return NextResponse.json(
      {
        success: true,
        count: slides.length,
        slides,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: true,
        count: DEFAULT_HERO_SLIDES.length,
        slides: DEFAULT_HERO_SLIDES,
        source: 'static_fallback',
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
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

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      slide: newSlide,
    });
  } catch (error: any) {
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

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      slide: updatedSlide,
    });
  } catch (error: any) {
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

    const result = await HeroSlide.deleteOne({ $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Hero Slide ${id} deleted`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete hero slide' }, { status: 500 });
  }
}
