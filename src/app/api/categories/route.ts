import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { success: true, count: 0, categories: [] },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    const categories = await Category.find({}).sort({ createdAt: 1 }).lean();

    return NextResponse.json(
      {
        success: true,
        count: categories ? categories.length : 0,
        categories: categories || [],
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
        count: 0,
        categories: [],
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

    const id = body.id || body.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
    const group = body.group || 'Celebration Cakes';

    const newCategory = await Category.create({
      id,
      name: body.name.trim(),
      group: group.trim(),
    });

    try {
      revalidatePath('/', 'page');
      revalidatePath('/catalog', 'page');
      revalidatePath('/admin/categories', 'page');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      category: newCategory,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save category' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const id = body.id || body.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
    const group = body.group || 'Celebration Cakes';

    const updatedCategory = await Category.findOneAndUpdate(
      { $or: [{ id }, { name: body.name }] },
      {
        id,
        name: body.name.trim(),
        group: group.trim(),
      },
      { new: true, upsert: true }
    );

    try {
      revalidatePath('/', 'page');
      revalidatePath('/catalog', 'page');
      revalidatePath('/admin/categories', 'page');
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
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const filter = id.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ id: id }, { _id: id }] }
      : { id: id };

    const result = await Category.deleteOne(filter);

    try {
      revalidatePath('/', 'page');
      revalidatePath('/catalog', 'page');
      revalidatePath('/admin/categories', 'page');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Category ${id} deleted permanently`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete category' }, { status: 500 });
  }
}
