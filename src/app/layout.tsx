import type { Metadata } from 'next';
import PublicLayoutShell from '@/components/layout/PublicLayoutShell';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Lush Layers | Fresh 100% Eggless Home-Made Cakes by Tina Baidya',
    template: '%s | Lush Layers',
  },
  description: 'Freshly home-baked 100% eggless luxury cakes, bespoke wedding tiers, and artisanal birthday cakes by Tina Baidya in Kolkata. Home delivery available via WhatsApp booking.',
  keywords: ['Lush Layers', 'Tina Baidya', 'Home Made Cakes Kolkata', 'Eggless Home Bakery', 'Fresh Home Baked Cakes', 'Custom Cake Studio Kolkata'],
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
        <PublicLayoutShell>{children}</PublicLayoutShell>
      </body>
    </html>
  );
}
