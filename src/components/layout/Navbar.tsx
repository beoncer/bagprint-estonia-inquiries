
import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
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

  const { data: pages = [], isLoading, isError } = useQuery({
    queryKey: ['pages'],
    queryFn: fetchPages,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getAbsolutePath = (url: string) => {
    if (url.startsWith('/')) {
      return url;
    }
    return `/${url}`;
  };

  const handleLinkClick = (url: string) => {
    setIsOpen(false);
  };

  // Memoized navigation items
  const defaultNavItems = useMemo(() => [
    { id: "default-1", name: "Avaleht", url_et: "/", visible: true, sort_order: 1 },
    { id: "default-2", name: "Tooted", url_et: "/tooted", visible: true, sort_order: 2 },
    { id: "default-3", name: "Meist", url_et: "/meist", visible: true, sort_order: 3 },
    { id: "default-4", name: "Kontakt", url_et: "/kontakt", visible: true, sort_order: 4 }
  ], []);

  const staticNavItems = useMemo(() => [
    { name: "Blogi", url: "/blogi" },
    { name: "Tehtud tööd", url: "/portfoolio" }
  ], []);

  const displayPages = useMemo(() => 
    (isLoading || isError || pages.length === 0) ? defaultNavItems : pages,
    [isLoading, isError, pages, defaultNavItems]
  );

  const filteredStaticNavItems = useMemo(() => {
    const navNames = new Set(displayPages.map(p => p.name));
    return staticNavItems.filter(item => !navNames.has(item.name));
  }, [displayPages, staticNavItems]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="w-full z-50">
      {/* Consistent spacing container matching /meist page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary flex items-center"
              onClick={() => handleLinkClick('/')}
            >
              Leatex<span className="text-black">.</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4 lg:space-x-6 xl:space-x-8 items-center">
              {displayPages.map((page) => {
                const absolutePath = getAbsolutePath(page.url_et);
                return (
                  <Link 
                    key={page.id}
                    to={absolutePath}
                    className="text-gray-800 font-medium hover:text-primary transition-colors text-sm lg:text-base whitespace-nowrap"
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
                  className="text-gray-800 font-medium hover:text-primary transition-colors text-sm lg:text-base whitespace-nowrap"
                  onClick={() => handleLinkClick(item.url)}
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild size="sm" className="text-sm whitespace-nowrap">
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
                className="text-gray-800 hover:text-primary p-2 transition-all duration-200 hover:bg-gray-50 rounded-lg"
                aria-label={isOpen ? "Sulge menüü" : "Ava menüü"}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation with smooth animation */}
          <div 
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen 
                ? 'max-h-96 opacity-100 pt-4 pb-2' 
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white rounded-lg">
              <div className="flex flex-col space-y-1">
                {displayPages.map((page) => {
                  const absolutePath = getAbsolutePath(page.url_et);
                  return (
                    <Link 
                      key={page.id}
                      to={absolutePath}
                      className="py-3 px-4 hover:text-primary transition-all duration-200 hover:bg-gray-50 rounded-lg text-sm font-medium"
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
                    className="py-3 px-4 hover:text-primary transition-all duration-200 hover:bg-gray-50 rounded-lg text-sm font-medium"
                    onClick={() => handleLinkClick(item.url)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-2 px-4">
                  <Button asChild className="w-full" size="sm">
                    <Link 
                      to="/kontakt" 
                      onClick={() => handleLinkClick('/kontakt')}
                    >
                      Küsi pakkumist
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
