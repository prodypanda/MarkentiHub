// pandamarket/frontend/src/app/(hub)/layout.tsx
import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PandaMarket | La 1ère Marketplace SaaS en Tunisie',
  description: 'Découvrez des milliers de produits locaux sur PandaMarket. Créez votre boutique en ligne ou achetez directement auprès des meilleurs vendeurs tunisiens.',
  openGraph: {
    title: 'PandaMarket | La Marketplace SaaS Tunisienne',
    description: 'Achetez et vendez facilement en ligne avec PandaMarket.',
    url: 'https://pandamarket.tn',
    siteName: 'PandaMarket',
    locale: 'fr_TN',
    type: 'website',
  },
};

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 140px)' }}>{children}</main>
      <Footer />
    </>
  );
}
