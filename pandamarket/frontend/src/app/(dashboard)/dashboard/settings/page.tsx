// pandamarket/frontend/src/app/(dashboard)/dashboard/settings/page.tsx
'use client';
import React, { useState } from 'react';
import { Save, Globe, Palette, Image } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function SettingsPage() {
  const [storeName, setStoreName] = useState('Ma Boutique');
  const [description, setDescription] = useState('');
  const [subdomain] = useState('ma-boutique');
  const [primaryColor, setPrimaryColor] = useState('#16C784');

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 32 }}>Paramètres</h1>

      {/* Store Info */}
      <Card style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 20 }}>Informations</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
          <Input label="Nom de la boutique" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          <div>
            <label style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Description</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              rows={3} placeholder="Décrivez votre boutique..."
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 'var(--pd-radius-sm)',
                border: '1px solid var(--pd-border)', backgroundColor: 'var(--pd-bg-secondary)',
                color: 'var(--pd-text-primary)', fontSize: 'var(--pd-fs-base)',
                resize: 'vertical', fontFamily: 'inherit', outline: 'none',
              }}
            />
          </div>
          <Button icon={<Save size={16} />} style={{ alignSelf: 'flex-start' }}>Enregistrer</Button>
        </div>
      </Card>

      {/* Domain */}
      <Card style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Globe size={20} /> Domaine
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
          <div>
            <label style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Sous-domaine</label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 0,
              border: '1px solid var(--pd-border)', borderRadius: 'var(--pd-radius-sm)', overflow: 'hidden',
            }}>
              <input
                value={subdomain} readOnly
                style={{
                  flex: 1, padding: '10px 14px', border: 'none', outline: 'none',
                  backgroundColor: 'var(--pd-bg-tertiary)', color: 'var(--pd-text-primary)',
                  fontSize: 'var(--pd-fs-base)',
                }}
              />
              <span style={{
                padding: '10px 14px', backgroundColor: 'var(--pd-bg-secondary)',
                color: 'var(--pd-text-tertiary)', fontSize: 'var(--pd-fs-sm)',
                borderLeft: '1px solid var(--pd-border)', whiteSpace: 'nowrap',
              }}>.pandamarket.tn</span>
            </div>
          </div>
          <Input label="Domaine personnalisé" placeholder="www.votre-domaine.tn" icon={<Globe size={16} />} hint="Disponible à partir du plan Starter" />
        </div>
      </Card>

      {/* Theme */}
      <Card style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Palette size={20} /> Apparence
        </h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {['minimal', 'classic', 'modern'].map((theme) => (
            <div key={theme} style={{
              width: 160, padding: 16, borderRadius: 'var(--pd-radius-lg)',
              border: theme === 'minimal' ? '2px solid var(--pd-green)' : '1px solid var(--pd-border)',
              cursor: 'pointer', textAlign: 'center', transition: 'all var(--pd-transition)',
            }}>
              <div style={{
                height: 80, borderRadius: 'var(--pd-radius-md)',
                backgroundColor: 'var(--pd-bg-tertiary)', marginBottom: 8,
              }} />
              <span style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 600, textTransform: 'capitalize' }}>{theme}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 500 }}>Couleur principale</label>
          <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ width: 40, height: 40, border: 'none', cursor: 'pointer', borderRadius: 'var(--pd-radius-sm)' }} />
          <span style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)' }}>{primaryColor}</span>
        </div>
      </Card>

      {/* Developer API */}
      <Card>
        <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          Développeur (API)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
          <p style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-secondary)' }}>
            Générez une clé API pour connecter votre boutique à des applications tierces (Plan Pro requis).
          </p>
          <Button 
            variant="outline" 
            onClick={async () => {
              try {
                // Using standard fetch since SWR api is for reading primarily in this mock
                const res = await fetch('/api/pd/api-keys', { method: 'POST', body: JSON.stringify({ label: 'Nouvelle Clé' }), headers: {'Content-Type': 'application/json'} });
                const data = await res.json();
                if (data.raw_key) {
                  alert(`Votre clé API: ${data.raw_key}\nCopiez-la maintenant, elle ne sera plus affichée.`);
                }
              } catch (e) {
                alert('Erreur: impossible de générer la clé');
              }
            }}
          >
            Générer une nouvelle clé API
          </Button>

          <div style={{ marginTop: 16, borderTop: '1px solid var(--pd-border)', paddingTop: 16 }}>
             <Input label="Webhook URL (Notification commandes)" placeholder="https://votre-serveur.com/webhook" />
             <Button size="sm" style={{ marginTop: 12 }}>Enregistrer Webhook</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
