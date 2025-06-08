import { useState } from "react";
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

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: fetchPages,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

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

  return (
    <nav className="w-full z-50">
      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 xl:px-20 py-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="text-4xl font-bold text-primary"
              onClick={() => handleLinkClick('/')}
            >
              Leatex
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 items-center">
              {isLoading ? (
                <div className="flex space-x-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                pages.map((page) => {
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
                })
              )}
              <Button asChild>
                <Link 
                  to="/paring"
                  onClick={() => handleLinkClick('/paring')}
                >
                  Küsi pakkumist
                </Link>
              </Button>
              <Link to="/portfoolio" className="text-gray-300 hover:text-white transition-colors">
                Tehtud tööd
              </Link>
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
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-4"></div>
                    ))}
                  </div>
                ) : (
                  pages.map((page) => {
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
                  })
                )}
                <Button asChild className="w-full mt-2">
                  <Link 
                    to="/paring" 
                    onClick={() => handleLinkClick('/paring')}
                  >
                    Küsi pakkumist
                  </Link>
                </Button>
                <Link to="/portfoolio" className="py-2 hover:text-primary transition-colors px-4">
                  Tehtud tööd
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
