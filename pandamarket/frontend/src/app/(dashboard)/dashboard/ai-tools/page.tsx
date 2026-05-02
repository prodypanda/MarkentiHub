// pandamarket/frontend/src/app/(dashboard)/dashboard/ai-tools/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Sparkles, ImageIcon, FileText, Zap, Coins, Loader2, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';

const MOCK_STORE_ID = 'store_123';

export default function AiToolsPage() {
  const { data: creditsData, mutate: mutateCredits } = useSWR('/pd/credits', api.get);
  const { data: productsData } = useSWR(`/pd/products?store_id=${MOCK_STORE_ID}`, api.get);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const credits = (creditsData as any)?.credits || { ai_tokens_balance: 0, ai_tokens_used: 0 };
  const products = (productsData as any)?.products || [];

  // Mock WebSocket listener for MVP
  useEffect(() => {
    // In a real implementation, we connect to Socket.io:
    // const socket = io(process.env.NEXT_PUBLIC_MEDUSA_URL);
    // socket.emit('join_store', MOCK_STORE_ID);
    // socket.on('SEO_COMPLETE', (payload) => { ... });
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleGenerateSEO = async () => {
    if (!selectedProduct) {
      showToast('Veuillez sélectionner un produit', 'error');
      return;
    }

    if (credits.ai_tokens_balance < 1) {
      showToast('Crédits insuffisants', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post('/pd/ai/seo', {
        store_id: MOCK_STORE_ID,
        product_id: selectedProduct
      });
      
      // Optimistically update credits
      mutateCredits();
      
      // Simulate websocket response delay
      setTimeout(() => {
        showToast('Génération SEO terminée avec succès !', 'success');
      }, 2500);

    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la génération', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          backgroundColor: toast.type === 'success' ? 'var(--pd-green-bg)' : 'var(--pd-red-bg)',
          color: toast.type === 'success' ? 'var(--pd-green)' : 'var(--pd-red)',
          padding: '16px 24px', borderRadius: 'var(--pd-radius-md)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 12,
          animation: 'fade-in 0.3s ease-out'
        }}>
          {toast.type === 'success' && <CheckCircle size={20} />}
          <span style={{ fontWeight: 600 }}>{toast.message}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 4 }}>Outils IA</h1>
          <p style={{ color: 'var(--pd-text-secondary)' }}>Optimisez vos produits avec l&apos;intelligence artificielle</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 'var(--pd-radius-full)', backgroundColor: 'var(--pd-bg-secondary)', border: '1px solid var(--pd-border)' }}>
          <Coins size={16} style={{ color: 'var(--pd-yellow)' }} />
          <span style={{ fontWeight: 700, fontSize: 'var(--pd-fs-sm)' }}>{credits.ai_tokens_balance}</span>
          <span style={{ fontSize: 'var(--pd-fs-xs)', color: 'var(--pd-text-tertiary)' }}>crédits restants</span>
        </div>
      </div>

      {/* Tools Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--pd-radius-md)', backgroundColor: 'var(--pd-green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pd-green)' }}>
              <FileText size={24} />
            </div>
            <div>
              <h3 style={{ fontWeight: 700 }}>SEO Automatique</h3>
              <Badge variant="info">1 crédit</Badge>
            </div>
          </div>
          <p style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
            Générez un titre optimisé SEO et une description attractive pour vos produits avec Gemini Pro.
          </p>
          
          <select 
            value={selectedProduct} 
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: 'var(--pd-radius-sm)', border: '1px solid var(--pd-border)', backgroundColor: 'var(--pd-bg-primary)', color: 'var(--pd-text-primary)', outline: 'none' }}
          >
            <option value="">Sélectionnez un produit...</option>
            {products.map((p: any) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          <Button fullWidth icon={<Sparkles size={16} />} onClick={handleGenerateSEO} loading={loading} disabled={!selectedProduct}>
            Générer SEO
          </Button>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--pd-radius-md)', backgroundColor: 'var(--pd-blue-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pd-blue)' }}>
              <ImageIcon size={24} />
            </div>
            <div>
              <h3 style={{ fontWeight: 700 }}>Compression Image</h3>
              <Badge variant="info">1 crédit</Badge>
            </div>
          </div>
          <p style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
            Compressez vos images produit sans perte visible. WebP optimisé pour le web.
          </p>
          <div style={{ padding: '10px', marginBottom: '16px', borderRadius: 'var(--pd-radius-sm)', border: '1px dashed var(--pd-border)', textAlign: 'center', color: 'var(--pd-text-tertiary)' }}>
            Sélectionnez une image (Mocked)
          </div>
          <Button fullWidth variant="secondary" icon={<Zap size={16} />} disabled>Compresser (Bientôt)</Button>
        </Card>
      </div>

      {/* Buy Credits */}
      <Card style={{ marginTop: 24, background: 'linear-gradient(135deg, var(--pd-bg-secondary), var(--pd-bg-tertiary))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Besoin de plus de crédits ?</h3>
            <p style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)' }}>
              Passez à un plan supérieur pour des crédits inclus, ou achetez des packs.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm">Pack 100 — 5 TND</Button>
            <Button variant="outline" size="sm">Pack 500 — 20 TND</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
