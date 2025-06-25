
import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingActionButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const actions = [
    {
      icon: Phone,
      label: 'Helista',
      href: 'tel:+37253419161',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Mail,
      label: 'E-post',
      href: 'mailto:info@leatex.ee',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      href: 'https://wa.me/37253419161',
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="mb-4 h-12 w-12 rounded-full bg-gray-800 hover:bg-gray-900 text-white shadow-lg"
          size="sm"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}

      {/* Action buttons */}
      <div className="flex flex-col-reverse items-end space-y-reverse space-y-3">
        {isExpanded && (
          <>
            {actions.map((action, index) => (
              <div
                key={action.label}
                className="flex items-center space-x-3 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="bg-black text-white px-3 py-1 rounded-full text-sm whitespace-nowrap">
                  {action.label}
                </span>
                <a
                  href={action.href}
                  target={action.href.startsWith('http') ? '_blank' : undefined}
                  rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <Button
                    className={`h-12 w-12 rounded-full ${action.color} text-white shadow-lg hover:scale-110 transition-all duration-200`}
                    size="sm"
                  >
                    <action.icon className="h-5 w-5" />
                  </Button>
                </a>
              </div>
            ))}
          </>
        )}

        {/* Main toggle button */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-200 ${
            isExpanded ? 'rotate-45' : 'hover:scale-110'
          }`}
          size="sm"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default FloatingActionButton;
