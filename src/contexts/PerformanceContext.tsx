'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { getPerformanceOptimizer, PerformanceOptimizer } from '@/lib/performance-utils';

interface PerformanceContextType {
  optimizer: PerformanceOptimizer;
  animationSettings: ReturnType<PerformanceOptimizer['getAnimationSettings']>;
  settings3D: ReturnType<PerformanceOptimizer['get3DSettings']>;
  currentFPS: number;
  isLowPerformance: boolean;
  shouldLazyLoad: (componentType: 'heavy' | 'medium' | 'light') => boolean;
  intersectionSettings: ReturnType<PerformanceOptimizer['getIntersectionObserverSettings']>;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [optimizer] = useState(() => getPerformanceOptimizer());
  const [animationSettings, setAnimationSettings] = useState(() => optimizer.getAnimationSettings());
  const [settings3D, setSettings3D] = useState(() => optimizer.get3DSettings());
  const [currentFPS, setCurrentFPS] = useState(60);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number>();
  const fpsHistoryRef = useRef<number[]>([]);

  // FPS monitoring
  useEffect(() => {
    const measureFPS = () => {
      const now = performance.now();
      frameCountRef.current++;

      if (now - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        setCurrentFPS(fps);
        
        // Keep FPS history for adaptive quality
        fpsHistoryRef.current.push(fps);
        if (fpsHistoryRef.current.length > 10) {
          fpsHistoryRef.current.shift();
        }

        // Check for consistent low performance
        const avgFPS = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
        const wasLowPerformance = isLowPerformance;
        const nowLowPerformance = avgFPS < 30;
        
        if (nowLowPerformance !== wasLowPerformance) {
          setIsLowPerformance(nowLowPerformance);
          
          // Adapt quality settings
          const newSettings = optimizer.adaptQuality(avgFPS);
          if (newSettings) {
            setAnimationSettings(newSettings);
            setSettings3D(optimizer.get3DSettings());
          }
        }

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(measureFPS);
    };

    animationFrameRef.current = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [optimizer, isLowPerformance]);

  // Memory pressure monitoring
  useEffect(() => {
    if ('memory' in performance) {
      const checkMemoryPressure = () => {
        const memory = (performance as any).memory;
        const usedRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        if (usedRatio > 0.8 && !isLowPerformance) {
          setIsLowPerformance(true);
          const newSettings = optimizer.adaptQuality(20); // Force low performance mode
          if (newSettings) {
            setAnimationSettings(newSettings);
            setSettings3D(optimizer.get3DSettings());
          }
        }
      };

      const interval = setInterval(checkMemoryPressure, 5000);
      return () => clearInterval(interval);
    }
  }, [optimizer, isLowPerformance]);

  // Page Visibility API - pause animations when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause animations when tab is hidden
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      } else {
        // Resume FPS monitoring when tab becomes visible
        animationFrameRef.current = requestAnimationFrame(() => {
          lastTimeRef.current = performance.now();
          frameCountRef.current = 0;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const contextValue: PerformanceContextType = {
    optimizer,
    animationSettings,
    settings3D,
    currentFPS,
    isLowPerformance,
    shouldLazyLoad: optimizer.shouldLazyLoad.bind(optimizer),
    intersectionSettings: optimizer.getIntersectionObserverSettings(),
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
}

// Higher-order component for performance-aware components
export function withPerformanceOptimization<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    componentType?: 'heavy' | 'medium' | 'light';
    fallback?: React.ReactNode;
  } = {}
) {
  return function PerformanceOptimizedComponent(props: P) {
    const { shouldLazyLoad, isLowPerformance, animationSettings } = usePerformance();
    const { componentType = 'medium', fallback } = options;

    // If component should be lazy loaded and performance is low, show fallback
    if (shouldLazyLoad(componentType) && isLowPerformance && fallback) {
      return <>{fallback}</>;
    }

    // Pass performance settings as props if component accepts them
    const enhancedProps = {
      ...props,
      performanceSettings: animationSettings,
      isLowPerformance,
    } as P;

    return <Component {...enhancedProps} />;
  };
}

// Hook for adaptive animation settings
export function useAdaptiveAnimation(baseSettings: {
  duration?: number;
  delay?: number;
  iterations?: number;
}) {
  const { animationSettings, isLowPerformance } = usePerformance();

  if (!animationSettings.enableAnimations || animationSettings.reducedMotion) {
    return {
      duration: 0,
      delay: 0,
      iterations: 1,
    };
  }

  const multiplier = isLowPerformance ? 0.5 : 1;

  return {
    duration: (baseSettings.duration || 1000) * multiplier,
    delay: (baseSettings.delay || 0) * multiplier,
    iterations: baseSettings.iterations || 1,
  };
}

// Hook for adaptive intersection observer
export function useAdaptiveIntersectionObserver(
  callback: IntersectionObserverCallback,
  deps: React.DependencyList = []
) {
  const { intersectionSettings } = usePerformance();
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(callback, intersectionSettings);
    return () => observerRef.current?.disconnect();
  }, [callback, intersectionSettings, ...deps]);

  return observerRef.current;
}
