import { useEffect, useState } from 'react';

// Declare gtag for Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

// Extended PerformanceEntry for FID
interface FirstInputEntry extends PerformanceEntry {
  processingStart?: number;
  startTime: number;
}

// Extended PerformanceEntry for resource timing
interface ResourceTimingEntry extends PerformanceEntry {
  transferSize?: number;
  duration: number;
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  });

  useEffect(() => {
    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fidEntry = entry as FirstInputEntry;
        if (fidEntry.processingStart && fidEntry.startTime) {
          const fid = fidEntry.processingStart - fidEntry.startTime;
          setMetrics(prev => ({ ...prev, fid }));
        }
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Time to First Byte (TTFB)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      setMetrics(prev => ({ ...prev, ttfb }));
    }

    // Send metrics to analytics when they're available
    const sendMetrics = () => {
      const { fcp, lcp, fid, cls, ttfb } = metrics;
      if (fcp && lcp && fid !== null && cls !== null && ttfb) {
        // Send to Google Analytics or other analytics service
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', 'core_web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'Core Web Vitals',
            value: Math.round(lcp),
            custom_map: {
              'fcp': fcp,
              'lcp': lcp,
              'fid': fid,
              'cls': cls,
              'ttfb': ttfb
            }
          });
        }

        // Log to console for development
        console.log('Core Web Vitals:', {
          FCP: `${fcp.toFixed(2)}ms`,
          LCP: `${lcp.toFixed(2)}ms`,
          FID: `${fid.toFixed(2)}ms`,
          CLS: cls.toFixed(4),
          TTFB: `${ttfb.toFixed(2)}ms`
        });
      }
    };

    // Check metrics every second
    const interval = setInterval(sendMetrics, 1000);

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      clearInterval(interval);
    };
  }, [metrics]);

  return metrics;
};

// Resource timing monitoring
export const useResourceTiming = () => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const resourceEntry = entry as ResourceTimingEntry;
        // Monitor slow resources
        if (resourceEntry.duration > 3000) {
          console.warn('Slow resource detected:', {
            name: resourceEntry.name,
            duration: `${resourceEntry.duration.toFixed(2)}ms`,
            size: resourceEntry.transferSize ? `${(resourceEntry.transferSize / 1024).toFixed(2)}KB` : 'Unknown'
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, []);
};

// Error tracking
export const useErrorTracking = () => {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('JavaScript Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });

      // Send to error tracking service
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'exception', {
          description: event.message,
          fatal: false
        });
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled Promise Rejection:', event.reason);

      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'exception', {
          description: 'Unhandled Promise Rejection',
          fatal: false
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}; 