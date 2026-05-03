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

async function getHubData() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
  try {
    // Note: To fetch global products across all stores for the hub, we use the standard Medusa store products endpoint
    const res = await fetch(`${BACKEND_URL}/store/products?limit=8`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return { products: [], count: 0 };
    const data = await res.json();
    return {
      products: data.products || [],
      count: data.count || 0
    };
  } catch (e) {
    console.error('Error fetching hub data', e);
    return { products: [], count: 0 };
  }
}

function HeroSection({ productCount }: { productCount: number }) {
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
              { value: `${productCount}+`, label: 'Produits' },
              { value: 'Bêta', label: 'Boutiques' },
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

function LatestProductsSection({ products }: { products: any[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section style={{ padding: '80px 24px', backgroundColor: '#f8fafc' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <h2 style={{ fontSize: 'var(--pd-fs-3xl)', fontWeight: 800, color: '#111827', marginBottom: 8 }}>
              Nouveautés du Hub
            </h2>
            <p style={{ color: '#64748b' }}>Les derniers produits ajoutés par nos vendeurs</p>
          </div>
          <Link href="/search" style={{ color: '#16C784', fontWeight: 600, textDecoration: 'none' }}>
            Voir tout &rarr;
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.handle || product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ width: '100%', height: 220, backgroundColor: '#f1f5f9', position: 'relative' }}>
                  {product.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.title}
                  </h3>
                  {/* Extract price from Medusa variants if possible */}
                  {product.variants && product.variants[0] && product.variants[0].prices && product.variants[0].prices[0] ? (
                    <div style={{ fontWeight: 800, color: '#16C784', fontSize: '1.25rem', marginTop: 'auto' }}>
                      {(product.variants[0].prices[0].amount / 1000).toFixed(3)} TND
                    </div>
                  ) : (
                    <div style={{ fontWeight: 800, color: '#16C784', fontSize: '1.25rem', marginTop: 'auto' }}>
                      {product.metadata?.price ? Number(product.metadata.price).toFixed(3) : 'Prix sur demande'}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
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

export default async function HubHomePage() {
  const { products, count } = await getHubData();

  return (
    <>
      <HeroSection productCount={count} />
      <LatestProductsSection products={products} />
      <FeaturesSection />
      <CTASection />
    </>
  );
}
