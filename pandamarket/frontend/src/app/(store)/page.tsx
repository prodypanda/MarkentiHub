import React from 'react';

export default function StoreHomepage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
      
      {/* Themed Hero Section */}
      <section style={{
        padding: '80px 40px',
        backgroundColor: 'var(--store-bg)',
        border: '1px solid var(--store-border)',
        borderRadius: 'var(--store-radius)',
        boxShadow: 'var(--store-shadow)',
        textAlign: 'center',
        transition: 'all 0.3s ease'
      }}>
        <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>Bienvenue sur notre boutique</h2>
        <p style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
          Découvrez nos collections exclusives. La meilleure qualité, sélectionnée pour vous.
        </p>
        <button style={{
          marginTop: '30px',
          padding: '12px 32px',
          backgroundColor: 'var(--store-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--store-radius)',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'opacity 0.2s ease'
        }}
        onMouseOver={e => (e.currentTarget.style.opacity = '0.9')}
        onMouseOut={e => (e.currentTarget.style.opacity = '1')}
        >
          Voir le Catalogue
        </button>
      </section>

      {/* Themed Product Grid */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Nouveautés</h3>
          <a href="#" style={{ color: 'var(--store-primary)', textDecoration: 'none', fontWeight: 600 }}>Voir tout &rarr;</a>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{
              padding: '20px',
              border: '1px solid var(--store-border)',
              borderRadius: 'var(--store-radius)',
              boxShadow: 'var(--store-shadow)',
              backgroundColor: 'var(--store-bg)',
              transition: 'transform 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ width: '100%', height: '220px', backgroundColor: 'rgba(128,128,128,0.1)', borderRadius: 'var(--store-radius)', marginBottom: '16px' }} />
              <h4 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1rem' }}>Produit Démo {i}</h4>
              <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '16px' }}>Catégorie Exemple</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'var(--store-primary)', fontWeight: '800', fontSize: '1.2rem' }}>45.000 TND</p>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--store-border)',
                  color: 'var(--store-text)',
                  borderRadius: 'var(--store-radius)',
                  cursor: 'pointer'
                }}>+ Panier</button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
