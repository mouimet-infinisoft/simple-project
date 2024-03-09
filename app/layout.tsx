import { Metadata } from 'next';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { BrainStackProvider } from '../utils/BrainStackProvider';
import 'styles/main.css';

const meta = {
  title: 'iBrain One - Your AI Assistant',
  description:
    'Empowering conversations with AI-driven insights. Brought to you by iBrain One.',
  cardImage: '/og.png', // Ensure this image reflects your brand
  robots: 'follow, index',
  favicon: '/favicon.ico', // Ensure this icon is branded
  url: 'https://ibrain.one' // Your main website URL
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: meta.title,
    description: meta.description,
    referrer: 'origin-when-cross-origin',
    keywords: [
      'AI Assistant',
      'iBrain One',
      'Intelligent Conversations',
      'AI Insights'
    ],
    authors: [{ name: 'iBrain One', url: 'https://ibrain.one' }], // Your main website URL
    creator: 'iBrain One',
    publisher: 'iBrain One',
    robots: meta.robots,
    icons: { icon: meta.favicon },
    metadataBase: new URL(meta.url),
    openGraph: {
      url: meta.url,
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage], // Ensure this image is properly branded
      type: 'website',
      siteName: meta.title
    },
    twitter: {
      card: 'summary_large_image',
      site: '@InfinisoftI', // Your Twitter handle
      creator: '@InfinisoftI', // Your Twitter handle
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage] // Ensure this image is properly branded
    }
  };
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="bg-black loading">
        <Navbar />
        <BrainStackProvider>
          <main
            id="skip"
            className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)] mx-auto max-w-screen-lg px-4 md:px-0"
          >
            {children}
          </main>
        </BrainStackProvider>
        <Footer />
        <Suspense>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
