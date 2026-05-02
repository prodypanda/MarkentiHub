// pandamarket/frontend/src/app/(dashboard)/dashboard/page.tsx
import React from 'react';
import { Package, ShoppingCart, Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export const metadata = { title: 'Tableau de bord' };

function StatCard({ icon, label, value, change, positive }: {
  icon: React.ReactNode; label: string; value: string; change: string; positive: boolean;
}) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)', marginBottom: 8 }}>{label}</p>
          <p style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800 }}>{value}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
            {positive ? <ArrowUpRight size={14} style={{ color: 'var(--pd-green)' }} /> : <ArrowDownRight size={14} style={{ color: 'var(--pd-red)' }} />}
            <span style={{ fontSize: 'var(--pd-fs-xs)', color: positive ? 'var(--pd-green)' : 'var(--pd-red)', fontWeight: 600 }}>
              {change}
            </span>
            <span style={{ fontSize: 'var(--pd-fs-xs)', color: 'var(--pd-text-tertiary)' }}>vs mois dernier</span>
          </div>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--pd-radius-md)',
          backgroundColor: 'var(--pd-green-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--pd-green)',
        }}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

const recentOrders = [
  { id: 'PD-1234', customer: 'Ahmed B.', amount: '85.000 TND', status: 'pending', date: 'Il y a 2h' },
  { id: 'PD-1233', customer: 'Salma K.', amount: '42.500 TND', status: 'fulfilled', date: 'Il y a 5h' },
  { id: 'PD-1232', customer: 'Mohamed A.', amount: '120.000 TND', status: 'processing', date: 'Hier' },
  { id: 'PD-1231', customer: 'Nour H.', amount: '67.300 TND', status: 'delivered', date: 'Hier' },
];

const statusMap: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'neutral' }> = {
  pending: { label: 'En attente', variant: 'warning' },
  processing: { label: 'Traitement', variant: 'info' },
  fulfilled: { label: 'Expédié', variant: 'success' },
  delivered: { label: 'Livré', variant: 'success' },
};

export default function DashboardPage() {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 4 }}>
          Bienvenue 👋
        </h1>
        <p style={{ color: 'var(--pd-text-secondary)' }}>
          Voici un aperçu de votre boutique aujourd&apos;hui
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon={<TrendingUp size={22} />} label="Chiffre d'affaires" value="2,450 TND" change="+12.5%" positive />
        <StatCard icon={<ShoppingCart size={22} />} label="Commandes" value="38" change="+8.2%" positive />
        <StatCard icon={<Package size={22} />} label="Produits actifs" value="7 / 10" change="" positive />
        <StatCard icon={<Wallet size={22} />} label="Solde disponible" value="1,820 TND" change="+23.1%" positive />
      </div>

      {/* Recent Orders */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700 }}>Commandes récentes</h2>
          <a href="/dashboard/orders" style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-green)', fontWeight: 600 }}>
            Voir tout →
          </a>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Commande', 'Client', 'Montant', 'Statut', 'Date'].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 12px',
                    fontSize: 'var(--pd-fs-xs)', fontWeight: 600,
                    color: 'var(--pd-text-tertiary)', textTransform: 'uppercase',
                    borderBottom: '1px solid var(--pd-border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} style={{ transition: 'background var(--pd-transition)' }}>
                  <td style={{ padding: '12px', fontSize: 'var(--pd-fs-sm)', fontWeight: 600 }}>{order.id}</td>
                  <td style={{ padding: '12px', fontSize: 'var(--pd-fs-sm)' }}>{order.customer}</td>
                  <td style={{ padding: '12px', fontSize: 'var(--pd-fs-sm)', fontWeight: 600 }}>{order.amount}</td>
                  <td style={{ padding: '12px' }}>
                    <Badge variant={statusMap[order.status].variant} dot>{statusMap[order.status].label}</Badge>
                  </td>
                  <td style={{ padding: '12px', fontSize: 'var(--pd-fs-xs)', color: 'var(--pd-text-tertiary)' }}>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
