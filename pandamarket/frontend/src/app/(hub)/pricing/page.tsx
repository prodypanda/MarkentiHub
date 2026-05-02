// pandamarket/frontend/src/app/(hub)/pricing/page.tsx
import React from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight, Sparkles, Crown } from 'lucide-react';

export const metadata = {
  title: 'Tarifs',
  description: 'Choisissez le plan parfait pour votre boutique PandaMarket. Gratuit pour commencer, scalable pour grandir.',
};

const plans = [
  { name: 'Free', price: 0, period: '', desc: 'Pour démarrer', highlight: false, badge: '', products: '10', images: '2/produit', commission: '15%', features: { domain: false, ai: false, pageBuilder: false, directPay: false, apiKeys: false, whiteLabel: false } },
  { name: 'Starter', price: 300, period: '/an', desc: 'Pour les artisans', highlight: false, badge: '', products: '50', images: '5/produit', commission: '0%', features: { domain: true, ai: true, pageBuilder: false, directPay: false, apiKeys: false, whiteLabel: false } },
  { name: 'Regular', price: 600, period: '/an', desc: 'Pour les pros', highlight: false, badge: '', products: '100', images: '7/produit', commission: '0%', features: { domain: true, ai: true, pageBuilder: true, directPay: false, apiKeys: false, whiteLabel: false } },
  { name: 'Agency', price: 1200, period: '/an', desc: 'Pour les agences', highlight: false, badge: '', products: '300', images: '10/produit', commission: '0%', features: { domain: true, ai: true, pageBuilder: true, directPay: false, apiKeys: true, whiteLabel: false } },
  { name: 'Pro', price: 2400, period: '/an', desc: 'Pour les leaders', highlight: true, badge: '⭐ Populaire', products: 'Illimité', images: '15/produit', commission: '0%', features: { domain: true, ai: true, pageBuilder: true, directPay: true, apiKeys: true, whiteLabel: false } },
  { name: 'Golden', price: 4800, period: '/an', desc: 'Pour les marques', highlight: false, badge: '', products: 'Illimité', images: '20/produit', commission: '0%', features: { domain: true, ai: true, pageBuilder: true, directPay: true, apiKeys: true, whiteLabel: false } },
  { name: 'Platinum', price: 9600, period: '/an', desc: 'Enterprise', highlight: false, badge: '👑', products: 'Illimité', images: '30/produit', commission: '0%', features: { domain: true, ai: true, pageBuilder: true, directPay: true, apiKeys: true, whiteLabel: true } },
];

const featureRows = [
  { label: 'Domaine personnalisé', key: 'domain' },
  { label: 'IA SEO + Compression', key: 'ai' },
  { label: 'Page Builder', key: 'pageBuilder' },
  { label: 'Paiement Direct', key: 'directPay' },
  { label: 'Clés API', key: 'apiKeys' },
  { label: 'White Label', key: 'whiteLabel' },
];

export default function PricingPage() {
  return (
    <section style={{ padding: '64px 24px 80px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 'var(--pd-radius-full)',
            border: '1px solid var(--pd-green-border)', backgroundColor: 'var(--pd-green-bg)',
            fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-green)', fontWeight: 600, marginBottom: 20,
          }}>
            <Sparkles size={14} /> Commencez gratuitement, évoluez sans limites
          </div>
          <h1 style={{ fontSize: 'var(--pd-fs-4xl)', fontWeight: 800, marginBottom: 12 }}>
            Un plan pour chaque <span style={{ color: 'var(--pd-green)' }}>ambition</span>
          </h1>
          <p style={{ fontSize: 'var(--pd-fs-lg)', color: 'var(--pd-text-secondary)', maxWidth: 520, margin: '0 auto' }}>
            0% commission sur tous les plans payants. Prix en TND.
          </p>
        </div>

        {/* Plan Cards — scrollable on mobile */}
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, scrollSnapType: 'x mandatory' }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{
              flex: '0 0 220px', scrollSnapAlign: 'start',
              padding: 24, borderRadius: 'var(--pd-radius-xl)',
              backgroundColor: 'var(--pd-bg-secondary)',
              border: plan.highlight ? '2px solid var(--pd-green)' : '1px solid var(--pd-border)',
              position: 'relative', display: 'flex', flexDirection: 'column',
              boxShadow: plan.highlight ? 'var(--pd-shadow-green)' : 'var(--pd-shadow)',
            }}>
              {plan.badge && (
                <span style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  padding: '4px 12px', borderRadius: 'var(--pd-radius-full)',
                  backgroundColor: 'var(--pd-green)', color: '#fff',
                  fontSize: 'var(--pd-fs-xs)', fontWeight: 700, whiteSpace: 'nowrap',
                }}>{plan.badge}</span>
              )}
              <h3 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 4 }}>{plan.name}</h3>
              <p style={{ fontSize: 'var(--pd-fs-xs)', color: 'var(--pd-text-tertiary)', marginBottom: 16 }}>{plan.desc}</p>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 'var(--pd-fs-3xl)', fontWeight: 800 }}>{plan.price === 0 ? 'Gratuit' : `${plan.price}`}</span>
                {plan.period && <span style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)' }}> TND{plan.period}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, flex: 1 }}>
                <div style={{ fontSize: 'var(--pd-fs-sm)' }}><strong>{plan.products}</strong> produits</div>
                <div style={{ fontSize: 'var(--pd-fs-sm)' }}><strong>{plan.images}</strong> images</div>
                <div style={{ fontSize: 'var(--pd-fs-sm)' }}>Commission: <strong>{plan.commission}</strong></div>
                {featureRows.map((f) => (
                  <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--pd-fs-xs)' }}>
                    {(plan.features as Record<string, boolean>)[f.key]
                      ? <Check size={14} style={{ color: 'var(--pd-green)' }} />
                      : <X size={14} style={{ color: 'var(--pd-text-tertiary)' }} />}
                    <span style={{ color: (plan.features as Record<string, boolean>)[f.key] ? 'var(--pd-text-primary)' : 'var(--pd-text-tertiary)' }}>{f.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/sell" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px 16px', borderRadius: 'var(--pd-radius-md)',
                backgroundColor: plan.highlight ? 'var(--pd-green)' : 'var(--pd-bg-tertiary)',
                color: plan.highlight ? '#fff' : 'var(--pd-text-primary)',
                fontWeight: 600, fontSize: 'var(--pd-fs-sm)', textDecoration: 'none',
                transition: 'all 200ms ease',
              }}>
                Choisir <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
