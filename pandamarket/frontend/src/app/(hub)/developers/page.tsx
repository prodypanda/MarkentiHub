'use client';

import React, { useEffect } from 'react';

export default function DevelopersPortal() {
  useEffect(() => {
    // Dynamically load Swagger UI CSS and JS from CDN to avoid npm dependency issues
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css';
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js';
    script.async = true;
    
    const presetScript = document.createElement('script');
    presetScript.src = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js';
    presetScript.async = true;
    
    // We must wait for both scripts to load
    let scriptsLoaded = 0;
    const onLoad = () => {
      scriptsLoaded++;
      if (scriptsLoaded === 2) {
        // @ts-ignore
        window.ui = SwaggerUIBundle({
          url: "/swagger.json",
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            // @ts-ignore
            SwaggerUIBundle.presets.apis,
            // @ts-ignore
            SwaggerUIStandalonePreset
          ],
          plugins: [
            // @ts-ignore
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: "StandaloneLayout"
        });
      }
    };

    script.onload = onLoad;
    presetScript.onload = onLoad;

    document.body.appendChild(presetScript);
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(css);
      if (document.body.contains(script)) document.body.removeChild(script);
      if (document.body.contains(presetScript)) document.body.removeChild(presetScript);
    };
  }, []);

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', backgroundColor: '#fff' }} className="animate-fade-in">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', paddingBottom: 64 }}>
        <h1 style={{ fontSize: 'var(--pd-fs-3xl)', fontWeight: 800, marginBottom: 16 }}>Portail Développeurs</h1>
        <p style={{ color: 'var(--pd-text-secondary)', marginBottom: 40, maxWidth: 600 }}>
          Intégrez votre ERP ou votre application mobile directement via notre API REST publique. Générez une clé API depuis votre tableau de bord Pro pour commencer.
        </p>
        
        {/* Swagger UI Container */}
        <div id="swagger-ui" style={{ borderRadius: 'var(--pd-radius-lg)', overflow: 'hidden', border: '1px solid var(--pd-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}></div>
      </div>
    </div>
  );
}
