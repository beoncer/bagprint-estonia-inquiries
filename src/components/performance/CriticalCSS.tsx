
import { useEffect } from 'react';

const CriticalCSS = () => {
  useEffect(() => {
    // Inject only the most critical CSS for immediate rendering
    const criticalStyles = `
      /* Reset and base styles */
      *,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
      ::before,::after{--tw-content:''}
      html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif}
      body{margin:0;line-height:inherit}
      
      /* Critical layout styles */
      .min-h-screen{min-height:100vh}
      .flex{display:flex}
      .flex-col{flex-direction:column}
      .flex-1{flex:1 1 0%}
      
      /* Navigation critical styles */
      .bg-white{background-color:rgb(255 255 255)}
      .shadow-sm{box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05)}
      .px-4{padding-left:1rem;padding-right:1rem}
      .py-2{padding-top:0.5rem;padding-bottom:0.5rem}
      
      /* Hero section critical styles */
      .bg-primary{background-color:rgb(220 38 38)}
      .text-white{color:rgb(255 255 255)}
      .text-center{text-align:center}
      
      /* Loading skeleton */
      .animate-pulse{animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = criticalStyles;
    styleSheet.id = 'critical-css';
    document.head.insertBefore(styleSheet, document.head.firstChild);
    
    return () => {
      const existingStyle = document.getElementById('critical-css');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);
  
  return null;
};

export default CriticalCSS;
