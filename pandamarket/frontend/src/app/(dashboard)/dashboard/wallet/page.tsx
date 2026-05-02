'use client';
import React from 'react';
import { Wallet, ArrowDownToLine, ArrowUpRight, Clock, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function WalletPage() {
  const wallet = { balance: 1820.500, pending: 430.000, totalEarned: 4250.000 };
  const txs = [
    { id: '1', desc: 'Vente - PD-1234', amount: 72.250, date: '2 mai 2026' },
    { id: '2', desc: 'Commission (15%)', amount: -12.750, date: '2 mai 2026' },
    { id: '3', desc: 'Vente - PD-1233', amount: 42.500, date: '1 mai 2026' },
    { id: '4', desc: 'Retrait bancaire', amount: -500.000, date: '28 avr 2026' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 24 }}>Portefeuille</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <Card style={{ background: 'linear-gradient(135deg, #16C784, #12a56d)', color: '#fff', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, opacity: 0.9 }}><Wallet size={18} /><span style={{ fontSize: 'var(--pd-fs-sm)' }}>Disponible</span></div>
          <p style={{ fontSize: 'var(--pd-fs-3xl)', fontWeight: 800 }}>{wallet.balance.toFixed(3)} TND</p>
          <Button variant="secondary" size="sm" style={{ marginTop: 16, backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none' }} icon={<ArrowDownToLine size={14} />}>Retirer</Button>
        </Card>
        <Card><div style={{ color: 'var(--pd-text-secondary)', marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}><Clock size={18} />En attente (7j)</div><p style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800 }}>{wallet.pending.toFixed(3)} TND</p></Card>
        <Card><div style={{ color: 'var(--pd-text-secondary)', marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}><TrendingUp size={18} />Total gagné</div><p style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800 }}>{wallet.totalEarned.toFixed(3)} TND</p></Card>
      </div>
      <Card>
        <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 20 }}>Historique</h2>
        {txs.map((tx) => (
          <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--pd-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: tx.amount > 0 ? 'var(--pd-green-bg)' : 'var(--pd-red-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {tx.amount > 0 ? <ArrowUpRight size={16} style={{ color: 'var(--pd-green)' }} /> : <ArrowDownToLine size={16} style={{ color: 'var(--pd-red)' }} />}
              </div>
              <div><p style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 500 }}>{tx.desc}</p><p style={{ fontSize: 'var(--pd-fs-xs)', color: 'var(--pd-text-tertiary)' }}>{tx.date}</p></div>
            </div>
            <span style={{ fontWeight: 700, fontSize: 'var(--pd-fs-sm)', color: tx.amount > 0 ? 'var(--pd-green)' : 'var(--pd-red)' }}>{tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(3)} TND</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
