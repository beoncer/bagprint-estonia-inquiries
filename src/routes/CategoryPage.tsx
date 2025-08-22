import React from 'react'
import { getAllProducts } from '../lib/static-data'

export default function CategoryPage() {
  const products = getAllProducts()
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tooted</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
            {product.image_url && (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
                loading="lazy"
              />
            )}
            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">
                Alates €{product.base_price}
              </span>
              <a 
                href={`/tooted/${product.slug}`}
                className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors text-sm"
              >
                Vaata toodet
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}