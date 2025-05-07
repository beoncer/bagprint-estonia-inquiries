
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            bagprint.ee
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="hover:text-primary transition-colors">
              Avaleht
            </Link>
            <Link to="/products" className="hover:text-primary transition-colors">
              Tooted
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Kontakt
            </Link>
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
              className="text-gray-500 hover:text-primary"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="py-2 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Avaleht
              </Link>
              <Link 
                to="/products" 
                className="py-2 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Tooted
              </Link>
              <Link 
                to="/contact" 
                className="py-2 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Kontakt
              </Link>
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
    </nav>
  );
};

export default Navbar;
