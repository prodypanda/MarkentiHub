// pandamarket/frontend/src/app/(auth)/login/page.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // TODO: integrate with backend
      await new Promise((r) => setTimeout(r, 1500));
    } catch {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, var(--pd-bg-primary) 0%, var(--pd-bg-tertiary) 100%)',
    }}>
      {/* Left — Decorative */}
      <div style={{
        flex: 1, display: 'none', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 100%)',
      }} className="login-left">
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 1,
        }}>
          <span style={{ fontSize: 80 }}>🐼</span>
          <h2 style={{ fontSize: 'var(--pd-fs-3xl)', fontWeight: 800, color: '#F8F9FC', marginTop: 16 }}>
            Panda<span style={{ color: '#16C784' }}>Market</span>
          </h2>
          <p style={{ color: '#9CA3AF', marginTop: 8, maxWidth: 300 }}>
            Le marketplace tunisien nouvelle génération
          </p>
        </div>
        <div style={{
          position: 'absolute', top: -100, right: -100, width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,199,132,0.15), transparent)',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* Right — Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--pd-sp-8)',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }} className="animate-fade-in">
          <div style={{ marginBottom: 32 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <span style={{ fontSize: 28 }}>🐼</span>
              <span style={{ fontWeight: 800, fontSize: 'var(--pd-fs-xl)' }}>
                Panda<span style={{ color: 'var(--pd-green)' }}>Market</span>
              </span>
            </Link>
            <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 8 }}>
              Connexion
            </h1>
            <p style={{ color: 'var(--pd-text-secondary)' }}>
              Accédez à votre tableau de bord vendeur
            </p>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 'var(--pd-radius-md)',
              backgroundColor: 'var(--pd-red-bg)', color: 'var(--pd-red)',
              fontSize: 'var(--pd-fs-sm)', marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Input
              label="Email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              required
            />
            <div style={{ position: 'relative' }}>
              <Input
                label="Mot de passe"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={18} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{
                  position: 'absolute', right: 12, bottom: 10,
                  color: 'var(--pd-text-tertiary)',
                  display: 'flex', alignItems: 'center',
                }}
                aria-label={showPwd ? 'Masquer' : 'Afficher'}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link href="/forgot-password" style={{
                fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-green)', fontWeight: 500,
              }}>
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg">
              Se connecter <ArrowRight size={18} />
            </Button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: 24,
            fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)',
          }}>
            Pas encore de compte ?{' '}
            <Link href="/register" style={{ color: 'var(--pd-green)', fontWeight: 600 }}>
              Créer une boutique
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
