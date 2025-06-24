'use client';

import { Suspense, lazy, ComponentType, useEffect, useState, useRef } from 'react';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  className?: string;
}

export function LazyWrapper({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  delay = 0,
  className = '',
}: LazyWrapperProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setShouldRender(true), delay);
          } else {
            setShouldRender(true);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, delay]);

  const defaultFallback = (
    <div className="w-full h-full flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? children : (fallback || defaultFallback)}
    </div>
  );
}

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  options: {
    fallback?: React.ReactNode;
    threshold?: number;
    rootMargin?: string;
    delay?: number;
  } = {}
) {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));

  return function WrappedComponent(props: P) {
    const [shouldLoad, setShouldLoad] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (options.delay) {
              setTimeout(() => setShouldLoad(true), options.delay);
            } else {
              setShouldLoad(true);
            }
          }
        },
        { 
          threshold: options.threshold || 0.1, 
          rootMargin: options.rootMargin || '50px' 
        }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, []);

    const defaultFallback = (
      <div className="w-full h-full flex items-center justify-center bg-black/10 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );

    return (
      <div ref={containerRef} className="w-full h-full">
        {shouldLoad ? (
          <Suspense fallback={options.fallback || defaultFallback}>
            <LazyComponent {...props} />
          </Suspense>
        ) : (
          options.fallback || defaultFallback
        )}
      </div>
    );
  };
}

// Progressive image loading component
interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
}

export function ProgressiveImage({
  src,
  alt,
  className = '',
  placeholder,
  blurDataURL,
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
          {placeholder && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              {placeholder}
            </div>
          )}
        </div>
      )}
      
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
        />
      )}
      
      {/* Main image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}

// Preload critical resources
export function preloadCriticalResources() {
  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = '/fonts/inter-var.woff2';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);

  // Preload critical images
  const criticalImages = [
    '/images/hero-bg.webp',
    '/images/logo.svg',
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  });
}

// Resource hints for better performance
export function addResourceHints() {
  // DNS prefetch for external domains
  const domains = [
    'prod.spline.design',
    'cdn.jsdelivr.net',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });

  // Preconnect to critical domains
  const criticalDomains = ['prod.spline.design'];
  
  criticalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
}
