// pandamarket/frontend/src/app/(hub)/checkout/page.tsx
'use client';

import React, { useState } from 'react';
import { CreditCard, Truck, Receipt, CheckCircle, ArrowRight, ShieldCheck, Mail, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const STEPS = ['Livraison', 'Paiement'];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Shipping form
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'flouci' | 'konnect' | 'cod' | 'mandat'>('flouci');

  // Mock cart
  const cartTotal = 150.000;
  const deliveryFee = 7.000;
  const total = cartTotal + deliveryFee;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 0) setStep(1);
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      // In a real flow, we'd hit Medusa's checkout APIs:
      // 1. Create cart
      // 2. Add items
      // 3. Set shipping address
      // 4. Select payment session
      // 5. Authorize payment -> this returns the Flouci/Konnect link

      // For MVP simulation, we route to a mocked success or the Mandat upload page
      await new Promise(r => setTimeout(r, 1500));

      if (paymentMethod === 'mandat') {
        router.push('/checkout/mandat-upload?order_id=temp_123');
      } else {
        // Direct to success page
        router.push('/checkout/success?order_id=temp_123');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors du paiement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--pd-bg-primary)', paddingTop: 100 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
        
        {/* Left Column: Flow */}
        <div>
          {/* Stepper */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: step >= i ? 'var(--pd-green)' : 'var(--pd-bg-secondary)',
                  color: step >= i ? '#fff' : 'var(--pd-text-tertiary)',
                  fontWeight: 700, fontSize: 'var(--pd-fs-sm)', transition: 'all 300ms ease'
                }}>
                  {step > i ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span style={{ 
                  fontWeight: step >= i ? 600 : 400, 
                  color: step >= i ? 'var(--pd-text-primary)' : 'var(--pd-text-tertiary)' 
                }}>{s}</span>
              </div>
            ))}
          </div>

          {error && (
            <div style={{ padding: '12px 16px', borderRadius: 'var(--pd-radius-md)', backgroundColor: 'var(--pd-red-bg)', color: 'var(--pd-red)', fontSize: 'var(--pd-fs-sm)', marginBottom: 24 }}>
              {error}
            </div>
          )}

          {/* STEP 1: Shipping */}
          {step === 0 && (
            <form onSubmit={handleNext} className="animate-fade-in">
              <h2 style={{ fontSize: 'var(--pd-fs-xl)', fontWeight: 800, marginBottom: 24 }}>Adresse de livraison</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <Input label="Prénom" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                <Input label="Nom" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
                <Input label="Email" type="email" required icon={<Mail size={16} />} value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <Input label="Numéro de téléphone" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                <Input label="Adresse complète" required icon={<MapPin size={16} />} value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 32 }}>
                <Input label="Ville / Délégation" required value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                <Input label="Code Postal" required value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} />
              </div>

              <Button type="submit" size="lg" icon={<ArrowRight size={18} />}>Continuer vers le paiement</Button>
            </form>
          )}

          {/* STEP 2: Payment */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 'var(--pd-fs-xl)', fontWeight: 800, marginBottom: 24 }}>Moyen de paiement</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                {/* Flouci */}
                <div 
                  onClick={() => setPaymentMethod('flouci')}
                  style={{ 
                    padding: 20, borderRadius: 'var(--pd-radius-lg)', border: `2px solid ${paymentMethod === 'flouci' ? 'var(--pd-green)' : 'var(--pd-border)'}`,
                    backgroundColor: paymentMethod === 'flouci' ? 'var(--pd-green-bg)' : 'var(--pd-bg-secondary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 200ms ease'
                  }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: '50%', border: `6px solid ${paymentMethod === 'flouci' ? 'var(--pd-green)' : 'var(--pd-border)'}` }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 'var(--pd-fs-base)', color: 'var(--pd-text-primary)' }}>Carte Bancaire / Flouci</h3>
                    <p style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)' }}>Paiement sécurisé via Flouci</p>
                  </div>
                  <CreditCard size={24} style={{ color: paymentMethod === 'flouci' ? 'var(--pd-green)' : 'var(--pd-text-tertiary)' }} />
                </div>

                {/* Konnect */}
                <div 
                  onClick={() => setPaymentMethod('konnect')}
                  style={{ 
                    padding: 20, borderRadius: 'var(--pd-radius-lg)', border: `2px solid ${paymentMethod === 'konnect' ? 'var(--pd-blue)' : 'var(--pd-border)'}`,
                    backgroundColor: paymentMethod === 'konnect' ? 'var(--pd-blue-bg)' : 'var(--pd-bg-secondary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 200ms ease'
                  }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: '50%', border: `6px solid ${paymentMethod === 'konnect' ? 'var(--pd-blue)' : 'var(--pd-border)'}` }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 'var(--pd-fs-base)', color: 'var(--pd-text-primary)' }}>e-Dinar / Konnect</h3>
                    <p style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)' }}>Paiement sécurisé via Konnect Network</p>
                  </div>
                  <CreditCard size={24} style={{ color: paymentMethod === 'konnect' ? 'var(--pd-blue)' : 'var(--pd-text-tertiary)' }} />
                </div>

                {/* COD */}
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  style={{ 
                    padding: 20, borderRadius: 'var(--pd-radius-lg)', border: `2px solid ${paymentMethod === 'cod' ? 'var(--pd-yellow)' : 'var(--pd-border)'}`,
                    backgroundColor: paymentMethod === 'cod' ? 'var(--pd-yellow-bg)' : 'var(--pd-bg-secondary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 200ms ease'
                  }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: '50%', border: `6px solid ${paymentMethod === 'cod' ? 'var(--pd-yellow)' : 'var(--pd-border)'}` }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 'var(--pd-fs-base)', color: 'var(--pd-text-primary)' }}>Paiement à la livraison</h3>
                    <p style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)' }}>Payez en espèces lors de la réception</p>
                  </div>
                  <Truck size={24} style={{ color: paymentMethod === 'cod' ? 'var(--pd-yellow)' : 'var(--pd-text-tertiary)' }} />
                </div>

                {/* Mandat Minute */}
                <div 
                  onClick={() => setPaymentMethod('mandat')}
                  style={{ 
                    padding: 20, borderRadius: 'var(--pd-radius-lg)', border: `2px solid ${paymentMethod === 'mandat' ? 'var(--pd-text-primary)' : 'var(--pd-border)'}`,
                    backgroundColor: paymentMethod === 'mandat' ? 'var(--pd-bg-tertiary)' : 'var(--pd-bg-secondary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 200ms ease'
                  }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: '50%', border: `6px solid ${paymentMethod === 'mandat' ? 'var(--pd-text-primary)' : 'var(--pd-border)'}` }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 'var(--pd-fs-base)', color: 'var(--pd-text-primary)' }}>Mandat Minute (La Poste)</h3>
                    <p style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)' }}>Virement postal. Validation manuelle requise.</p>
                  </div>
                  <Receipt size={24} style={{ color: paymentMethod === 'mandat' ? 'var(--pd-text-primary)' : 'var(--pd-text-tertiary)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <Button variant="secondary" onClick={() => setStep(0)}>Retour</Button>
                <Button size="lg" loading={loading} onClick={handleCheckout} style={{ flex: 1 }} icon={<ShieldCheck size={18} />}>
                  Confirmer et Payer {total.toFixed(3)} TND
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div style={{ position: 'sticky', top: 100 }}>
          <Card>
            <h3 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 24 }}>Résumé de la commande</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderBottom: '1px solid var(--pd-border)', paddingBottom: 24, marginBottom: 24 }}>
              {/* Mock items */}
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 64, height: 64, backgroundColor: 'var(--pd-bg-tertiary)', borderRadius: 'var(--pd-radius-md)' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 600 }}>T-shirt Premium Coton</h4>
                  <p style={{ fontSize: 'var(--pd-fs-xs)', color: 'var(--pd-text-secondary)' }}>Qté: 1</p>
                  <p style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 700, marginTop: 4 }}>45.000 TND</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)' }}>
                <span>Sous-total</span>
                <span>{cartTotal.toFixed(3)} TND</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)' }}>
                <span>Livraison estimée</span>
                <span>{deliveryFee.toFixed(3)} TND</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: '2px solid var(--pd-border)' }}>
              <span style={{ fontSize: 'var(--pd-fs-base)', fontWeight: 600 }}>Total</span>
              <span style={{ fontSize: 'var(--pd-fs-xl)', fontWeight: 800, color: 'var(--pd-green)' }}>{total.toFixed(3)} TND</span>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
