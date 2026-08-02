import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Feedback from '@/models/Feedback';

// Default initial seed reviews if database is empty
const INITIAL_REVIEWS = [
  {
    customerName: 'Elena & Marcus Vance',
    orderId: 'LL-894201',
    rating: 5,
    comment: 'Lush Layers created our 3-tiered wedding cake with 24K gold foil and elderflower cream. It was literally the centerpiece of our reception — guests loved the flavor!',
    isApproved: true,
  },
  {
    customerName: 'Sophia Sterling',
    orderId: 'LL-742109',
    rating: 5,
    comment: 'The direct WhatsApp custom ordering flow was so seamless. Selected the Earl Grey lavender sponge for my 30th birthday, delivered in flawless condition.',
    isApproved: true,
  },
  {
    customerName: 'David K. Chen',
    orderId: 'LL-619842',
    rating: 5,
    comment: 'Finding a luxury cake atelier that produces 100% eggless cakes without sacrificing rich texture was impossible until Lush Layers. Supreme craftsmanship.',
    isApproved: true,
  },
];

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    let reviews = await Feedback.find({ isApproved: true }).sort({ createdAt: -1 }).limit(50);

    // Auto seed if empty
    if (reviews.length === 0) {
      await Feedback.insertMany(INITIAL_REVIEWS);
      reviews = await Feedback.find({ isApproved: true }).sort({ createdAt: -1 });
    }

    return NextResponse.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      count: INITIAL_REVIEWS.length,
      reviews: INITIAL_REVIEWS,
      fallback: true,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { customerName, orderId, rating, comment } = body;

    if (!customerName || !comment) {
      return NextResponse.json({ error: 'Customer Name and Review Comment are required.' }, { status: 400 });
    }

    const newReview = await Feedback.create({
      customerName: customerName.trim(),
      orderId: (orderId || '').trim().toUpperCase(),
      rating: rating || 5,
      comment: comment.trim(),
      isApproved: true,
    });

    return NextResponse.json({
      success: true,
      review: newReview,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit review' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await Feedback.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete review' }, { status: 500 });
  }
}
