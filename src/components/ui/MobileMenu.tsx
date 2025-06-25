
import React, { useState, useEffect } from 'react';
import { X, Menu, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: 'Avaleht', href: '/' },
  { 
    label: 'Tooted', 
    href: '/tooted',
    submenu: [
      { label: 'Riidest kotid', href: '/riidest-kotid' },
      { label: 'Paberkotid', href: '/paberkotid' },
      { label: 'Nööriga kotid', href: '/nooriga-kotid' },
      { label: 'Sussikotid', href: '/sussikotid' },
    ]
  },
  { label: 'Portfoolio', href: '/portfoolio' },
  { label: 'Meist', href: '/meist' },
  { label: 'Blogi', href: '/blogi' },
  { label: 'Kontakt', href: '/kontakt' },
];

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  const handleItemClick = (item: typeof menuItems[0]) => {
    if (item.submenu) {
      setExpandedItem(expandedItem === item.label ? null : item.label);
    } else {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menüü</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4">
            {menuItems.map((item) => (
              <div key={item.label} className="mb-2">
                <div
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                    location.pathname === item.href
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  {item.submenu ? (
                    <>
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight 
                        className={`h-4 w-4 transition-transform duration-200 ${
                          expandedItem === item.label ? 'rotate-90' : ''
                        }`} 
                      />
                    </>
                  ) : (
                    <Link to={item.href} className="flex-1 font-medium">
                      {item.label}
                    </Link>
                  )}
                </div>

                {/* Submenu */}
                {item.submenu && (
                  <div 
                    className={`ml-4 mt-2 space-y-1 overflow-hidden transition-all duration-200 ${
                      expandedItem === item.label 
                        ? 'max-h-96 opacity-100' 
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.href}
                        className={`block p-2 rounded-md transition-colors ${
                          location.pathname === subItem.href
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
