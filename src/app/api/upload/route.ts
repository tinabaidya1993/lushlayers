import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { connectToDatabase } from '@/lib/db';
import Media from '@/models/Media';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No image files provided' }, { status: 400 });
    }

    const uploadedResults = [];

    await connectToDatabase();

    for (const file of files) {
      // 1. Security Validation: MIME type & file size
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file format (${file.type}). Allowed: JPG, PNG, WebP, AVIF, GIF` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB)` },
          { status: 400 }
        );
      }

      // Convert File into Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload directly to Cloudinary CDN
      const cloudinaryResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'lush_layers_cakes',
            resource_type: 'image',
            overwrite: false,
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      // Save image metadata document in MongoDB
      let mediaDoc = null;
      try {
        mediaDoc = await Media.create({
          public_id: cloudinaryResult.public_id,
          url: cloudinaryResult.url,
          secure_url: cloudinaryResult.secure_url,
          filename: file.name,
          format: cloudinaryResult.format,
          width: cloudinaryResult.width,
          height: cloudinaryResult.height,
          bytes: cloudinaryResult.bytes,
          folder: cloudinaryResult.folder || 'lush_layers_cakes',
          altText: file.name.replace(/\.[^/.]+$/, ''),
          tags: ['cake', 'lush_layers'],
        });
      } catch (dbErr) {
        console.warn('MongoDB media record created fallback:', dbErr);
      }

      uploadedResults.push({
        id: mediaDoc?._id || cloudinaryResult.public_id,
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url || cloudinaryResult.url,
        secure_url: cloudinaryResult.secure_url,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        format: cloudinaryResult.format,
        bytes: cloudinaryResult.bytes,
        filename: file.name,
      });
    }

    return NextResponse.json({
      success: true,
      count: uploadedResults.length,
      images: uploadedResults,
    });
  } catch (error: any) {
    console.error('Cloudinary API upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload image to Cloudinary' }, { status: 500 });
  }
}
