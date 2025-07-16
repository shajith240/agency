(function() {
  'use strict';

  let scrollTimeout;
  let isScrolling = false;
  let lastScrollTime = 0;
  let scrollDirection = 0; // 1 for down, -1 for up, 0 for none
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;

  // Optimized scroll handler with direction detection
  function handleScroll() {
    const now = performance.now();

    // Throttle to 60fps max
    if (now - lastScrollTime < 16) return;
    lastScrollTime = now;

    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const newDirection = currentScrollY > lastScrollY ? 1 : currentScrollY < lastScrollY ? -1 : 0;

    if (newDirection !== 0) {
      scrollDirection = newDirection;
      lastScrollY = currentScrollY;
    }

    if (!isScrolling) {
      isScrolling = true;
      document.body.classList.add('scrolling');

      // Immediately disable expensive effects
      requestAnimationFrame(() => {
        const expensiveElements = document.querySelectorAll('.blur-on-scroll');
        expensiveElements.forEach(el => {
          el.style.filter = 'blur(1px)';
          el.style.willChange = 'filter';
        });

        // Reduce cursor spotlight during scroll
        const spotlights = document.querySelectorAll('.cursor-spotlight');
        spotlights.forEach(el => {
          el.style.opacity = '0.3';
          el.style.willChange = 'opacity';
        });

        // Optimize contact section during scroll
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
          contactSection.style.willChange = 'auto';
          const contactBgs = contactSection.querySelectorAll('.contact-bg-optimized, .contact-blur-optimized');
          contactBgs.forEach(el => {
            el.style.opacity = '0.1';
            el.style.filter = 'blur(0.5px)';
          });
        }

        // Optimize footer during scroll
        const footer = document.querySelector('footer');
        if (footer) {
          footer.style.willChange = 'auto';
          const footerBgs = footer.querySelectorAll('.footer-bg-optimized, .footer-blur-optimized');
          footerBgs.forEach(el => {
            el.style.opacity = '0.1';
            el.style.filter = 'blur(0.5px)';
          });
        }
      });
    }

    // Clear existing timeout
    clearTimeout(scrollTimeout);

    // Set timeout to detect scroll end
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      document.body.classList.remove('scrolling');

      // Restore effects after scroll ends
      requestAnimationFrame(() => {
        const expensiveElements = document.querySelectorAll('.blur-on-scroll');
        expensiveElements.forEach(el => {
          el.style.filter = '';
          el.style.willChange = 'auto';
        });

        // Restore cursor spotlight
        const spotlights = document.querySelectorAll('.cursor-spotlight');
        spotlights.forEach(el => {
          el.style.opacity = '';
          el.style.willChange = 'auto';
        });

        // Restore contact section
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
          const contactBgs = contactSection.querySelectorAll('.contact-bg-optimized, .contact-blur-optimized');
          contactBgs.forEach(el => {
            el.style.opacity = '';
            el.style.filter = '';
          });
        }

        // Restore footer
        const footer = document.querySelector('footer');
        if (footer) {
          const footerBgs = footer.querySelectorAll('.footer-bg-optimized, .footer-blur-optimized');
          footerBgs.forEach(el => {
            el.style.opacity = '';
            el.style.filter = '';
          });
        }
      });
    }, 100);
  }
  
  // Use single passive event listener for better performance
  if (window.addEventListener) {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Optimize 3D scene and animations during scroll (called only when needed)
  function optimizeHeavyElements() {
    if (isScrolling) {
      // Pause expensive animations during scroll
      const animatedElements = document.querySelectorAll('.animate-pulse, .animate-spin');
      animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
      });

      // Reduce Spline scene quality during scroll
      const splineContainers = document.querySelectorAll('.spline-scene-enhanced');
      splineContainers.forEach(el => {
        el.style.pointerEvents = 'none';
        el.style.opacity = '0.8';
        el.style.willChange = 'opacity';
      });
    } else {
      // Resume animations after scroll
      const animatedElements = document.querySelectorAll('.animate-pulse, .animate-spin');
      animatedElements.forEach(el => {
        el.style.animationPlayState = 'running';
      });

      // Restore Spline scene quality after scroll
      const splineContainers = document.querySelectorAll('.spline-scene-enhanced');
      splineContainers.forEach(el => {
        el.style.pointerEvents = 'auto';
        el.style.opacity = '1';
        el.style.willChange = 'auto';
      });
    }
  }
  
  // Call heavy element optimization when scroll state changes
  let lastScrollingState = false;
  function checkScrollState() {
    if (isScrolling !== lastScrollingState) {
      optimizeHeavyElements();
      lastScrollingState = isScrolling;
    }
  }

  // Check scroll state periodically but only when needed
  setInterval(checkScrollState, 50);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    clearTimeout(scrollTimeout);
  });

  // Simplified intersection observer for critical elements only
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-viewport');
        } else {
          entry.target.classList.remove('in-viewport');
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '20px'
    });

    // Only observe critical elements
    document.addEventListener('DOMContentLoaded', () => {
      const criticalElements = document.querySelectorAll('.spline-scene-enhanced, .cursor-spotlight');
      criticalElements.forEach(el => observer.observe(el));
    });
  }

})();
