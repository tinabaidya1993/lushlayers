import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import Category from '@/models/Category';
import SiteSettings from '@/models/SiteSettings';
import { CATEGORIES } from '@/data/cakes';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    let categories = await Category.find({}).sort({ createdAt: 1 });

    if (!categories || categories.length === 0) {
      await Category.insertMany(CATEGORIES);
      categories = await Category.find({}).sort({ createdAt: 1 });
    }

    return NextResponse.json(
      {
        success: true,
        count: categories.length,
        categories,
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
        count: CATEGORIES.length,
        categories: CATEGORIES,
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

    if (!body.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const id = body.id || body.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCategory = await Category.create({ ...body, id });

    try {
      revalidatePath('/');
      revalidatePath('/catalog');
      revalidatePath('/admin/categories');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      category: newCategory,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save category to MongoDB' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const updatedCategory = await Category.findOneAndUpdate({ id: body.id }, body, {
      new: true,
      upsert: true,
    });

    try {
      revalidatePath('/');
      revalidatePath('/catalog');
      revalidatePath('/admin/categories');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      category: updatedCategory,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const result = await Category.deleteOne({ $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });

    try {
      revalidatePath('/');
      revalidatePath('/catalog');
      revalidatePath('/admin/categories');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Category ${id} deleted from MongoDB`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete category' }, { status: 500 });
  }
}
