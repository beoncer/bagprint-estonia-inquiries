
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

// Import lazy components
import {
  Index,
  Products,
  ProductDetail,
  Contact,
  Meist,
  Portfolio,
  Blog,
  BlogPost,
  NotFound,
  AdminLogin,
  AdminDashboard,
  AdminProducts,
  AdminProductPages,
  AdminBlog,
  AdminPages,
  AdminContent,
  AdminMeist,
  AdminAssets,
  AdminSEO,
  AdminManual,
  AdminPortfolio,
  AdminContact,
  AdminFooter,
  AdminGuarantees,
  AdminProductFAQ,
  AdminPricing
} from "./components/performance/LazyComponents";

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false
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
                  {/* Public routes */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Index />} />
                    <Route path="tooted" element={<Products />} />
                    <Route path="tooted/:slug" element={<ProductDetail />} />
                    <Route path="riidest-kotid" element={<Products />} />
                    <Route path="paberkotid" element={<Products />} />
                    <Route path="nooriga-kotid" element={<Products />} />
                    <Route path="sussikotid" element={<Products />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/:slug" element={<ProductDetail />} />
                    <Route path="kontakt" element={<Contact />} />
                    <Route path="meist" element={<Meist />} />
                    <Route path="portfoolio" element={<Portfolio />} />
                    <Route path="blogi" element={<Blog />} />
                    <Route path="blogi/:slug" element={<BlogPost />} />
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
