import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BillMate — Simple Digital Receipt Generator',
  description:
    'Create professional digital receipts for your business. Calculate totals, manage GST, save receipts, and print or export them easily.',
  keywords: [
    'receipt generator',
    'digital receipt',
    'invoice maker',
    'gst invoice generator',
    'small business receipts',
    'billmate',
  ],
  authors: [{ name: 'BillMate Team' }],
};

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#09070f] text-slate-100 selection:bg-violet-500 selection:text-white transition-colors">
        <ToastProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
