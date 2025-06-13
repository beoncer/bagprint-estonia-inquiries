import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";

// Import pages
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Meist from "./pages/Meist";
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
// Admin imports
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminContent from "./pages/admin/Content";
import AdminAssets from "./pages/admin/Assets";
import AdminSEO from "./pages/admin/SEO";
import AdminManual from "./pages/admin/Manual";
import PagesAdmin from "./pages/admin/Pages";
import MainLayout from "./components/layout/MainLayout";
import PortfolioAdmin from "./pages/admin/Portfolio";
import FooterAdmin from "./pages/admin/Footer";
import BlogAdmin from "./pages/admin/Blog";
import GuaranteesAdmin from "./pages/admin/Guarantees";
import MeistAdmin from "./pages/admin/Meist";
import ContactAdmin from "./pages/admin/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/tooted" element={<Products />} />
            <Route path="/riidest-kotid" element={<Products />} />
            <Route path="/paberkotid" element={<Products />} />
            <Route path="/nooriga-kotid" element={<Products />} />
            <Route path="/sussikotid" element={<Products />} />
            <Route path="/tooted/:slug" element={<ProductDetail />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/meist" element={<Meist />} />
            <Route path="/portfoolio" element={<Portfolio />} />
            <Route path="/blogi" element={<Blog />} />
            <Route path="/blogi/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* Admin Routes */}
          <Route path="/admin/login" element={
            <AuthProvider>
              <AdminLogin />
            </AuthProvider>
          } />
          <Route path="/admin/meist" element={<MeistAdmin />} />
          <Route path="/admin" element={
            <AuthProvider>
              <AdminLayout />
            </AuthProvider>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="assets" element={<AdminAssets />} />
            <Route path="seo" element={<AdminSEO />} />
            <Route path="manual" element={<AdminManual />} />
            <Route path="pages" element={<PagesAdmin />} />
            <Route path="portfolio" element={<PortfolioAdmin />} />
            <Route path="contact" element={<ContactAdmin />} />
            <Route path="footer" element={<FooterAdmin />} />
            <Route path="blog" element={<BlogAdmin />} />
            <Route path="guarantees" element={<GuaranteesAdmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
