// pandamarket/frontend/src/app/(auth)/register/page.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Store, Globe, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const STEPS = ['Compte', 'Boutique', 'Confirmation'];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '',
    store_name: '', subdomain: '', category: '',
  });

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) { setStep(step + 1); return; }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 2000));
      // TODO: POST /api/pd/auth/register
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--pd-bg-primary) 0%, var(--pd-bg-tertiary) 100%)',
      padding: 'var(--pd-sp-4)',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }} className="animate-fade-in">
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <span style={{ fontSize: 28 }}>🐼</span>
          <span style={{ fontWeight: 800, fontSize: 'var(--pd-fs-xl)' }}>
            Panda<span style={{ color: 'var(--pd-green)' }}>Market</span>
          </span>
        </Link>

        <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 8 }}>
          Créer votre boutique
        </h1>
        <p style={{ color: 'var(--pd-text-secondary)', marginBottom: 32 }}>
          Gratuit. Sans engagement. En 2 minutes.
        </p>

        {/* Stepper */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                height: 4, borderRadius: 2, marginBottom: 8,
                backgroundColor: i <= step ? 'var(--pd-green)' : 'var(--pd-border)',
                transition: 'all 300ms ease',
              }} />
              <span style={{
                fontSize: 'var(--pd-fs-xs)', fontWeight: 600,
                color: i <= step ? 'var(--pd-green)' : 'var(--pd-text-tertiary)',
              }}>{s}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Account */}
          {step === 0 && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input label="Prénom" value={form.first_name} onChange={(e) => update('first_name', e.target.value)} icon={<User size={16} />} required />
                <Input label="Nom" value={form.last_name} onChange={(e) => update('last_name', e.target.value)} required />
              </div>
              <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} icon={<Mail size={16} />} required />
              <Input label="Mot de passe" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} icon={<Lock size={16} />} hint="Minimum 8 caractères" required />
            </div>
          )}

          {/* Step 2: Store */}
          {step === 1 && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input label="Nom de la boutique" value={form.store_name} onChange={(e) => update('store_name', e.target.value)} icon={<Store size={16} />} required />
              <div>
                <Input label="Sous-domaine" value={form.subdomain} onChange={(e) => update('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} icon={<Globe size={16} />} required />
                <p style={{ fontSize: 'var(--pd-fs-xs)', color: 'var(--pd-text-tertiary)', marginTop: 4 }}>
                  {form.subdomain ? `${form.subdomain}.pandamarket.tn` : 'votre-boutique.pandamarket.tn'}
                </p>
              </div>
              <div>
                <label style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Catégorie</label>
                <select
                  value={form.category} onChange={(e) => update('category', e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 'var(--pd-radius-sm)',
                    border: '1px solid var(--pd-border)', backgroundColor: 'var(--pd-bg-secondary)',
                    color: 'var(--pd-text-primary)', fontSize: 'var(--pd-fs-base)',
                  }}
                >
                  <option value="">Choisir...</option>
                  <option value="mode">Mode & Accessoires</option>
                  <option value="electronique">Électronique</option>
                  <option value="maison">Maison & Jardin</option>
                  <option value="beaute">Beauté & Santé</option>
                  <option value="sport">Sport & Loisirs</option>
                  <option value="alimentation">Alimentation</option>
                  <option value="artisanat">Artisanat</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 2 && (
            <div className="animate-fade-in" style={{
              padding: 24, borderRadius: 'var(--pd-radius-lg)',
              backgroundColor: 'var(--pd-green-bg)', border: '1px solid var(--pd-green-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  backgroundColor: 'var(--pd-green)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={20} />
                </div>
                <h3 style={{ fontWeight: 700 }}>Presque terminé !</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 'var(--pd-fs-sm)' }}>
                <p><strong>Boutique:</strong> {form.store_name}</p>
                <p><strong>URL:</strong> {form.subdomain}.pandamarket.tn</p>
                <p><strong>Plan:</strong> Free (10 produits, 15% commission)</p>
                <p><strong>Email:</strong> {form.email}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            {step > 0 && (
              <Button type="button" variant="secondary" onClick={() => setStep(step - 1)} icon={<ArrowLeft size={16} />}>
                Retour
              </Button>
            )}
            <Button type="submit" loading={loading} fullWidth size="lg">
              {step < 2 ? 'Suivant' : 'Créer ma boutique'} <ArrowRight size={18} />
            </Button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)' }}>
          Déjà un compte ?{' '}
          <Link href="/login" style={{ color: 'var(--pd-green)', fontWeight: 600 }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
