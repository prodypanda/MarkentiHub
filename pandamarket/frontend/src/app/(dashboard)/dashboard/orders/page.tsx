// pandamarket/frontend/src/app/(dashboard)/dashboard/orders/page.tsx
'use client';
import React, { useState } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const orders = [
  { id: 'PD-1234', customer: 'Ahmed B.', email: 'ahmed@test.tn', items: 2, total: '85.000', status: 'pending', payment: 'flouci', date: '2 mai 2026' },
  { id: 'PD-1233', customer: 'Salma K.', email: 'salma@test.tn', items: 1, total: '42.500', status: 'processing', payment: 'konnect', date: '1 mai 2026' },
  { id: 'PD-1232', customer: 'Mohamed A.', email: 'mohamed@test.tn', items: 3, total: '120.000', status: 'fulfilled', payment: 'cod', date: '30 avr 2026' },
  { id: 'PD-1231', customer: 'Nour H.', email: 'nour@test.tn', items: 1, total: '67.300', status: 'delivered', payment: 'mandat', date: '28 avr 2026' },
  { id: 'PD-1230', customer: 'Youssef M.', email: 'youssef@test.tn', items: 2, total: '155.000', status: 'cancelled', payment: 'flouci', date: '25 avr 2026' },
];

const statusMap: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'danger' | 'neutral' }> = {
  pending: { label: 'En attente', variant: 'warning' },
  processing: { label: 'Traitement', variant: 'info' },
  fulfilled: { label: 'Expédié', variant: 'success' },
  delivered: { label: 'Livré', variant: 'success' },
  cancelled: { label: 'Annulé', variant: 'danger' },
};

const paymentBadge: Record<string, string> = {
  flouci: '💳 Flouci', konnect: '💳 Konnect', cod: '🚚 COD', mandat: '📨 Mandat',
};

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 24 }}>Commandes</h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--pd-text-tertiary)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." style={{
            width: '100%', padding: '10px 14px 10px 40px', borderRadius: 'var(--pd-radius-md)',
            border: '1px solid var(--pd-border)', backgroundColor: 'var(--pd-bg-secondary)',
            color: 'var(--pd-text-primary)', fontSize: 'var(--pd-fs-sm)', outline: 'none',
          }} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['all', 'pending', 'processing', 'fulfilled', 'delivered'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 14px', borderRadius: 'var(--pd-radius-md)',
              fontSize: 'var(--pd-fs-xs)', fontWeight: 600,
              backgroundColor: filter === f ? 'var(--pd-green-bg)' : 'transparent',
              color: filter === f ? 'var(--pd-green)' : 'var(--pd-text-secondary)',
              border: filter === f ? '1px solid var(--pd-green-border)' : '1px solid transparent',
              transition: 'all var(--pd-transition)',
            }}>{f === 'all' ? 'Tous' : statusMap[f]?.label || f}</button>
          ))}
        </div>
      </div>

      <Card padding="0">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Commande', 'Client', 'Articles', 'Total', 'Paiement', 'Statut', 'Date', ''].map((h) => (
              <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 'var(--pd-fs-xs)', fontWeight: 600, color: 'var(--pd-text-tertiary)', textTransform: 'uppercase', borderBottom: '1px solid var(--pd-border)' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--pd-border)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: 'var(--pd-fs-sm)' }}>{o.id}</td>
                <td style={{ padding: '14px 16px', fontSize: 'var(--pd-fs-sm)' }}>{o.customer}</td>
                <td style={{ padding: '14px 16px', fontSize: 'var(--pd-fs-sm)' }}>{o.items}</td>
                <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: 'var(--pd-fs-sm)' }}>{o.total} TND</td>
                <td style={{ padding: '14px 16px', fontSize: 'var(--pd-fs-xs)' }}>{paymentBadge[o.payment]}</td>
                <td style={{ padding: '14px 16px' }}><Badge variant={statusMap[o.status].variant} dot>{statusMap[o.status].label}</Badge></td>
                <td style={{ padding: '14px 16px', fontSize: 'var(--pd-fs-xs)', color: 'var(--pd-text-tertiary)' }}>{o.date}</td>
                <td style={{ padding: '14px 16px' }}><button style={{ color: 'var(--pd-text-secondary)' }}><Eye size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
