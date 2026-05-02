// pandamarket/frontend/src/app/(dashboard)/dashboard/verification/page.tsx
'use client';
import React, { useState } from 'react';
import { Shield, Upload, CheckCircle, XCircle, Clock, Phone } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function VerificationPage() {
  const [status] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');

  if (status === 'approved') {
    return (
      <div className="animate-fade-in">
        <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 24 }}>Vérification</h1>
        <Card style={{ textAlign: 'center', padding: 48 }}>
          <CheckCircle size={56} style={{ color: 'var(--pd-green)', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 'var(--pd-fs-xl)', fontWeight: 700, marginBottom: 8 }}>Boutique vérifiée ✓</h2>
          <p style={{ color: 'var(--pd-text-secondary)' }}>Votre boutique est officiellement vérifiée par PandaMarket.</p>
          <Badge variant="verified" style={{ marginTop: 16 }}>Vendeur vérifié</Badge>
        </Card>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="animate-fade-in">
        <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 24 }}>Vérification</h1>
        <Card style={{ textAlign: 'center', padding: 48 }}>
          <Clock size={56} style={{ color: 'var(--pd-yellow)', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 'var(--pd-fs-xl)', fontWeight: 700, marginBottom: 8 }}>En cours de vérification</h2>
          <p style={{ color: 'var(--pd-text-secondary)', maxWidth: 400, margin: '0 auto' }}>
            Nos équipes examinent vos documents. Vous serez notifié de la décision sous 24-48h.
          </p>
          <Badge variant="warning" dot style={{ marginTop: 16 }}>En attente</Badge>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 8 }}>Vérification KYC</h1>
      <p style={{ color: 'var(--pd-text-secondary)', marginBottom: 32 }}>
        Soumettez vos documents pour faire vérifier votre boutique et rassurer vos acheteurs.
      </p>

      {/* Benefits */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { icon: <Shield size={20} />, text: 'Badge "Vendeur vérifié"' },
          { icon: <CheckCircle size={20} />, text: 'Plus de confiance acheteur' },
          { icon: <Upload size={20} />, text: 'Publication prioritaire' },
        ].map((b) => (
          <Card key={b.text} padding="var(--pd-sp-4)">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--pd-green)' }}>
              {b.icon}
              <span style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 600, color: 'var(--pd-text-primary)' }}>{b.text}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Upload Form */}
      <Card>
        <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 20 }}>Documents requis</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* RC */}
          <div>
            <label style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 600, display: 'block', marginBottom: 8 }}>
              Registre de Commerce (RC)
            </label>
            <div style={{
              border: '2px dashed var(--pd-border)', borderRadius: 'var(--pd-radius-lg)',
              padding: 32, textAlign: 'center', cursor: 'pointer',
              transition: 'all var(--pd-transition)',
            }}>
              <Upload size={32} style={{ color: 'var(--pd-text-tertiary)', margin: '0 auto 8px' }} />
              <p style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)' }}>
                Cliquez ou glissez votre fichier ici
              </p>
              <p style={{ fontSize: 'var(--pd-fs-xs)', color: 'var(--pd-text-tertiary)', marginTop: 4 }}>
                PDF, JPG ou PNG — Max 10 MB
              </p>
            </div>
          </div>

          {/* CIN */}
          <div>
            <label style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 600, display: 'block', marginBottom: 8 }}>
              Carte d&apos;Identité Nationale (CIN)
            </label>
            <div style={{
              border: '2px dashed var(--pd-border)', borderRadius: 'var(--pd-radius-lg)',
              padding: 32, textAlign: 'center', cursor: 'pointer',
            }}>
              <Upload size={32} style={{ color: 'var(--pd-text-tertiary)', margin: '0 auto 8px' }} />
              <p style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)' }}>Cliquez ou glissez votre fichier ici</p>
              <p style={{ fontSize: 'var(--pd-fs-xs)', color: 'var(--pd-text-tertiary)', marginTop: 4 }}>PDF, JPG ou PNG — Max 10 MB</p>
            </div>
          </div>

          {/* Phone */}
          <Input
            label="Numéro de téléphone"
            placeholder="+216 XX XXX XXX"
            icon={<Phone size={16} />}
            hint="Un appel de vérification sera effectué"
          />

          <Button size="lg" icon={<Shield size={18} />}>
            Soumettre les documents
          </Button>
        </div>
      </Card>
    </div>
  );
}
