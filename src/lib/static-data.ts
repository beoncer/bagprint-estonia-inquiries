import productsData from '../data/products.json'
import seoData from '../data/seo.json'
import contentData from '../data/content.json'
import { Product } from '@/types/product'

export type StaticProduct = Product
export type SEOMetadata = {
  id: string
  page: string
  title: string | null
  description: string | null
  keywords: string | null
}

const products = productsData as StaticProduct[]
const seo = seoData as SEOMetadata[]
const content = contentData as Record<string, string>

export const getAllProducts = () => products
export const getProductBySlug = (slug: string) => products.find(p => p.slug === slug)
export const getSEOData = (page: string) => seo.find(s => s.page === page)
export const getContent = (key: string) => content[key]
export const getAllContent = () => content