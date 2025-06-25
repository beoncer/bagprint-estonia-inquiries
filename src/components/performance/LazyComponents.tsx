
import { lazy } from 'react';

// More aggressive lazy loading - split admin components by feature
export const AdminLogin = lazy(() => import("@/pages/admin/Login"));
export const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));

// Core admin functionality
export const AdminProducts = lazy(() => import("@/pages/admin/Products"));
export const AdminPricing = lazy(() => import("@/pages/admin/pricing"));

// Content management (separate chunk)
export const AdminProductPages = lazy(() => import("@/pages/admin/ProductPages"));
export const AdminBlog = lazy(() => import("@/pages/admin/Blog"));
export const AdminPages = lazy(() => import("@/pages/admin/Pages"));
export const AdminContent = lazy(() => import("@/pages/admin/Content"));

// Settings and configuration (separate chunk)
export const AdminMeist = lazy(() => import("@/pages/admin/Meist"));
export const AdminAssets = lazy(() => import("@/pages/admin/Assets"));
export const AdminSEO = lazy(() => import("@/pages/admin/SEO"));
export const AdminManual = lazy(() => import("@/pages/admin/Manual"));

// Secondary features (separate chunk)
export const AdminPortfolio = lazy(() => import("@/pages/admin/Portfolio"));
export const AdminContact = lazy(() => import("@/pages/admin/Contact"));
export const AdminFooter = lazy(() => import("@/pages/admin/Footer"));
export const AdminGuarantees = lazy(() => import("@/pages/admin/Guarantees"));
export const AdminProductFAQ = lazy(() => import("@/pages/admin/ProductFAQ"));

// Lazy load public pages with smaller chunks
export const Index = lazy(() => import("@/pages/Index"));
export const Products = lazy(() => import("@/pages/Products"));
export const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
export const Contact = lazy(() => import("@/pages/Contact"));
export const Meist = lazy(() => import("@/pages/Meist"));
export const Portfolio = lazy(() => import("@/pages/Portfolio"));
export const Blog = lazy(() => import("@/pages/Blog"));
export const BlogPost = lazy(() => import("@/pages/BlogPost"));
export const NotFound = lazy(() => import("@/pages/NotFound"));
