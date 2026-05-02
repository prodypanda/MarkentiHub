// pandamarket/frontend/src/app/(dashboard)/dashboard/products/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUploader from '@/components/ui/ImageUploader';
import { api } from '@/lib/api';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [images, setImages] = useState<string[]>([]);

  const MOCK_STORE_ID = 'store_123';

  // In a real app we'd fetch the specific product details via API
  // e.g. useSWR(`/pd/products/${params.id}`, api.get)
  // We'll simulate data load here:
  useEffect(() => {
    // Simulate API fetch
    setForm({
      title: 'T-shirt Premium Coton',
      description: 'Superbe t-shirt en coton bio.',
      price: '45.000',
      stock: '23',
      category: 'vetements'
    });
    setImages(['https://via.placeholder.com/150']);
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/pd/products/${params.id}`, { ...form, images, store_id: MOCK_STORE_ID });
      router.push('/dashboard/products');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    setDeleting(true);
    try {
      await api.delete(`/pd/products/${params.id}`);
      router.push('/dashboard/products');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
            <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 4 }}>Modifier le Produit</h1>
            <p style={{ color: 'var(--pd-text-secondary)', fontSize: 'var(--pd-fs-sm)' }}>
              {params.id}
            </p>
          </div>
        </div>
        
        <Button variant="outline" style={{ color: 'var(--pd-red)', borderColor: 'var(--pd-red-border)' }} icon={<Trash2 size={16} />} loading={deleting} onClick={handleDelete}>
          Supprimer
        </Button>
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
        {/* Same layout as NewProductPage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Card>
            <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 20 }}>Informations Générales</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input label="Titre du produit" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              <div>
                <label style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Description</label>
                <textarea
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  rows={5} style={{
                    width: '100%', padding: '10px 14px', borderRadius: 'var(--pd-radius-sm)',
                    border: '1px solid var(--pd-border)', backgroundColor: 'var(--pd-bg-secondary)',
                    color: 'var(--pd-text-primary)', fontSize: 'var(--pd-fs-base)', resize: 'vertical', outline: 'none',
                  }} required
                />
              </div>
            </div>
          </Card>
          <Card>
            <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 20 }}>Images</h2>
            <ImageUploader storeId={MOCK_STORE_ID} images={images} onChange={setImages} />
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Card>
            <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 20 }}>Tarification & Stock</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input label="Prix (TND)" type="number" step="0.001" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
              <Input label="Quantité en stock" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
            </div>
          </Card>
          <Card>
            <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 20 }}>Catégorisation</h2>
            <div>
              <label style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Catégorie</label>
              <select
                value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--pd-radius-sm)',
                  border: '1px solid var(--pd-border)', backgroundColor: 'var(--pd-bg-secondary)',
                  color: 'var(--pd-text-primary)', fontSize: 'var(--pd-fs-base)', outline: 'none',
                }} required
              >
                <option value="">Sélectionner...</option>
                <option value="vetements">Vêtements</option>
                <option value="electronique">Électronique</option>
                <option value="maison">Maison & Jardin</option>
              </select>
            </div>
          </Card>
          <div style={{ position: 'sticky', top: 84 }}>
            <Button type="submit" fullWidth size="lg" loading={loading} icon={<Save size={18} />}>
              Mettre à jour
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
