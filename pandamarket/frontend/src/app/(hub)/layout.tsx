// pandamarket/frontend/src/app/(hub)/layout.tsx
import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 140px)' }}>{children}</main>
      <Footer />
    </>
  );
}
