
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import DynamicSEO from "@/components/seo/DynamicSEO";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Lazy load components to reduce initial bundle size
const Index = React.lazy(() => import("./pages/Index"));
const Products = React.lazy(() => import("./pages/Products"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Meist = React.lazy(() => import("./pages/Meist"));
const Portfolio = React.lazy(() => import("./pages/Portfolio"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Admin components
const AdminLogin = React.lazy(() => import("./pages/admin/Login"));
const AdminDashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = React.lazy(() => import("./pages/admin/Products"));
const AdminProductPages = React.lazy(() => import("./pages/admin/ProductPages"));
const AdminBlog = React.lazy(() => import("./pages/admin/Blog"));
const AdminPages = React.lazy(() => import("./pages/admin/Pages"));
const AdminContent = React.lazy(() => import("./pages/admin/Content"));
const AdminMeist = React.lazy(() => import("./pages/admin/Meist"));
const AdminAssets = React.lazy(() => import("./pages/admin/Assets"));
const AdminSEO = React.lazy(() => import("./pages/admin/SEO"));
const AdminManual = React.lazy(() => import("./pages/admin/Manual"));
const AdminPortfolio = React.lazy(() => import("./pages/admin/Portfolio"));
const AdminContact = React.lazy(() => import("./pages/admin/Contact"));
const AdminFooter = React.lazy(() => import("./pages/admin/Footer"));
const AdminGuarantees = React.lazy(() => import("./pages/admin/Guarantees"));
const AdminProductFAQ = React.lazy(() => import("./pages/admin/ProductFAQ"));
const AdminPricing = React.lazy(() => import("./pages/admin/pricing"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 15, // Increased to 15 minutes for better performance
      gcTime: 1000 * 60 * 30, // Increased to 30 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <DynamicSEO />
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public routes with main layout */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Index />} />
                    {/* Estonian product routes */}
                    <Route path="tooted" element={<Products />} />
                    <Route path="tooted/:slug" element={<ProductDetail />} />
                    <Route path="riidest-kotid" element={<Products />} />
                    <Route path="paberkotid" element={<Products />} />
                    <Route path="nooriga-kotid" element={<Products />} />
                    <Route path="sussikotid" element={<Products />} />
                    {/* English product routes for backward compatibility */}
                    <Route path="products" element={<Products />} />
                    <Route path="products/:slug" element={<ProductDetail />} />
                    {/* Estonian page routes */}
                    <Route path="kontakt" element={<Contact />} />
                    <Route path="meist" element={<Meist />} />
                    <Route path="portfoolio" element={<Portfolio />} />
                    <Route path="blogi" element={<Blog />} />
                    <Route path="blogi/:slug" element={<BlogPost />} />
                    {/* English routes for backward compatibility */}
                    <Route path="contact" element={<Contact />} />
                    <Route path="portfolio" element={<Portfolio />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:slug" element={<BlogPost />} />
                  </Route>

                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="product-pages" element={<AdminProductPages />} />
                    <Route path="pricing" element={<AdminPricing />} />
                    <Route path="blog" element={<AdminBlog />} />
                    <Route path="pages" element={<AdminPages />} />
                    <Route path="content" element={<AdminContent />} />
                    <Route path="meist" element={<AdminMeist />} />
                    <Route path="assets" element={<AdminAssets />} />
                    <Route path="seo" element={<AdminSEO />} />
                    <Route path="manual" element={<AdminManual />} />
                    <Route path="portfolio" element={<AdminPortfolio />} />
                    <Route path="contact" element={<AdminContact />} />
                    <Route path="footer" element={<AdminFooter />} />
                    <Route path="guarantees" element={<AdminGuarantees />} />
                    <Route path="product-faq" element={<AdminProductFAQ />} />
                  </Route>

                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
