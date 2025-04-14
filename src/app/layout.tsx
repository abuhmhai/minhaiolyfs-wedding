import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wedding Dress Rental',
  description: 'Rent beautiful wedding dresses and áo dài for your special day',
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
      </head>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
