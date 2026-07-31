import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { connectToDatabase } from '@/lib/db';
import Media from '@/models/Media';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const mediaItems = await Media.find({}).sort({ createdAt: -1 }).limit(100);

    return NextResponse.json({
      success: true,
      count: mediaItems.length,
      media: mediaItems,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch media' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get('public_id');

    if (!publicId) {
      return NextResponse.json({ error: 'public_id is required' }, { status: 400 });
    }

    // 1. Delete image from Cloudinary CDN
    await cloudinary.uploader.destroy(publicId);

    // 2. Delete metadata from MongoDB
    await connectToDatabase();
    await Media.deleteOne({ public_id: publicId });

    return NextResponse.json({
      success: true,
      message: `Image ${publicId} deleted successfully from Cloudinary & MongoDB`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete image' }, { status: 500 });
  }
}
