// pandamarket/frontend/src/app/(hub)/checkout/success/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');

  return (
    <Card style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '64px 24px' }}>
      <CheckCircle size={64} style={{ color: 'var(--pd-green)', margin: '0 auto 24px' }} />
      <h1 style={{ fontSize: 'var(--pd-fs-3xl)', fontWeight: 800, marginBottom: 16 }}>Commande Confirmée !</h1>
      <p style={{ color: 'var(--pd-text-secondary)', marginBottom: 32, fontSize: 'var(--pd-fs-lg)' }}>
        Merci pour votre achat. Votre commande <strong>{orderId || '#123456'}</strong> a été traitée avec succès.
      </p>
      
      <div style={{ padding: 24, backgroundColor: 'var(--pd-bg-secondary)', borderRadius: 'var(--pd-radius-lg)', marginBottom: 32, textAlign: 'left' }}>
        <h3 style={{ fontSize: 'var(--pd-fs-base)', fontWeight: 700, marginBottom: 16 }}>Prochaines étapes</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <li style={{ display: 'flex', gap: 12, color: 'var(--pd-text-secondary)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--pd-green)', marginTop: 8 }} />
            <span>Vous recevrez un email de confirmation contenant les détails de votre commande.</span>
          </li>
          <li style={{ display: 'flex', gap: 12, color: 'var(--pd-text-secondary)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--pd-green)', marginTop: 8 }} />
            <span>Le vendeur préparera votre colis pour l'expédition.</span>
          </li>
          <li style={{ display: 'flex', gap: 12, color: 'var(--pd-text-secondary)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--pd-green)', marginTop: 8 }} />
            <span>Vous pourrez suivre l'avancement via le lien de suivi communiqué ultérieurement.</span>
          </li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <Button variant="secondary" onClick={() => router.push('/')}>Retour à l'accueil</Button>
        <Button onClick={() => router.push('/account/orders')} icon={<ArrowRight size={18} />}>Voir mes commandes</Button>
      </div>
    </Card>
  );
}

export default function SuccessPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--pd-bg-primary)', paddingTop: 100, paddingBottom: 100 }}>
      <div style={{ padding: '0 24px' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: 100 }}><Loader2 className="animate-spin" /></div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
