import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";

// Import pages
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import Inquiry from "./pages/Inquiry";
import NotFound from "./pages/NotFound";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tooted" element={<Products />} />
          <Route path="/riidest-kotid" element={<Products />} />
          <Route path="/paberkotid" element={<Products />} />
          <Route path="/nooriga-kotid" element={<Products />} />
          <Route path="/sussikotid" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/paring" element={<Inquiry />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={
            <AuthProvider>
              <AdminLogin />
            </AuthProvider>
          } />
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
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
