
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">bagprint.ee</h3>
            <p className="text-gray-300 mb-4">
              Kõrgekvaliteedilised riidekotid, paberkotid, paelaga kotid ja 
              e-kaubanduse pakendid kohandatud printimise võimalusega.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Kiirlingid</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors">
                  Avaleht
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-primary transition-colors">
                  Tooted
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link to="/inquiry" className="text-gray-300 hover:text-primary transition-colors">
                  Küsi pakkumist
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Kontakt</h3>
            <address className="not-italic text-gray-300">
              <p>Email: info@bagprint.ee</p>
              <p>Telefon: +372 123 4567</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} bagprint.ee. Kõik õigused kaitstud.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
