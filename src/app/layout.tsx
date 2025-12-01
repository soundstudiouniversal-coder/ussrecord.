
import type {Metadata} from 'next';
import './globals.css';
import { AppProviders } from '@/providers/AppProviders';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster"
import { GlitchEffect } from '@/components/GlitchEffect';
import { InteractiveMeteors } from '@/components/InteractiveMeteors';
import { CustomCursor } from '@/components/CustomCursor';

export const metadata: Metadata = {
  title: 'Universal Sound Studio',
  description: 'The universe is the next level artist',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased">
        <AppProviders>
          <CustomCursor />
          <InteractiveMeteors />
          <GlitchEffect />
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow w-full max-w-5xl mx-auto px-4 md:px-8">
                {children}
            </div>
            <Footer />
          </div>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
