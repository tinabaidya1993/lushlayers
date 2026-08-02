import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import Cake from '@/models/Cake';
import { CAKES_DATA } from '@/data/cakes';

// Serverless In-Memory Response Cache (TTL 60s)
let cachedCakesData: { timestamp: number; cakes: any[] } | null = null;
const CACHE_TTL_MS = 60 * 1000;

export async function GET(req: NextRequest) {
  try {
    const now = Date.now();
    if (cachedCakesData && now - cachedCakesData.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(
        { success: true, count: cachedCakesData.cakes.length, cakes: cachedCakesData.cakes, cached: true },
        { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
      );
    }

    await connectToDatabase();
    
    // Seed initial data if MongoDB database is empty & use lean query for fast performance
    let cakes = await Cake.find({}).sort({ createdAt: -1 }).lean();

    if (!cakes || cakes.length === 0) {
      console.log('Seeding initial cakes data into MongoDB Atlas...');
      await Cake.insertMany(CAKES_DATA);
      cakes = await Cake.find({}).sort({ createdAt: -1 }).lean();
    }

    cachedCakesData = { timestamp: now, cakes };

    return NextResponse.json(
      {
        success: true,
        count: cakes.length,
        cakes,
      },
      { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (error: any) {
    console.error('MongoDB Atlas GET error:', error);
    // Fallback to static CAKES_DATA if DB connection fails
    return NextResponse.json({
      success: true,
      count: CAKES_DATA.length,
      cakes: CAKES_DATA,
      source: 'static_fallback',
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.id || !body.name || !body.priceStartingFrom) {
      return NextResponse.json({ error: 'Missing required cake fields' }, { status: 400 });
    }

    const newCake = await Cake.create(body);

    // Invalidate in-memory cache
    cachedCakesData = null;

    // On-Demand ISR Revalidation
    try {
      revalidatePath('/');
      revalidatePath('/catalog');
      revalidatePath(`/cake/${body.id}`);
    } catch (e) {
      // safe fallback
    }

    return NextResponse.json({
      success: true,
      cake: newCake,
    });
  } catch (error: any) {
    console.error('MongoDB Atlas POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save cake to MongoDB' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Cake ID is required' }, { status: 400 });
    }

    const updatedCake = await Cake.findOneAndUpdate({ id: body.id }, body, {
      new: true,
      upsert: true,
    });

    // Invalidate in-memory cache
    cachedCakesData = null;

    // On-Demand ISR Revalidation
    try {
      revalidatePath('/');
      revalidatePath('/catalog');
      revalidatePath(`/cake/${body.id}`);
    } catch (e) {
      // safe fallback
    }

    return NextResponse.json({
      success: true,
      cake: updatedCake,
    });
  } catch (error: any) {
    console.error('MongoDB Atlas PUT error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update cake in MongoDB' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Cake ID is required' }, { status: 400 });
    }

    await Cake.deleteOne({ id });

    // Invalidate in-memory cache
    cachedCakesData = null;

    // On-Demand ISR Revalidation
    try {
      revalidatePath('/');
      revalidatePath('/catalog');
      revalidatePath(`/cake/${id}`);
    } catch (e) {
      // safe fallback
    }

    return NextResponse.json({
      success: true,
      message: `Cake ${id} deleted from MongoDB Atlas`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete cake' }, { status: 500 });
  }
}
