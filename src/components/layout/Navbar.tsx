
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
    <nav className="bg-transparent absolute w-full z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            Leatex
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-800 font-medium hover:text-primary transition-colors">
              Avaleht
            </Link>
            <Link to="/products" className="text-gray-800 font-medium hover:text-primary transition-colors">
              Tooted
            </Link>
            <Link to="/contact" className="text-gray-800 font-medium hover:text-primary transition-colors">
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
              className="text-gray-800 hover:text-primary"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in bg-white rounded-lg shadow-lg mt-2">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="py-2 hover:text-primary transition-colors px-4"
                onClick={() => setIsOpen(false)}
              >
                Avaleht
              </Link>
              <Link 
                to="/products" 
                className="py-2 hover:text-primary transition-colors px-4"
                onClick={() => setIsOpen(false)}
              >
                Tooted
              </Link>
              <Link 
                to="/contact" 
                className="py-2 hover:text-primary transition-colors px-4"
                onClick={() => setIsOpen(false)}
              >
                Kontakt
              </Link>
              <Button asChild className="w-full mt-2 mx-4">
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
