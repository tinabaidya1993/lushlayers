import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import Cake from '@/models/Cake';

// In-memory cache for ultra-fast ISR performance (1 min TTL)
let cachedCakesData: { timestamp: number; data: any[] } | null = null;
const CACHE_TTL_MS = 60 * 1000;

export async function GET(req: NextRequest) {
  try {
    const now = Date.now();
    
    // Serve from ultra-fast in-memory cache if fresh
    if (cachedCakesData && now - cachedCakesData.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(
        {
          success: true,
          count: cachedCakesData.data.length,
          cakes: cachedCakesData.data,
          cached: true,
        },
        {
          headers: {
            'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
          },
        }
      );
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, count: 0, cakes: [] });
    }

    const cakes = await Cake.find({}).sort({ createdAt: -1 }).lean();

    cachedCakesData = { timestamp: now, data: cakes || [] };

    return NextResponse.json(
      {
        success: true,
        count: cakes ? cakes.length : 0,
        cakes: cakes || [],
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error: any) {
    console.error('MongoDB GET cakes error:', error);
    return NextResponse.json(
      {
        success: true,
        count: cachedCakesData ? cachedCakesData.data.length : 0,
        cakes: cachedCakesData ? cachedCakesData.data : [],
        fallback: true,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
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

    cachedCakesData = null; // Invalidate cache

    // On-Demand ISR Revalidation
    try {
      revalidatePath('/', 'page');
      revalidatePath('/catalog', 'page');
      revalidatePath(`/cake/${body.id}`, 'page');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      cake: newCake,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save cake' }, { status: 500 });
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

    cachedCakesData = null; // Invalidate cache

    // On-Demand ISR Revalidation
    try {
      revalidatePath('/', 'page');
      revalidatePath('/catalog', 'page');
      revalidatePath(`/cake/${body.id}`, 'page');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      cake: updatedCake,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update cake' }, { status: 500 });
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

    const result = await Cake.deleteOne({ $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });

    cachedCakesData = null; // Invalidate cache

    // On-Demand ISR Revalidation
    try {
      revalidatePath('/', 'page');
      revalidatePath('/catalog', 'page');
      revalidatePath(`/cake/${id}`, 'page');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Cake ${id} deleted from MongoDB`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete cake' }, { status: 500 });
  }
}
