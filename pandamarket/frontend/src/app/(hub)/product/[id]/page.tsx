import React from 'react';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const data = await api.getProduct(params.id) as any;
    const product = data.product;
    
    if (!product) return { title: 'Produit non trouvé | PandaMarket' };

    const title = product.metadata?.seo_title || `${product.title} | PandaMarket`;
    const description = product.metadata?.seo_description || product.description || `Achetez ${product.title} sur PandaMarket.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: product.thumbnail ? [{ url: product.thumbnail }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: product.thumbnail ? [product.thumbnail] : [],
      }
    };
  } catch (error) {
    return { title: 'PandaMarket' };
  }
}

export default async function HubProductPage({ params }: { params: { id: string } }) {
  let product;
  try {
    // Fetch product details via Medusa Storefront API
    const data = await api.getProduct(params.id) as any;
    product = data.product;
  } catch (error) {
    return notFound();
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 xl:gap-x-16">
        
        {/* Image Gallery */}
        <div className="flex flex-col-reverse">
          <div className="aspect-w-1 aspect-h-1 w-full rounded-lg overflow-hidden bg-gray-100 mt-6">
            <img 
              src={product.thumbnail || '/placeholder.png'} 
              alt={product.title} 
              className="w-full h-full object-center object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.title}</h1>
          <div className="mt-3">
            <h2 className="sr-only">Product Information</h2>
            <p className="text-3xl text-gray-900">
              {product.variants?.[0]?.prices?.[0]?.amount 
                ? `${(product.variants[0].prices[0].amount / 100).toFixed(2)} TND` 
                : 'Prix sur demande'}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6">
              <p>{product.description}</p>
            </div>
          </div>

          {product.metadata?.store_id && (
            <div className="mt-6 flex items-center">
              <Badge variant="neutral" className="text-sm">
                Vendu par Store ID: {product.metadata.store_id}
              </Badge>
            </div>
          )}

          <div className="mt-10 flex sm:flex-col1">
            <Button variant="primary" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3">
              Ajouter au panier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
