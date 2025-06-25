
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import Meist from "./pages/Meist";
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminProductPages from "./pages/admin/ProductPages";
import AdminBlog from "./pages/admin/Blog";
import AdminPages from "./pages/admin/Pages";
import AdminContent from "./pages/admin/Content";
import AdminMeist from "./pages/admin/Meist";
import AdminAssets from "./pages/admin/Assets";
import AdminSEO from "./pages/admin/SEO";
import AdminManual from "./pages/admin/Manual";
import AdminPortfolio from "./pages/admin/Portfolio";
import AdminContact from "./pages/admin/Contact";
import AdminFooter from "./pages/admin/Footer";
import AdminGuarantees from "./pages/admin/Guarantees";
import AdminProductFAQ from "./pages/admin/ProductFAQ";
import AdminPricing from "./pages/admin/pricing";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
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
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
