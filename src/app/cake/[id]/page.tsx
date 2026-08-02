import React from 'react';
import { getCakeById, CAKES_DATA } from '@/data/cakes';
import { notFound } from 'next/navigation';
import CakeDetailClient from './CakeDetailClient';

// SSG (Static Site Generation) + ISR (Incremental Static Regeneration)
export const revalidate = 60; // Revalidate background HTML cache every 60 seconds
export const dynamicParams = true; // Support newly added MongoDB cakes statically cached on first visit

export async function generateStaticParams() {
  return CAKES_DATA.map((cake) => ({
    id: cake.id,
  }));
}

export default async function CakeDetailPage({ params }: { params: { id: string } }) {
  const cake = getCakeById(params.id);

  if (!cake) {
    notFound();
  }

  const relatedCakes = CAKES_DATA.filter((c) => c.id !== cake.id && c.category === cake.category).slice(0, 4);

  return <CakeDetailClient cake={cake} relatedCakes={relatedCakes} />;
}
