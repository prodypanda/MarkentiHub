import React from 'react';
import { headers } from 'next/headers';

async function getStoreProducts(storeId: string) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
  try {
    const res = await fetch(`${BACKEND_URL}/api/pd/products?store_id=${storeId}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return { products: [] };
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('Error fetching products for store', storeId, e);
    return { products: [] };
  }
}

export default async function StoreHomepage() {
  const headersList = headers();
  // The middleware sets this header based on the subdomain or custom domain
  const storeId = headersList.get('x-pd-store-id') || 'default_store';
  
  const { products } = await getStoreProducts(storeId);

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
        
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', border: '1px dashed var(--store-border)', borderRadius: 'var(--store-radius)' }}>
            <p style={{ opacity: 0.6 }}>Aucun produit disponible pour le moment.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {products.map((product: any) => (
              <div key={product.id} style={{
                padding: '20px',
                border: '1px solid var(--store-border)',
                borderRadius: 'var(--store-radius)',
                boxShadow: 'var(--store-shadow)',
                backgroundColor: 'var(--store-bg)',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              >
                <div style={{ width: '100%', height: '220px', backgroundColor: 'rgba(128,128,128,0.1)', borderRadius: 'var(--store-radius)', marginBottom: '16px', overflow: 'hidden' }}>
                  {product.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <h4 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.title}</h4>
                <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '16px' }}>{product.metadata?.category || 'Catégorie'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ color: 'var(--store-primary)', fontWeight: '800', fontSize: '1.2rem' }}>
                    {Number(product.metadata?.price || 0).toFixed(3)} TND
                  </p>
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
        )}
      </section>

    </div>
  );
}
