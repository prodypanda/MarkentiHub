import React from 'react';
import { headers } from 'next/headers';
import '@/styles/themes.css';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const themeId = headersList.get('x-pd-store-theme') || 'minimal';
  const storeName = headersList.get('x-pd-store-name') || 'Ma Boutique';

  // The CSS class dictates the theme variables (Minimal, Classic, Modern)
  const themeClass = `theme-${themeId}`;

  return (
    <div className={themeClass} style={{
      backgroundColor: 'var(--store-bg)',
      color: 'var(--store-text)',
      fontFamily: 'var(--store-font)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Dynamic Themed Header */}
      <header style={{ 
        backgroundColor: 'var(--store-header-bg)', 
        color: 'var(--store-header-text)',
        borderBottom: '1px solid var(--store-border)',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{storeName}</h1>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Accueil</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Catalogue</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Contact</a>
        </nav>
      </header>
      
      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', flex: 1, width: '100%' }}>
        {children}
      </main>

      <footer style={{ 
        marginTop: 'auto', 
        padding: '40px', 
        borderTop: '1px solid var(--store-border)', 
        textAlign: 'center',
        backgroundColor: 'var(--store-bg)' 
      }}>
        <p>© {new Date().getFullYear()} {storeName}. Propulsé par PandaMarket.</p>
      </footer>
    </div>
  );
}
