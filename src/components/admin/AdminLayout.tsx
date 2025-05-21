
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
import { LayoutDashboard, ShoppingBag, FileText, ImageIcon, Settings, Search, LogOut } from "lucide-react";

const AdminLayout: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4">Laadin...</p>
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
                  <span>Töölaud</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/products" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/products") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <ShoppingBag className="h-5 w-5" />
                  <span>Tooted</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/content" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/content") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <FileText className="h-5 w-5" />
                  <span>Sisu</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/assets" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/assets") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <ImageIcon className="h-5 w-5" />
                  <span>Meedia</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/admin/seo" className={`flex items-center gap-2 w-full rounded-md p-2 text-sm ${location.pathname.startsWith("/admin/seo") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground"}`}>
                  <Search className="h-5 w-5" />
                  <span>SEO</span>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-2">
                Sisse logitud: {user.email}
              </p>
              <Button 
                variant="outline" 
                className="w-full flex items-center" 
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logi välja
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
