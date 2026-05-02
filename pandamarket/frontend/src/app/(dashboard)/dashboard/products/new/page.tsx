// pandamarket/frontend/src/app/(dashboard)/dashboard/products/new/page.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUploader from '@/components/ui/ImageUploader';
import { api } from '@/lib/api';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [images, setImages] = useState<string[]>([]);

  // We mock a storeId for now; in a real app this comes from the authenticated session
  const MOCK_STORE_ID = 'store_123';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real app, we'd POST to /api/pd/products here
      // For now, we simulate the request to show the flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate back to products list on success
      router.push('/dashboard/products');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Link href="/dashboard/products">
          <button style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 40, height: 40, borderRadius: 'var(--pd-radius-md)',
            border: '1px solid var(--pd-border)', backgroundColor: 'var(--pd-bg-primary)',
            color: 'var(--pd-text-secondary)', cursor: 'pointer', transition: 'all var(--pd-transition)'
          }} className="hover-lift">
            <ArrowLeft size={18} />
          </button>
        </Link>
        <div>
          <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 4 }}>Nouveau Produit</h1>
          <p style={{ color: 'var(--pd-text-secondary)', fontSize: 'var(--pd-fs-sm)' }}>
            Ajoutez un nouvel article à votre catalogue
          </p>
        </div>
      </div>

      {error && (
        <div style={{ 
          padding: '12px 16px', borderRadius: 'var(--pd-radius-md)', 
          backgroundColor: 'var(--pd-red-bg)', color: 'var(--pd-red)', 
          fontSize: 'var(--pd-fs-sm)', marginBottom: 24 
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Card>
            <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 20 }}>Informations Générales</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input 
                label="Titre du produit" 
                placeholder="Ex: T-shirt en coton bio" 
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                required
              />
              <div>
                <label style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  rows={5}
                  placeholder="Décrivez votre produit en détail..."
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 'var(--pd-radius-sm)',
                    border: '1px solid var(--pd-border)', backgroundColor: 'var(--pd-bg-secondary)',
                    color: 'var(--pd-text-primary)', fontSize: 'var(--pd-fs-base)',
                    resize: 'vertical', fontFamily: 'inherit', outline: 'none',
                  }}
                  required
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 20 }}>Images</h2>
            <ImageUploader 
              storeId={MOCK_STORE_ID}
              images={images}
              onChange={setImages}
              maxImages={5} // Usually constrained by subscription plan limit in real app
            />
          </Card>
        </div>

        {/* Sidebar Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Card>
            <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 20 }}>Tarification & Stock</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input 
                label="Prix (TND)" 
                type="number" 
                step="0.001"
                placeholder="0.000" 
                value={form.price}
                onChange={e => setForm({...form, price: e.target.value})}
                required
              />
              <Input 
                label="Quantité en stock" 
                type="number" 
                placeholder="0" 
                value={form.stock}
                onChange={e => setForm({...form, stock: e.target.value})}
                required
              />
            </div>
          </Card>

          <Card>
            <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 20 }}>Catégorisation</h2>
            <div>
              <label style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Catégorie</label>
              <select
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--pd-radius-sm)',
                  border: '1px solid var(--pd-border)', backgroundColor: 'var(--pd-bg-secondary)',
                  color: 'var(--pd-text-primary)', fontSize: 'var(--pd-fs-base)', outline: 'none',
                }}
                required
              >
                <option value="">Sélectionner une catégorie...</option>
                <option value="vetements">Vêtements</option>
                <option value="electronique">Électronique</option>
                <option value="maison">Maison & Jardin</option>
                <option value="beaute">Beauté & Santé</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </Card>

          <div style={{ position: 'sticky', top: 84 }}>
            <Button type="submit" fullWidth size="lg" loading={loading} icon={<Save size={18} />}>
              Enregistrer le produit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
