
import { useEffect } from 'react';

const CriticalCSS = () => {
  useEffect(() => {
    // Inject critical CSS for above-the-fold content
    const criticalStyles = `
      /* Critical styles for first paint */
      .hero-section {
        min-height: 60vh;
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      }
      
      .nav-container {
        background: white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      .product-grid-skeleton {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }
      
      .skeleton-item {
        height: 300px;
        background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
        border-radius: 8px;
      }
      
      @keyframes skeleton-loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = criticalStyles;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  
  return null;
};

export default CriticalCSS;
