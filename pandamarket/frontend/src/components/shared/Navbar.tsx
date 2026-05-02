'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X, Store } from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      backgroundColor: 'var(--pd-bg-secondary)',
      borderBottom: '1px solid var(--pd-border)',
      backdropFilter: 'blur(12px)',
    }}>
      <nav style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', gap: 24,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>🐼</span>
          <span style={{ fontSize: 'var(--pd-fs-xl)', fontWeight: 800, color: 'var(--pd-text-primary)' }}>
            Panda<span style={{ color: 'var(--pd-green)' }}>Market</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div style={{
          flex: 1, maxWidth: 520, position: 'relative',
          display: menuOpen ? 'none' : 'flex',
        }}>
          <Search size={18} style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: searchFocused ? 'var(--pd-green)' : 'var(--pd-text-tertiary)',
            transition: 'color var(--pd-transition)',
          }} />
          <input
            type="text"
            placeholder="Rechercher des produits, boutiques..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: '100%', padding: '10px 16px 10px 42px',
              backgroundColor: 'var(--pd-bg-tertiary)',
              border: `1.5px solid ${searchFocused ? 'var(--pd-green)' : 'transparent'}`,
              borderRadius: 'var(--pd-radius-full)',
              fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-primary)',
              outline: 'none', transition: 'all var(--pd-transition)',
              boxShadow: searchFocused ? '0 0 0 3px var(--pd-green-bg)' : 'none',
            }}
          />
        </div>

        {/* Desktop Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Link href="/sell" style={{ display: 'flex' }}>
            <Button variant="outline" size="sm" icon={<Store size={16} />}>
              Vendre
            </Button>
          </Link>
          <button style={{
            width: 40, height: 40, borderRadius: 'var(--pd-radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--pd-text-secondary)', transition: 'all var(--pd-transition)',
            position: 'relative',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--pd-bg-tertiary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          aria-label="Panier"
          >
            <ShoppingCart size={20} />
            <span style={{
              position: 'absolute', top: 4, right: 4,
              width: 16, height: 16, borderRadius: '50%',
              backgroundColor: 'var(--pd-red)',
              color: '#fff', fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>0</span>
          </button>
          <button style={{
            width: 40, height: 40, borderRadius: 'var(--pd-radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--pd-text-secondary)', transition: 'all var(--pd-transition)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--pd-bg-tertiary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          aria-label="Compte"
          >
            <User size={20} />
          </button>
        </div>
      </nav>
    </header>
  );
}
