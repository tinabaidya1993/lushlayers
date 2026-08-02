import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import Cake from '@/models/Cake';
import SiteSettings from '@/models/SiteSettings';
import { CAKES_DATA } from '@/data/cakes';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    let cakes = await Cake.find({}).sort({ createdAt: -1 }).lean();

    if (!cakes || cakes.length === 0) {
      console.log('Seeding initial cakes data into MongoDB Atlas...');
      await Cake.insertMany(CAKES_DATA);
      cakes = await Cake.find({}).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json(
      {
        success: true,
        count: cakes.length,
        cakes,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('MongoDB Atlas GET cakes error:', error);
    return NextResponse.json(
      {
        success: true,
        count: CAKES_DATA.length,
        cakes: CAKES_DATA,
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

    if (!body.id || !body.name || !body.priceStartingFrom) {
      return NextResponse.json({ error: 'Missing required cake fields' }, { status: 400 });
    }

    const newCake = await Cake.create(body);

    // On-Demand ISR Revalidation
    try {
      revalidatePath('/');
      revalidatePath('/catalog');
      revalidatePath(`/cake/${body.id}`);
    } catch (e) {}

    return NextResponse.json({
      success: true,
      cake: newCake,
    });
  } catch (error: any) {
    console.error('MongoDB Atlas POST cake error:', error);
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

    // On-Demand ISR Revalidation
    try {
      revalidatePath('/');
      revalidatePath('/catalog');
      revalidatePath(`/cake/${body.id}`);
    } catch (e) {}

    return NextResponse.json({
      success: true,
      cake: updatedCake,
    });
  } catch (error: any) {
    console.error('MongoDB Atlas PUT cake error:', error);
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

    const filter = id.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ id: id }, { _id: id }] }
      : { id: id };

    const result = await Cake.deleteOne(filter);

    // On-Demand ISR Revalidation
    try {
      revalidatePath('/');
      revalidatePath('/catalog');
      revalidatePath(`/cake/${id}`);
    } catch (e) {}

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Cake ${id} deleted from MongoDB Atlas`,
    });
  } catch (error: any) {
    console.error('MongoDB Atlas DELETE cake error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete cake' }, { status: 500 });
  }
}
