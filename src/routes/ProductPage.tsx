import React from 'react'
import type { StaticProduct } from '../lib/static-data'

interface ProductPageProps {
  product: StaticProduct
}

export default function ProductPage({ product }: ProductPageProps) {
  const displayImage = product.color_images && product.main_color 
    ? product.color_images[product.main_color] 
    : product.image_url

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          {displayImage && (
            <img 
              src={displayImage}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          )}
          {product.additional_images && product.additional_images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {product.additional_images.slice(0, 4).map((img, idx) => (
                <img 
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  className="w-full h-20 object-cover rounded"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">
              {product.description}
            </p>
          </div>

          {/* Pricing */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Hinnad</h3>
            <p className="text-2xl font-bold text-primary">
              Alates €{product.base_price}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Hind sõltub kogusest ja trüki nõuetest
            </p>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            {product.material && (
              <div>
                <span className="font-semibold">Materjal: </span>
                <span>{product.material}</span>
              </div>
            )}
            
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <span className="font-semibold">Saadaolevad suurused: </span>
                <span>{product.sizes.join(', ')}</span>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <span className="font-semibold">Saadaolevad värvid: </span>
                <span>{product.colors.join(', ')}</span>
              </div>
            )}

            {product.is_eco && (
              <div className="flex items-center space-x-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  🌱 Keskkonnasõbralik
                </span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="pt-4">
            <a 
              href="/kontakt" 
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-block text-center w-full"
            >
              Küsi hinnapakkumist
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}