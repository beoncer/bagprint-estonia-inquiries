import React from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import {
  SidebarProvider,
  Sidebar,
  SidebarMenu,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, FileText, ImageIcon, Search, LogOut, HelpCircle, Briefcase, BookOpen, ShieldCheck, Phone, Package } from "lucide-react";

const AdminLayout: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center px-2 py-4">
              <h2 className="text-xl font-bold text-red-600">Admin Panel</h2>
              <SidebarTrigger className="ml-auto" />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link to="/admin" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname === "/admin" ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/products" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/products") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <ShoppingBag className="h-5 w-5" />
                  <span>Products</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/product-pages" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/product-pages") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <Package className="h-5 w-5" />
                  <span>Product Pages</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/blog" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/blog") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <BookOpen className="h-5 w-5" />
                  <span>Blog</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/pages" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/pages") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <FileText className="h-5 w-5" />
                  <span>Pages</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/content" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/content") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <FileText className="h-5 w-5" />
                  <span>Content</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/meist" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/meist") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <FileText className="h-5 w-5" />
                  <span>Meist</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/assets" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/assets") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <ImageIcon className="h-5 w-5" />
                  <span>Media</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/seo" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/seo") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <Search className="h-5 w-5" />
                  <span>SEO</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/manual" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/manual") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <HelpCircle className="h-5 w-5" />
                  <span>User Manual</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/portfolio" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/portfolio") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <Briefcase className="h-5 w-5" />
                  <span>Portfolio</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/contact" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/contact") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <Phone className="h-5 w-5" />
                  <span>Contact</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/footer" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/footer") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Footer</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/guarantees" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/guarantees") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <ShieldCheck className="h-5 w-5" />
                  <span>Guarantees</span>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-2">
                Logged in as: {user.email}
              </p>
              <Button 
                variant="outline" 
                className="w-full flex items-center" 
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="p-6 flex-1 overflow-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
