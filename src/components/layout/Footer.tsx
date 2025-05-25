
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Leatex</h3>
            <p className="text-gray-400 mb-4">
              Kvaliteetsed kotid ja pakendid kohandatud trükiga.
            </p>
            <div className="flex space-x-4">
              {/* Social media links would go here */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kiirlingid</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Avaleht
                </Link>
              </li>
              <li>
                <Link to="/tooted" className="text-gray-400 hover:text-white transition-colors">
                  Tooted
                </Link>
              </li>
              <li>
                <Link to="/riidest-kotid" className="text-gray-400 hover:text-white transition-colors">
                  Riidest kotid
                </Link>
              </li>
              <li>
                <Link to="/paberkotid" className="text-gray-400 hover:text-white transition-colors">
                  Paberkotid
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="text-gray-400 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tootekategooriad</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/riidest-kotid" className="text-gray-400 hover:text-white transition-colors">
                  Puuvillakotid
                </Link>
              </li>
              <li>
                <Link to="/paberkotid" className="text-gray-400 hover:text-white transition-colors">
                  Paberkotid
                </Link>
              </li>
              <li>
                <Link to="/nooriga-kotid" className="text-gray-400 hover:text-white transition-colors">
                  Paelaga kotid
                </Link>
              </li>
              <li>
                <Link to="/sussikotid" className="text-gray-400 hover:text-white transition-colors">
                  Sussikotid
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-primary" />
                <span className="text-gray-400">+372 5919 7172</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-primary" />
                <span className="text-gray-400">info@leatex.ee</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-primary" />
                <span className="text-gray-400">Tallinn, Eesti</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Leatex. Kõik õigused kaitstud.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
