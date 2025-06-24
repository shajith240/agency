// Secure performance monitoring script
(function() {
  'use strict';
  
  // Only run in supported browsers
  if (!('PerformanceObserver' in window)) {
    return;
  }
  
  // Rate limiting for performance logs
  let logCount = 0;
  const MAX_LOGS_PER_SESSION = 50;
  
  function canLog() {
    return logCount < MAX_LOGS_PER_SESSION;
  }
  
  function logPerformanceMetric(metric, value, details) {
    if (!canLog()) return;
    
    logCount++;
    
    // Only log in development or send to monitoring service in production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log(`Performance ${metric}:`, value, details || '');
    } else {
      // In production, send to monitoring service
      // This would typically be sent to your analytics/monitoring service
      try {
        // Example: Send to monitoring endpoint
        // fetch('/api/metrics', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ metric, value, details, timestamp: Date.now() })
        // }).catch(() => {}); // Silently fail
      } catch (e) {
        // Silently handle errors to avoid breaking the page
      }
    }
  }
  
  // Core Web Vitals observer
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            logPerformanceMetric('LCP', Math.round(entry.startTime), 'ms');
            break;
            
          case 'first-input':
            const fid = entry.processingStart - entry.startTime;
            logPerformanceMetric('FID', Math.round(fid), 'ms');
            break;
            
          case 'layout-shift':
            if (!entry.hadRecentInput) {
              logPerformanceMetric('CLS', entry.value.toFixed(4));
            }
            break;
            
          case 'navigation':
            // Log navigation timing
            logPerformanceMetric('Navigation', Math.round(entry.duration), 'ms');
            break;
        }
      }
    });
    
    // Observe Core Web Vitals
    observer.observe({
      entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'navigation']
    });
    
    // Cleanup observer on page unload
    window.addEventListener('beforeunload', () => {
      observer.disconnect();
    });
    
  } catch (error) {
    // Silently handle errors to avoid breaking the page
  }
  
  // Security: Prevent script tampering
  Object.freeze(window.PerformanceObserver);
  
})();
