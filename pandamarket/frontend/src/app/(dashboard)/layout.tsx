// pandamarket/frontend/src/app/(dashboard)/layout.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Wallet, Settings,
  ShieldCheck, Sparkles, Bell, ChevronLeft, ChevronRight,
  LogOut, BarChart3, Key,
} from 'lucide-react';
import { socket } from '@/lib/socket';

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/dashboard/products', label: 'Produits', icon: Package },
  { href: '/dashboard/orders', label: 'Commandes', icon: ShoppingCart },
  { href: '/dashboard/wallet', label: 'Portefeuille', icon: Wallet },
  { href: '/dashboard/analytics', label: 'Statistiques', icon: BarChart3 },
  { href: '/dashboard/ai-tools', label: 'Outils IA', icon: Sparkles },
  { href: '/dashboard/api-keys', label: 'Clés API', icon: Key },
  { href: '/dashboard/verification', label: 'Vérification', icon: ShieldCheck },
  { href: '/dashboard/settings', label: 'Paramètres', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const mockStoreId = "store_123";
    
    socket.connect();
    socket.emit('join_store', { storeId: mockStoreId, token: 'mock-jwt' });

    socket.on('notification.new_order', (data: any) => {
      setNotifications(prev => prev + 1);
      setToastMessage(data.message);
      setTimeout(() => setToastMessage(null), 5000);
    });

    return () => {
      socket.off('notification.new_order');
      socket.disconnect();
    };
  }, []);

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--pd-bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarWidth, flexShrink: 0,
        backgroundColor: 'var(--pd-bg-secondary)',
        borderRight: '1px solid var(--pd-border)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 200ms ease',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 200, overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? '16px 12px' : '16px 20px',
          borderBottom: '1px solid var(--pd-border)',
          display: 'flex', alignItems: 'center', gap: 8,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <span style={{ fontSize: 24 }}>🐼</span>
          {!collapsed && (
            <span style={{ fontWeight: 800, fontSize: 'var(--pd-fs-base)' }}>
              Panda<span style={{ color: 'var(--pd-green)' }}>Market</span>
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: collapsed ? '10px 0' : '10px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--pd-radius-md)',
                  fontSize: 'var(--pd-fs-sm)', fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--pd-green)' : 'var(--pd-text-secondary)',
                  backgroundColor: isActive ? 'var(--pd-green-bg)' : 'transparent',
                  transition: 'all var(--pd-transition)',
                  textDecoration: 'none',
                }}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--pd-border)' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: '100%', padding: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--pd-radius-md)',
              color: 'var(--pd-text-tertiary)', fontSize: 'var(--pd-fs-sm)',
              transition: 'all var(--pd-transition)',
            }}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: sidebarWidth, transition: 'margin-left 200ms ease' }}>
        {/* Top bar */}
        <header style={{
          height: 60, padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12,
          borderBottom: '1px solid var(--pd-border)',
          backgroundColor: 'var(--pd-bg-secondary)',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <button style={{
            position: 'relative', width: 40, height: 40,
            borderRadius: 'var(--pd-radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--pd-text-secondary)',
          }} aria-label="Notifications" onClick={() => setNotifications(0)}>
            <Bell size={20} />
            {notifications > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 14, height: 14, borderRadius: '50%',
                backgroundColor: 'var(--pd-red)',
                color: 'white', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
              }} className="animate-badge-pulse">{notifications}</span>
            )}
          </button>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            backgroundColor: 'var(--pd-green)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 'var(--pd-fs-sm)',
          }}>
            V
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: 24 }}>
          {children}
        </main>
        
        {/* Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed', bottom: 24, right: 24,
            backgroundColor: 'var(--pd-green)', color: 'white',
            padding: '16px 24px', borderRadius: 'var(--pd-radius-md)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000,
            display: 'flex', alignItems: 'center', gap: 12,
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <Bell size={18} />
            <span style={{ fontWeight: 600 }}>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
