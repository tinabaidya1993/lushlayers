import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import GoToTop from '@/components/ui/GoToTop';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Lush Layers | Made With Love',
    template: '%s | Lush Layers',
  },
  description: 'Ultra-luxurious bespoke wedding tiers, artisanal celebration cakes, and 100% eggless modern edible sculpture. Direct WhatsApp order booking.',
  keywords: ['Lush Layers', 'Made With Love', 'Luxury Cakes', 'Bespoke Wedding Cakes', 'Eggless Cakes Kolkata', 'Custom Cake Studio'],
  icons: {
    icon: [
      { url: '/logo.jpg', type: 'image/jpeg' },
    ],
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
      </head>
      <body className="bg-cream-100 text-charcoal-900 antialiased min-h-screen flex flex-col justify-between selection:bg-gold-500 selection:text-white max-w-full overflow-x-hidden">
        <Navbar />
        <div className="flex-grow w-full">{children}</div>
        <Footer />
        <FloatingWhatsApp />
        <GoToTop />
      </body>
    </html>
  );
}
