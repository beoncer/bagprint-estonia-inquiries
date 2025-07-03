
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

export interface ProductBreadcrumbData {
  id: string;
  name: string;
  type: string;
  slug: string;
}

export interface BlogPostBreadcrumbData {
  id: string;
  title: string;
  slug: string;
}

export type PageType = 'home' | 'products' | 'product-detail' | 'blog' | 'blog-post' | 'static';

export interface BreadcrumbContext {
  pageType: PageType;
  productData?: ProductBreadcrumbData;
  blogPostData?: BlogPostBreadcrumbData;
  categoryId?: string;
}
