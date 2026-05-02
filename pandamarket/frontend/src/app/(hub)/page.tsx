// pandamarket/frontend/src/app/(hub)/page.tsx
// =============================================================================
// PandaMarket Hub Homepage
// =============================================================================

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Shield, Zap, Store, CreditCard, Truck, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'PandaMarket — Le Marketplace Tunisien',
  description: 'Découvrez des milliers de produits de vendeurs tunisiens vérifiés. Créez votre boutique en ligne gratuite.',
};

function HeroSection() {
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 50%, #0F0F1A 100%)',
      padding: '80px 24px 100px',
    }}>
      {/* Decorative gradient orbs */}
      <div style={{
        position: 'absolute', top: -100, right: -100, width: 400, height: 400,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,199,132,0.15), transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -50, left: -50, width: 300, height: 300,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 'var(--pd-radius-full)',
            border: '1px solid rgba(22,199,132,0.3)', backgroundColor: 'rgba(22,199,132,0.08)',
            fontSize: 'var(--pd-fs-sm)', color: '#16C784', fontWeight: 600, marginBottom: 24,
          }}>
            <Sparkles size={14} /> Nouveau — IA SEO intégrée pour vos produits
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800,
            color: '#F8F9FC', lineHeight: 1.15, marginBottom: 20,
            letterSpacing: '-0.02em',
          }}>
            Le Marketplace<br />
            <span style={{ color: '#16C784' }}>Tunisien</span> nouvelle génération
          </h1>

          <p style={{
            fontSize: 'var(--pd-fs-lg)', color: '#9CA3AF',
            lineHeight: 1.7, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px',
          }}>
            Créez votre boutique en ligne gratuite avec votre propre domaine.
            Vendez sur le Hub central auprès de milliers d&apos;acheteurs.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/sell" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 'var(--pd-radius-md)',
              backgroundColor: '#16C784', color: '#fff',
              fontWeight: 700, fontSize: 'var(--pd-fs-base)',
              transition: 'all 200ms ease', textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(22,199,132,0.3)',
            }}>
              Créer ma boutique gratuite <ArrowRight size={18} />
            </Link>
            <Link href="/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 'var(--pd-radius-md)',
              backgroundColor: 'transparent', color: '#F8F9FC',
              fontWeight: 600, fontSize: 'var(--pd-fs-base)',
              border: '1px solid rgba(255,255,255,0.15)',
              transition: 'all 200ms ease', textDecoration: 'none',
            }}>
              <Search size={18} /> Explorer les produits
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 48,
            marginTop: 56, flexWrap: 'wrap',
          }}>
            {[
              { value: '1,200+', label: 'Produits' },
              { value: '150+', label: 'Boutiques' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, color: '#F8F9FC' }}>{stat.value}</div>
                <div style={{ fontSize: 'var(--pd-fs-sm)', color: '#6B7280' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: <Store size={24} />, title: 'Boutique gratuite', desc: 'Sous-domaine gratuit + domaine personnalisable. Choisissez parmi nos thèmes premium.' },
    { icon: <CreditCard size={24} />, title: 'Paiement local', desc: 'Flouci, Konnect, Mandat Minute et paiement à la livraison — tout est intégré.' },
    { icon: <Shield size={24} />, title: 'Vendeurs vérifiés', desc: 'Chaque vendeur passe par notre processus de vérification KYC pour votre sécurité.' },
    { icon: <Zap size={24} />, title: 'IA intégrée', desc: 'Générez des titres SEO et compressez vos images automatiquement.' },
    { icon: <Truck size={24} />, title: 'Logistique simplifiée', desc: 'Aramex et La Poste TN intégrés. Suivi de colis en temps réel.' },
    { icon: <Sparkles size={24} />, title: 'Hub Central', desc: 'Vos produits visibles par des milliers d\'acheteurs sur le marketplace.' },
  ];

  return (
    <section style={{ padding: '80px 24px', backgroundColor: 'var(--pd-bg-primary)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'var(--pd-fs-3xl)', fontWeight: 800, marginBottom: 12 }}>
            Tout ce dont vous avez besoin
          </h2>
          <p style={{ fontSize: 'var(--pd-fs-lg)', color: 'var(--pd-text-secondary)', maxWidth: 560, margin: '0 auto' }}>
            Une plateforme complète pour vendre en ligne en Tunisie
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              padding: 28,
              backgroundColor: 'var(--pd-bg-secondary)',
              border: '1px solid var(--pd-border)',
              borderRadius: 'var(--pd-radius-lg)',
              transition: 'all 200ms ease',
              cursor: 'default',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 'var(--pd-radius-md)',
                backgroundColor: 'var(--pd-green-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--pd-green)', marginBottom: 16,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section style={{
      padding: '80px 24px',
      background: 'linear-gradient(135deg, #12a56d 0%, #16C784 50%, #1de69a 100%)',
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--pd-fs-3xl)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
          Prêt à vendre en ligne ?
        </h2>
        <p style={{ fontSize: 'var(--pd-fs-lg)', color: 'rgba(255,255,255,0.85)', marginBottom: 32 }}>
          Créez votre boutique en 2 minutes. C&apos;est gratuit, sans engagement.
        </p>
        <Link href="/sell" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '16px 40px', borderRadius: 'var(--pd-radius-md)',
          backgroundColor: '#fff', color: '#16C784',
          fontWeight: 700, fontSize: 'var(--pd-fs-lg)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
          textDecoration: 'none', transition: 'all 200ms ease',
        }}>
          Commencer gratuitement <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
}

export default function HubHomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </>
  );
}
