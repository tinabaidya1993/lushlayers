'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';

const GoToTop = dynamic(() => import('@/components/ui/GoToTop'), { ssr: false });
const FloatingReviewsModal = dynamic(() => import('@/components/ui/FloatingReviewsModal'), { ssr: false });

export default function PublicLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  // If in Admin Panel (/admin, /admin/login, /admin/orders, etc.), isolate completely from public website Header & Footer
  if (isAdminRoute) {
    return <div className="w-full min-h-screen bg-cream-50">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex-grow w-full">{children}</div>
      <Footer />
      <FloatingWhatsApp />
      <GoToTop />
      <FloatingReviewsModal />
    </>
  );
}
