'use client';

import React, { useState } from 'react';
import GjsEditor from '@grapesjs/react';
import type { Editor } from 'grapesjs';
import grapesjsPresetWebpage from 'grapesjs-preset-webpage';
import Button from '@/components/ui/Button';
import { Save } from 'lucide-react';

export default function BuilderPage() {
  const [editor, setEditor] = useState<Editor | null>(null);

  const onEditor = (editorInstance: Editor) => {
    setEditor(editorInstance);
  };

  const saveLayout = async () => {
    if (!editor) return;
    const html = editor.getHtml();
    const css = editor.getCss();
    
    // In a real implementation, this would save to the pd-store module via API
    console.log('Saved layout!', { htmlLength: html.length, cssLength: css.length });
    alert('Layout sauvegardé avec succès!');
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 'var(--pd-fs-2xl)', fontWeight: 800, marginBottom: 4 }}>Constructeur de Boutique</h1>
          <p style={{ color: 'var(--pd-text-secondary)' }}>Personnalisez l'apparence de votre vitrine (SaaS Mode) via GrapesJS</p>
        </div>
        <Button onClick={saveLayout} icon={<Save size={16} />}>Sauvegarder le layout</Button>
      </div>

      <div style={{ flex: 1, border: '1px solid var(--pd-border)', borderRadius: 'var(--pd-radius-lg)', overflow: 'hidden', backgroundColor: '#fff' }}>
        <GjsEditor
          className="gjs-custom-editor"
          options={{
            height: '100%',
            storageManager: false,
            plugins: [grapesjsPresetWebpage],
          }}
          onEditor={onEditor}
        />
      </div>
      
      {/* Include standard GrapesJS CSS from CDN to ensure it renders correctly before a custom theme is built */}
      <link rel="stylesheet" href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" />
    </div>
  );
}
