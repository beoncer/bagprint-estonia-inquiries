
import { useState } from "react";
import { Link } from "react-router-dom";
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
    .order('sort_order', { ascending: true, nullsLast: true });

  if (error) throw error;
  return data || [];
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: fetchPages,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full z-50">
      <div className="container mx-auto px-2 py-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-4xl font-bold text-primary">
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
                pages.map((page) => (
                  <Link 
                    key={page.id}
                    to={page.url_et} 
                    className="text-gray-800 font-medium hover:text-primary transition-colors"
                  >
                    {page.name}
                  </Link>
                ))
              )}
              <Button asChild>
                <Link to="/inquiry">
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
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-4"></div>
                    ))}
                  </div>
                ) : (
                  pages.map((page) => (
                    <Link 
                      key={page.id}
                      to={page.url_et}
                      className="py-2 hover:text-primary transition-colors px-4"
                      onClick={() => setIsOpen(false)}
                    >
                      {page.name}
                    </Link>
                  ))
                )}
                <Button asChild className="w-full mt-2">
                  <Link 
                    to="/inquiry" 
                    onClick={() => setIsOpen(false)}
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
