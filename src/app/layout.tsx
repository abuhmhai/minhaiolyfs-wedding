import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'NHUNGTRANG WEDDING STORE',
  description: 'Be Legendary. Be The One•Wedding dress•Ao dai•Wedding accessories• Classic & timeless design• Customize for brides in over 20 nations',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={cn("min-h-screen bg-white font-sans antialiased")}>
        <Header />
        <main className="relative">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
