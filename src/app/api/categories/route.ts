import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Category from '@/models/Category';
import { CATEGORIES } from '@/data/cakes';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Seed initial categories if DB is empty
    let categories = await Category.find({}).sort({ createdAt: 1 });

    if (!categories || categories.length === 0) {
      await Category.insertMany(CATEGORIES);
      categories = await Category.find({}).sort({ createdAt: 1 });
    }

    return NextResponse.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      count: CATEGORIES.length,
      categories: CATEGORIES,
      source: 'static_fallback',
    });
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

    await Category.deleteOne({ id });

    return NextResponse.json({
      success: true,
      message: `Category ${id} deleted from MongoDB`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete category' }, { status: 500 });
  }
}
