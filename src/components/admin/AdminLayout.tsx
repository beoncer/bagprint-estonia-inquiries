
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
                <SidebarMenuButton
                  as={Link}
                  to="/admin"
                  isActive={location.pathname === "/admin"}
                  tooltip="Töölaud"
                >
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  <span>Töölaud</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  as={Link}
                  to="/admin/products"
                  isActive={location.pathname.startsWith("/admin/products")}
                  tooltip="Tooted"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  <span>Tooted</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  as={Link}
                  to="/admin/content"
                  isActive={location.pathname.startsWith("/admin/content")}
                  tooltip="Sisu"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  <span>Sisu</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  as={Link}
                  to="/admin/assets"
                  isActive={location.pathname.startsWith("/admin/assets")}
                  tooltip="Meedia"
                >
                  <ImageIcon className="h-5 w-5 mr-2" />
                  <span>Meedia</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  as={Link}
                  to="/admin/seo"
                  isActive={location.pathname.startsWith("/admin/seo")}
                  tooltip="SEO"
                >
                  <Search className="h-5 w-5 mr-2" />
                  <span>SEO</span>
                </SidebarMenuButton>
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
