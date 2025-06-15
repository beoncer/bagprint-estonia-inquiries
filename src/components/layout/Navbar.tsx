
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Page {
  id: string;
  name: string;
  url_et: string;
  visible: boolean;
  sort_order: number | null;
}

const fetchPages = async (): Promise<Page[]> => {
  const { data, error } = await supabase
    .from('pages')
    .select('id, name, url_et, visible, sort_order')
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const [navbarLogoUrl, setNavbarLogoUrl] = useState<string>("");

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: fetchPages,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    const fetchNavbarLogo = async () => {
      const { data, error } = await supabase
        .from("website_content")
        .select("value")
        .eq("page", "global")
        .eq("key", "navbar_logo_url")
        .single();
      if (!error && data) setNavbarLogoUrl(data.value);
    };
    fetchNavbarLogo();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Ensure URLs are absolute paths
  const getAbsolutePath = (url: string) => {
    if (url.startsWith('/')) {
      return url;
    }
    return `/${url}`;
  };

  const handleLinkClick = (url: string) => {
    console.log('Navbar link clicked:', url, 'Current location:', location.pathname);
    setIsOpen(false);
  };

  // Hardcoded navigation items that should always appear
  const staticNavItems = [
    { name: "Blogi", url: "/blogi" },
    { name: "Tehtud tööd", url: "/portfoolio" }
  ];

  // Remove duplicates from staticNavItems if they already exist in pages
  const navNames = new Set(pages.map(p => p.name));
  const filteredStaticNavItems = staticNavItems.filter(item => !navNames.has(item.name));

  return (
    <nav className="w-full z-50">
      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20 py-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="text-4xl font-bold text-primary flex items-center gap-2"
              onClick={() => handleLinkClick('/')}
            >
              {navbarLogoUrl ? (
                <img src={navbarLogoUrl} alt="Leatex logo" className="h-10 w-auto max-w-[180px] object-contain" />
              ) : (
                "Leatex"
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 items-center">
              {isLoading ? (
                // Show minimal placeholder during loading
                <div className="flex space-x-4">
                  <span className="text-gray-400">Loading...</span>
                </div>
              ) : (
                <>
                  {pages.map((page) => {
                    const absolutePath = getAbsolutePath(page.url_et);
                    return (
                      <Link 
                        key={page.id}
                        to={absolutePath}
                        className="text-gray-800 font-medium hover:text-primary transition-colors"
                        onClick={() => handleLinkClick(absolutePath)}
                      >
                        {page.name}
                      </Link>
                    );
                  })}
                  {filteredStaticNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.url}
                      className="text-gray-800 font-medium hover:text-primary transition-colors"
                      onClick={() => handleLinkClick(item.url)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
              <Button asChild>
                <Link 
                  to="/kontakt"
                  onClick={() => handleLinkClick('/kontakt')}
                >
                  Küsi pakkumist
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMenu}
                className="text-gray-800 hover:text-primary"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden pt-4 pb-2 animate-fade-in bg-white rounded-lg mt-2">
              <div className="flex flex-col space-y-3">
                {isLoading ? (
                  <div className="px-4">
                    <span className="text-gray-400">Loading...</span>
                  </div>
                ) : (
                  <>
                    {pages.map((page) => {
                      const absolutePath = getAbsolutePath(page.url_et);
                      return (
                        <Link 
                          key={page.id}
                          to={absolutePath}
                          className="py-2 hover:text-primary transition-colors px-4"
                          onClick={() => handleLinkClick(absolutePath)}
                        >
                          {page.name}
                        </Link>
                      );
                    })}
                    {filteredStaticNavItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.url}
                        className="py-2 hover:text-primary transition-colors px-4"
                        onClick={() => handleLinkClick(item.url)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </>
                )}
                <Button asChild className="w-full mt-2">
                  <Link 
                    to="/kontakt" 
                    onClick={() => handleLinkClick('/kontakt')}
                  >
                    Küsi pakkumist
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
