import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  const linkStyle: React.CSSProperties = {
    color: 'var(--pd-text-secondary)', fontSize: 'var(--pd-fs-sm)',
    transition: 'color var(--pd-transition)',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: 'var(--pd-fs-sm)', fontWeight: 700,
    color: 'var(--pd-text-primary)', marginBottom: 12,
    textTransform: 'uppercase' as const, letterSpacing: '0.05em',
  };

  return (
    <footer style={{
      borderTop: '1px solid var(--pd-border)',
      backgroundColor: 'var(--pd-bg-secondary)',
      padding: '48px 24px 24px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>🐼</span>
              <span style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 800 }}>
                Panda<span style={{ color: 'var(--pd-green)' }}>Market</span>
              </span>
            </div>
            <p style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)', lineHeight: 1.6 }}>
              La première plateforme marketplace hybride en Tunisie.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h4 style={headingStyle}>Marketplace</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/search" style={linkStyle}>Tous les produits</Link>
              <Link href="/categories" style={linkStyle}>Catégories</Link>
              <Link href="/stores" style={linkStyle}>Boutiques</Link>
            </div>
          </div>

          {/* Vendeurs */}
          <div>
            <h4 style={headingStyle}>Vendeurs</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/sell" style={linkStyle}>Créer une boutique</Link>
              <Link href="/pricing" style={linkStyle}>Tarifs</Link>
              <Link href="/sell#themes" style={linkStyle}>Thèmes</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={headingStyle}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/help" style={linkStyle}>Centre d&apos;aide</Link>
              <Link href="/contact" style={linkStyle}>Contact</Link>
              <Link href="/legal" style={linkStyle}>Conditions d&apos;utilisation</Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid var(--pd-border)', paddingTop: 20,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ fontSize: 'var(--pd-fs-xs)', color: 'var(--pd-text-tertiary)' }}>
            © {year} PandaMarket. Tous droits réservés.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontSize: 'var(--pd-fs-xs)', color: 'var(--pd-text-tertiary)' }}>🇹🇳 Made in Tunisia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
