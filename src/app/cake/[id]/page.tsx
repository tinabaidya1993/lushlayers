import React from 'react';
import { notFound } from 'next/navigation';
import CakeDetailClient from './CakeDetailClient';
import { connectToDatabase } from '@/lib/db';
import Cake from '@/models/Cake';

export const revalidate = 0; // Dynamic live rendering for cake detail pages

export async function generateStaticParams() {
  try {
    const conn = await connectToDatabase();
    if (!conn) return [];
    const cakes = await Cake.find({}).select('id').lean();
    return cakes.map((c: any) => ({ id: c.id }));
  } catch (e) {
    return [];
  }
}

export default async function CakeDetailPage({ params }: { params: { id: string } }) {
  let cake: any = null;
  let relatedCakes: any[] = [];

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const rawCake = await Cake.findOne({
        $or: [{ id: params.id }, { _id: params.id.match(/^[0-9a-fA-F]{24}$/) ? params.id : null }],
      }).lean();

      if (rawCake) {
        cake = JSON.parse(JSON.stringify(rawCake));
        const rawRelated = await Cake.find({
          id: { $ne: cake.id },
          category: cake.category,
        })
          .limit(4)
          .lean();
        relatedCakes = JSON.parse(JSON.stringify(rawRelated));
      }
    }
  } catch (e) {
    console.warn('Cake detail DB fetch error:', e);
  }

  if (!cake) {
    notFound();
  }

  return <CakeDetailClient cake={cake} relatedCakes={relatedCakes} />;
}
