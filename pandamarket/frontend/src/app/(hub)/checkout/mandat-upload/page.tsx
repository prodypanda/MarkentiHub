// pandamarket/frontend/src/app/(hub)/checkout/mandat-upload/page.tsx
'use client';

import React, { useState, useRef, Suspense } from 'react';
import { Upload, FileText, CheckCircle, ArrowRight, Loader2, Info } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

function MandatUploadContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      // 1. In a real app, request a presigned URL from our API:
      // const res = await api.post('/pd/upload/presigned-url/mandat', { order_id: orderId, content_type: file.type });
      // 2. PUT file to S3
      // 3. Update order in Medusa indicating proof is uploaded

      await new Promise(r => setTimeout(r, 2000));
      setSuccess(true);
    } catch (e) {
      alert('Erreur lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <Card style={{ textAlign: 'center', padding: '64px 24px' }}>
        <CheckCircle size={64} style={{ color: 'var(--pd-green)', margin: '0 auto 24px' }} />
        <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 16 }}>Preuve Envoyée !</h1>
        <p style={{ color: 'var(--pd-text-secondary)', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
          Nous avons bien reçu votre preuve de paiement. Votre commande sera traitée dès que notre équipe aura validé le transfert.
        </p>
        <Button onClick={() => router.push('/')}>Retour à la boutique</Button>
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 16 }}>Preuve de Paiement</h1>
      <p style={{ color: 'var(--pd-text-secondary)', marginBottom: 24 }}>
        Commande N° <strong>{orderId}</strong>
      </p>

      <div style={{ backgroundColor: 'var(--pd-blue-bg)', padding: 16, borderRadius: 'var(--pd-radius-md)', display: 'flex', gap: 16, marginBottom: 32 }}>
        <Info size={24} style={{ color: 'var(--pd-blue)', flexShrink: 0 }} />
        <p style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-primary)', margin: 0 }}>
          Veuillez effectuer un Mandat Minute à la Poste au nom de <strong>PandaMarket SARL</strong> (CIN: 12345678). 
          Prenez ensuite une photo claire de votre reçu et chargez-la ci-dessous pour valider votre commande.
        </p>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${file ? 'var(--pd-green)' : 'var(--pd-border)'}`,
          borderRadius: 'var(--pd-radius-lg)',
          padding: 48,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: 'var(--pd-bg-secondary)',
          marginBottom: 32,
          transition: 'all 200ms ease'
        }}
        className="hover-lift"
      >
        {file ? (
          <div>
            <FileText size={48} style={{ color: 'var(--pd-green)', margin: '0 auto 16px' }} />
            <h3 style={{ fontWeight: 600, fontSize: 'var(--pd-fs-lg)' }}>{file.name}</h3>
            <p style={{ color: 'var(--pd-text-secondary)', fontSize: 'var(--pd-fs-sm)' }}>Cliquez pour modifier</p>
          </div>
        ) : (
          <div>
            <Upload size={48} style={{ color: 'var(--pd-text-tertiary)', margin: '0 auto 16px' }} />
            <h3 style={{ fontWeight: 600, fontSize: 'var(--pd-fs-lg)' }}>Importer votre reçu</h3>
            <p style={{ color: 'var(--pd-text-secondary)', fontSize: 'var(--pd-fs-sm)' }}>Formats acceptés : JPG, PNG, PDF</p>
          </div>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,.pdf" style={{ display: 'none' }} />

      <Button size="lg" fullWidth disabled={!file} loading={uploading} onClick={handleUpload} icon={<ArrowRight size={18} />}>
        Envoyer pour validation
      </Button>
    </Card>
  );
}

export default function MandatUploadPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--pd-bg-primary)', paddingTop: 100, paddingBottom: 100 }}>
      <div style={{ padding: '0 24px' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: 100 }}><Loader2 className="animate-spin" /></div>}>
          <MandatUploadContent />
        </Suspense>
      </div>
    </div>
  );
}
