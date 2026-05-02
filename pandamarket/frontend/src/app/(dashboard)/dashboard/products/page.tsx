'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Plus, Search, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';

const statusBadge: Record<string, { label: string; variant: 'success' | 'warning' | 'neutral' }> = {
  published: { label: 'Publié', variant: 'success' },
  draft: { label: 'Brouillon', variant: 'neutral' },
  pending: { label: 'En attente', variant: 'warning' },
};

const MOCK_STORE_ID = 'store_123'; // To be replaced with auth session
const MOCK_MAX_PRODUCTS = 10; // To be replaced with plan fetch

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  
  // Fetch live products for this store
  const { data, error, isLoading } = useSWR(
    `/pd/products?store_id=${MOCK_STORE_ID}`, 
    api.get
  );

  const products = (data as any)?.products || [];
  const filtered = products.filter((p: any) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 4 }}>Produits</h1>
          <p style={{ color: 'var(--pd-text-secondary)', fontSize: 'var(--pd-fs-sm)' }}>
            {isLoading ? 'Chargement...' : `${products.length} / ${MOCK_MAX_PRODUCTS} produits (Plan Actuel)`}
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button icon={<Plus size={18} />}>Ajouter</Button>
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 360 }}>
        <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--pd-text-tertiary)' }} />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          style={{
            width: '100%', padding: '10px 14px 10px 40px', borderRadius: 'var(--pd-radius-md)',
            border: '1px solid var(--pd-border)', backgroundColor: 'var(--pd-bg-secondary)',
            color: 'var(--pd-text-primary)', fontSize: 'var(--pd-fs-sm)', outline: 'none',
          }}
        />
      </div>

      <Card padding="0">
        {isLoading ? (
          <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: 'var(--pd-text-tertiary)' }} />
          </div>
        ) : error ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--pd-red)' }}>
            Erreur lors du chargement des produits
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--pd-text-secondary)' }}>
            Aucun produit trouvé.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Produit', 'Prix', 'Stock', 'Images', 'Statut', ''].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 'var(--pd-fs-xs)', fontWeight: 600, color: 'var(--pd-text-tertiary)', textTransform: 'uppercase', borderBottom: '1px solid var(--pd-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: any) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--pd-border)', transition: 'background var(--pd-transition)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {p.thumbnail ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={p.thumbnail} alt={p.title} style={{ width: 40, height: 40, borderRadius: 'var(--pd-radius-sm)', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: 40, height: 40, borderRadius: 'var(--pd-radius-sm)', backgroundColor: 'var(--pd-bg-tertiary)' }} />
                        )}
                        <span style={{ fontWeight: 600, fontSize: 'var(--pd-fs-sm)' }}>{p.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: 'var(--pd-fs-sm)' }}>
                      {/* Price/Stock usually in metadata or joined variants for MVP */}
                      {p.metadata?.price || 0} TND
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 'var(--pd-fs-sm)' }}>
                      <span style={{ color: p.metadata?.stock === 0 ? 'var(--pd-red)' : 'var(--pd-text-primary)' }}>
                        {p.metadata?.stock || 0}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 'var(--pd-fs-sm)' }}>{p.images?.length || (p.thumbnail ? 1 : 0)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <Badge variant={statusBadge[p.status || 'draft']?.variant || 'neutral'} dot>
                        {statusBadge[p.status || 'draft']?.label || p.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <Link href={`/dashboard/products/${p.id}/edit`}>
                          <button style={{ width: 32, height: 32, borderRadius: 'var(--pd-radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pd-text-secondary)', cursor: 'pointer' }} className="hover-lift"><Edit size={16} /></button>
                        </Link>
                        <button style={{ width: 32, height: 32, borderRadius: 'var(--pd-radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pd-red)', cursor: 'pointer' }} className="hover-lift"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
