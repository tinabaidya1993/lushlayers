import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import Cake from '@/models/Cake';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { success: true, count: 0, cakes: [] },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    const cakes = await Cake.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      {
        success: true,
        count: cakes ? cakes.length : 0,
        cakes: cakes || [],
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('MongoDB GET cakes error:', error);
    return NextResponse.json(
      {
        success: false,
        count: 0,
        cakes: [],
        error: error.message || 'Failed to fetch cakes from MongoDB',
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

    if (!body.id || !body.name || !body.priceStartingFrom) {
      return NextResponse.json({ error: 'Missing required cake fields' }, { status: 400 });
    }

    const newCake = await Cake.create(body);

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
