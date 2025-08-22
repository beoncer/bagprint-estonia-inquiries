import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/admin/AdminLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import PageTransition from './components/ui/PageTransition';
import SSRHelmet from './components/seo/SSRHelmet';

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
  AdminSitemap,
  AdminManual,
  AdminPortfolio,
  AdminContact,
  AdminFooter,
  AdminGuarantees,
  AdminProductFAQ,
  AdminPricing,
  Privaatsus,
  Ostutingimused
} from './components/performance/LazyComponents';

interface AppRoutesProps {
  routeData?: any;
  currentUrl?: string;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ routeData, currentUrl }) => {
  return (
    <Suspense fallback={<div className="min-h-4" />}>
      {/* SSR Helmet handles SEO for server-side rendering only */}
      {typeof window === 'undefined' && (
        <SSRHelmet 
          product={routeData?.product} 
          pageType={routeData?.pageType}
          url={currentUrl || '/'}
          seoData={routeData?.seoData}
        />
      )}
      
      <Routes>
        {/* Public routes - Estonian only */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={
            <PageTransition>
              <Index />
            </PageTransition>
          } />
          <Route path="tooted" element={
            <PageTransition>
              <Products />
            </PageTransition>
          } />
          <Route path="tooted/:slug" element={
            <PageTransition>
              <ProductDetail />
            </PageTransition>
          } />
          <Route path="riidest-kotid" element={
            <PageTransition>
              <Products />
            </PageTransition>
          } />
          <Route path="paberkotid" element={
            <PageTransition>
              <Products />
            </PageTransition>
          } />
          <Route path="nooriga-kotid" element={
            <PageTransition>
              <Products />
            </PageTransition>
          } />
          <Route path="sussikotid" element={
            <PageTransition>
              <Products />
            </PageTransition>
          } />
          <Route path="kontakt" element={
            <PageTransition>
              <Contact />
            </PageTransition>
          } />
          <Route path="meist" element={
            <PageTransition>
              <Meist />
            </PageTransition>
          } />
          <Route path="portfoolio" element={
            <PageTransition>
              <Portfolio />
            </PageTransition>
          } />
          <Route path="blogi" element={
            <PageTransition>
              <Blog />
            </PageTransition>
          } />
          <Route path="blogi/:slug" element={
            <PageTransition>
              <BlogPost />
            </PageTransition>
          } />
          <Route path="privaatsus" element={
            <PageTransition>
              <Privaatsus />
            </PageTransition>
          } />
          <Route path="ostutingimused" element={
            <PageTransition>
              <Ostutingimused />
            </PageTransition>
          } />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="tooted" element={<AdminProducts />} />
          <Route path="toote-lehed" element={<AdminProductPages />} />
          <Route path="blogi" element={<AdminBlog />} />
          <Route path="lehed" element={<AdminPages />} />
          <Route path="sisu" element={<AdminContent />} />
          <Route path="meist" element={<AdminMeist />} />
          <Route path="varad" element={<AdminAssets />} />
          <Route path="seo" element={<AdminSEO />} />
          <Route path="saidikaar" element={<AdminSitemap />} />
          <Route path="manual" element={<AdminManual />} />
          <Route path="portfoolio" element={<AdminPortfolio />} />
          <Route path="kontakt" element={<AdminContact />} />
          <Route path="jalus" element={<AdminFooter />} />
          <Route path="garantiid" element={<AdminGuarantees />} />
          <Route path="toote-kkk" element={<AdminProductFAQ />} />
          <Route path="hinnad" element={<AdminPricing />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;