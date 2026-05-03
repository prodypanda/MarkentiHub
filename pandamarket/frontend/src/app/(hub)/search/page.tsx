// pandamarket/frontend/src/app/(hub)/search/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, X, ShoppingCart } from 'lucide-react';
import { Meilisearch } from 'meilisearch';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';

const MEILI_HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700';
const MEILI_KEY = process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || 'masterKey';
const INDEX_NAME = 'pandamarket_products';

const client = new Meilisearch({
  host: MEILI_HOST,
  apiKey: MEILI_KEY,
});

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [facets, setFacets] = useState<any>({});
  
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortOrder, setSortOrder] = useState('relevance');

  const performSearch = async () => {
    setLoading(true);
    try {
      const index = client.index(INDEX_NAME);
      
      const filterOptions = [];
      if (selectedCategory) filterOptions.push(`category = "${selectedCategory}"`);
      filterOptions.push(`price >= ${priceRange[0]} AND price <= ${priceRange[1]}`);

      const searchRes = await index.search(query, {
        filter: filterOptions,
        facets: ['category', 'vendor_name'],
        sort: sortOrder !== 'relevance' ? [sortOrder] : undefined,
      });

      setResults(searchRes.hits);
      setFacets(searchRes.facetDistribution || {});
    } catch (e) {
      console.error('Meilisearch error:', e);
      // Fallback for dev if Meilisearch is not running
      setResults([
        { id: '1', title: 'T-shirt Premium Coton', price: 45.0, vendor_name: 'Style TN', category: 'vetements' },
        { id: '2', title: 'Casquette Logo', price: 25.0, vendor_name: 'Urbain', category: 'vetements' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      performSearch();
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedCategory, priceRange, sortOrder]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--pd-bg-primary)',
      paddingTop: 100, // Navbar offset
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header & Search Bar */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1 style={{ fontSize: 'var(--pd-fs-3xl)', fontWeight: 800, marginBottom: 16 }}>
            Découvrez nos produits
          </h1>
          <div style={{ 
            position: 'relative', maxWidth: 600, margin: '0 auto',
            boxShadow: '0 8px 30px rgba(0,0,0,0.05)', borderRadius: 'var(--pd-radius-full)'
          }}>
            <SearchIcon size={24} style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: 'var(--pd-text-tertiary)' }} />
            <input 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher par produit, marque ou catégorie..."
              style={{
                width: '100%', padding: '20px 24px 20px 64px',
                borderRadius: 'var(--pd-radius-full)', border: '2px solid transparent',
                fontSize: 'var(--pd-fs-lg)', outline: 'none',
                backgroundColor: 'var(--pd-bg-secondary)', color: 'var(--pd-text-primary)',
                transition: 'border-color var(--pd-transition)'
              }}
              className="focus-glow"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32, alignItems: 'start' }}>
          
          {/* Sidebar Filters */}
          <Card style={{ position: 'sticky', top: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Filter size={20} />
              <h2 style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 700 }}>Filtres</h2>
            </div>

            {/* Categories Facet */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', color: 'var(--pd-text-tertiary)' }}>
                Catégories
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button 
                  onClick={() => setSelectedCategory('')}
                  style={{ 
                    textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                    color: selectedCategory === '' ? 'var(--pd-green)' : 'var(--pd-text-secondary)',
                    fontWeight: selectedCategory === '' ? 600 : 400,
                  }}
                >
                  Toutes
                </button>
                {Object.entries(facets.category || {}).map(([cat, count]: [string, any]) => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{ 
                      display: 'flex', justifyContent: 'space-between',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: selectedCategory === cat ? 'var(--pd-green)' : 'var(--pd-text-secondary)',
                      fontWeight: selectedCategory === cat ? 600 : 400,
                    }}
                  >
                    <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                    <span style={{ fontSize: 'var(--pd-fs-xs)', backgroundColor: 'var(--pd-bg-tertiary)', padding: '2px 6px', borderRadius: 10 }}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 style={{ fontSize: 'var(--pd-fs-sm)', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', color: 'var(--pd-text-tertiary)' }}>
                Prix (TND)
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input 
                  type="number" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                  style={{ width: '100%', padding: 8, borderRadius: 'var(--pd-radius-sm)', border: '1px solid var(--pd-border)', backgroundColor: 'var(--pd-bg-tertiary)' }}
                />
                <span>-</span>
                <input 
                  type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  style={{ width: '100%', padding: 8, borderRadius: 'var(--pd-radius-sm)', border: '1px solid var(--pd-border)', backgroundColor: 'var(--pd-bg-tertiary)' }}
                />
              </div>
            </div>
          </Card>

          {/* Results Grid */}
          <div>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <p style={{ color: 'var(--pd-text-secondary)' }}>
                {loading ? 'Recherche en cours...' : `${results.length} résultats trouvés`}
              </p>
              <select 
                value={sortOrder} 
                onChange={e => setSortOrder(e.target.value)}
                style={{ padding: '8px 16px', borderRadius: 'var(--pd-radius-sm)', border: '1px solid var(--pd-border)', backgroundColor: 'var(--pd-bg-secondary)', outline: 'none' }}
              >
                <option value="relevance">Pertinence</option>
                <option value="price:asc">Prix croissant</option>
                <option value="price:desc">Prix décroissant</option>
                <option value="created_at:desc">Nouveautés</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}><SkeletonCard /></div>
                ))
              ) : results.length > 0 ? (
                results.map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none' }}>
                    <div style={{ 
                      backgroundColor: 'var(--pd-bg-secondary)', borderRadius: 'var(--pd-radius-lg)', 
                      border: '1px solid var(--pd-border)', overflow: 'hidden', cursor: 'pointer',
                      transition: 'transform var(--pd-transition), box-shadow var(--pd-transition)'
                    }} className="hover-lift">
                      <div style={{ height: 240, backgroundColor: 'var(--pd-bg-tertiary)', position: 'relative' }}>
                        {product.thumbnail && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        <Badge style={{ position: 'absolute', top: 12, left: 12 }}>{product.vendor_name}</Badge>
                      </div>
                      <div style={{ padding: 16 }}>
                        <h3 style={{ fontSize: 'var(--pd-fs-base)', fontWeight: 600, color: 'var(--pd-text-primary)', marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {product.title}
                        </h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                          <span style={{ fontSize: 'var(--pd-fs-lg)', fontWeight: 800, color: 'var(--pd-green)' }}>
                            {Number(product.price).toFixed(3)} TND
                          </span>
                          <button style={{ 
                            width: 36, height: 36, borderRadius: '50%', border: 'none', 
                            backgroundColor: 'var(--pd-bg-primary)', color: 'var(--pd-text-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <ShoppingCart size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 64 }}>
                  <SearchIcon size={48} style={{ color: 'var(--pd-border)', margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: 'var(--pd-fs-xl)', fontWeight: 700, marginBottom: 8 }}>Aucun produit trouvé</h3>
                  <p style={{ color: 'var(--pd-text-secondary)' }}>Essayez de modifier vos filtres ou termes de recherche.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
