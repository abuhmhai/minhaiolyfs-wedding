import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Toaster } from 'sonner';
import { NextAuthProvider } from '@/providers/NextAuthProvider';
import ClientBody from '@/components/client/ClientBody';
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: 'Wedding Dress Rental',
  description: 'Rent beautiful wedding dresses and traditional Vietnamese dresses for your special day',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <NextAuthProvider>
          <ClientBody>
            <Header />
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
            <Footer />
            <Toaster position="top-right" />
            <SpeedInsights />
          </ClientBody>
        </NextAuthProvider>
      </body>
    </html>
  );
}
