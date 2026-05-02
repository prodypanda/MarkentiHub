// pandamarket/frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'PandaMarket — Marketplace Tunisien',
    template: '%s | PandaMarket',
  },
  description:
    'PandaMarket est la première plateforme marketplace hybride en Tunisie. Créez votre boutique en ligne gratuite et vendez vos produits à travers le Hub central.',
  keywords: [
    'marketplace tunisie',
    'boutique en ligne tunisie',
    'vendre en ligne',
    'e-commerce tunisien',
    'pandamarket',
    'flouci',
    'konnect',
  ],
  authors: [{ name: 'PandaMarket' }],
  openGraph: {
    type: 'website',
    locale: 'fr_TN',
    siteName: 'PandaMarket',
    title: 'PandaMarket — Marketplace Tunisien',
    description: 'Créez votre boutique en ligne. Vendez sur le Hub central.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
