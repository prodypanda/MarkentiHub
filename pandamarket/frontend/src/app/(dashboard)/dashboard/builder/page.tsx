'use client';
import React, { useState } from 'react';
import { GripVertical, Plus, Save, Layout, Image as ImageIcon, Type, ShoppingBag } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

type BlockType = 'hero' | 'featured_products' | 'banner' | 'text_block';

interface BuilderBlock {
  id: string;
  type: BlockType;
  title: string;
  config?: any;
}

const AVAILABLE_BLOCKS = [
  { type: 'hero', icon: <Layout size={18} />, title: 'Section Héros' },
  { type: 'featured_products', icon: <ShoppingBag size={18} />, title: 'Produits Phares' },
  { type: 'banner', icon: <ImageIcon size={18} />, title: 'Bannière Image' },
  { type: 'text_block', icon: <Type size={18} />, title: 'Bloc de Texte' },
];

export default function BuilderPage() {
  const [blocks, setBlocks] = useState<BuilderBlock[]>([
    { id: '1', type: 'hero', title: 'Section Héros' },
    { id: '2', type: 'featured_products', title: 'Produits Phares' }
  ]);

  const addBlock = (type: BlockType, title: string) => {
    setBlocks([...blocks, { id: Date.now().toString(), type, title }]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newBlocks = [...blocks];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      setBlocks(newBlocks);
    } else if (direction === 'down' && index < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      setBlocks(newBlocks);
    }
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 4 }}>Constructeur de Boutique</h1>
          <p style={{ color: 'var(--pd-text-secondary)' }}>Personnalisez l'apparence de votre vitrine (SaaS Mode)</p>
        </div>
        <Button icon={<Save size={16} />}>Sauvegarder le layout</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, flex: 1, minHeight: 0 }}>
        
        {/* Sidebar Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto', paddingRight: 8 }}>
          <Card>
            <h3 style={{ fontSize: 'var(--pd-fs-base)', fontWeight: 700, marginBottom: 16 }}>Blocs Actifs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {blocks.map((block, idx) => (
                <div key={block.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, backgroundColor: 'var(--pd-bg-secondary)', border: '1px solid var(--pd-border)', borderRadius: 'var(--pd-radius-sm)' }}>
                  <GripVertical size={16} style={{ color: 'var(--pd-text-tertiary)', cursor: 'grab' }} />
                  <span style={{ flex: 1, fontSize: 'var(--pd-fs-sm)', fontWeight: 500 }}>{block.title}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button onClick={() => moveBlock(idx, 'up')} disabled={idx === 0} style={{ border: 'none', background: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', fontSize: 10 }}>▲</button>
                    <button onClick={() => moveBlock(idx, 'down')} disabled={idx === blocks.length - 1} style={{ border: 'none', background: 'none', cursor: idx === blocks.length - 1 ? 'not-allowed' : 'pointer', fontSize: 10 }}>▼</button>
                  </div>
                  <button onClick={() => removeBlock(block.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--pd-red)', fontSize: 'var(--pd-fs-lg)' }}>&times;</button>
                </div>
              ))}
              {blocks.length === 0 && <p style={{ fontSize: 'var(--pd-fs-sm)', color: 'var(--pd-text-tertiary)', textAlign: 'center' }}>Aucun bloc.</p>}
            </div>
          </Card>

          <Card>
            <h3 style={{ fontSize: 'var(--pd-fs-base)', fontWeight: 700, marginBottom: 16 }}>Ajouter un bloc</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {AVAILABLE_BLOCKS.map(block => (
                <button 
                  key={block.type}
                  onClick={() => addBlock(block.type as BlockType, block.title)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, backgroundColor: 'var(--pd-bg-primary)', border: '1px dashed var(--pd-border)', borderRadius: 'var(--pd-radius-sm)', cursor: 'pointer', textAlign: 'left', transition: 'all var(--pd-transition)' }}
                  className="hover-lift"
                >
                  <div style={{ color: 'var(--pd-green)' }}>{block.icon}</div>
                  <span style={{ flex: 1, fontSize: 'var(--pd-fs-sm)', fontWeight: 500 }}>{block.title}</span>
                  <Plus size={16} style={{ color: 'var(--pd-text-tertiary)' }} />
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Canvas Preview */}
        <div style={{ backgroundColor: 'var(--pd-bg-secondary)', borderRadius: 'var(--pd-radius-lg)', border: '1px solid var(--pd-border)', overflowY: 'auto', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
            <Badge variant="info">Aperçu en direct</Badge>
          </div>
          <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {blocks.map(block => (
              <div key={block.id} style={{ padding: 48, border: '2px dashed var(--pd-border)', borderRadius: 'var(--pd-radius-md)', backgroundColor: 'var(--pd-bg-primary)', textAlign: 'center' }}>
                <h2 style={{ fontSize: 'var(--pd-fs-xl)', color: 'var(--pd-text-secondary)', fontWeight: 700 }}>{block.title}</h2>
                <p style={{ color: 'var(--pd-text-tertiary)', marginTop: 8 }}>Zone de configuration pour {block.type}</p>
              </div>
            ))}
            {blocks.length === 0 && (
              <div style={{ padding: 64, textAlign: 'center', color: 'var(--pd-text-tertiary)' }}>
                Commencez par glisser des blocs depuis la barre latérale.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
