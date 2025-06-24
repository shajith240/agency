'use client';

// Performance utilities for optimizing animations and heavy components

export interface DeviceCapabilities {
  isLowEnd: boolean;
  supportsWebGL: boolean;
  hasHighRefreshRate: boolean;
  memoryLimit: number;
  connectionSpeed: 'slow' | 'fast' | 'unknown';
  prefersReducedMotion: boolean;
}

export function getDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return {
      isLowEnd: false,
      supportsWebGL: false,
      hasHighRefreshRate: false,
      memoryLimit: 4096,
      connectionSpeed: 'unknown',
      prefersReducedMotion: false,
    };
  }

  // Check for low-end device indicators
  const isLowEnd = checkIsLowEndDevice();
  
  // Check WebGL support
  const supportsWebGL = checkWebGLSupport();
  
  // Check refresh rate
  const hasHighRefreshRate = checkHighRefreshRate();
  
  // Estimate memory limit
  const memoryLimit = estimateMemoryLimit();
  
  // Check connection speed
  const connectionSpeed = getConnectionSpeed();
  
  // Check motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    isLowEnd,
    supportsWebGL,
    hasHighRefreshRate,
    memoryLimit,
    connectionSpeed,
    prefersReducedMotion,
  };
}

function checkIsLowEndDevice(): boolean {
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  if (cores <= 2) return true;

  // Check memory if available
  const memory = (navigator as any).deviceMemory;
  if (memory && memory <= 2) return true;

  // Check user agent for low-end indicators
  const userAgent = navigator.userAgent.toLowerCase();
  const lowEndIndicators = [
    'android 4', 'android 5', 'android 6',
    'iphone os 10', 'iphone os 11',
    'windows phone',
    'opera mini',
    'ucbrowser'
  ];
  
  return lowEndIndicators.some(indicator => userAgent.includes(indicator));
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

function checkHighRefreshRate(): boolean {
  // This is a simplified check - in reality, you'd need more sophisticated detection
  return window.screen && (window.screen as any).refreshRate > 60;
}

function estimateMemoryLimit(): number {
  const memory = (navigator as any).deviceMemory;
  if (memory) return memory * 1024; // Convert GB to MB
  
  // Fallback estimation based on other factors
  const cores = navigator.hardwareConcurrency || 4;
  return cores * 1024; // Rough estimate: 1GB per core
}

function getConnectionSpeed(): 'slow' | 'fast' | 'unknown' {
  const connection = (navigator as any).connection;
  if (!connection) return 'unknown';
  
  const effectiveType = connection.effectiveType;
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
  if (effectiveType === '3g') return 'slow';
  return 'fast';
}

// Performance optimization strategies
export class PerformanceOptimizer {
  private capabilities: DeviceCapabilities;
  private performanceMode: 'high' | 'medium' | 'low';

  constructor() {
    this.capabilities = getDeviceCapabilities();
    this.performanceMode = this.determinePerformanceMode();
  }

  private determinePerformanceMode(): 'high' | 'medium' | 'low' {
    if (this.capabilities.prefersReducedMotion) return 'low';
    if (this.capabilities.isLowEnd) return 'low';
    if (this.capabilities.connectionSpeed === 'slow') return 'medium';
    if (!this.capabilities.supportsWebGL) return 'medium';
    return 'high';
  }

  // Get optimized animation settings
  getAnimationSettings() {
    switch (this.performanceMode) {
      case 'low':
        return {
          enableAnimations: false,
          reducedMotion: true,
          frameRate: 15,
          blurEffects: false,
          gradientComplexity: 'simple',
          particleCount: 0,
        };
      case 'medium':
        return {
          enableAnimations: true,
          reducedMotion: false,
          frameRate: 30,
          blurEffects: false,
          gradientComplexity: 'medium',
          particleCount: 10,
        };
      case 'high':
      default:
        return {
          enableAnimations: true,
          reducedMotion: false,
          frameRate: 60,
          blurEffects: true,
          gradientComplexity: 'complex',
          particleCount: 50,
        };
    }
  }

  // Get 3D rendering settings
  get3DSettings() {
    switch (this.performanceMode) {
      case 'low':
        return {
          enabled: false,
          quality: 'low',
          antialiasing: false,
          shadows: false,
          textureQuality: 'low',
        };
      case 'medium':
        return {
          enabled: true,
          quality: 'medium',
          antialiasing: false,
          shadows: false,
          textureQuality: 'medium',
        };
      case 'high':
      default:
        return {
          enabled: true,
          quality: 'high',
          antialiasing: true,
          shadows: true,
          textureQuality: 'high',
        };
    }
  }

  // Check if component should be lazy loaded
  shouldLazyLoad(componentType: 'heavy' | 'medium' | 'light'): boolean {
    if (this.capabilities.connectionSpeed === 'slow') return true;
    if (this.capabilities.isLowEnd && componentType !== 'light') return true;
    return componentType === 'heavy';
  }

  // Get intersection observer settings
  getIntersectionObserverSettings() {
    return {
      threshold: this.performanceMode === 'low' ? 0.5 : 0.1,
      rootMargin: this.capabilities.connectionSpeed === 'slow' ? '10px' : '50px',
    };
  }

  // Adaptive quality based on performance
  adaptQuality(currentFPS: number) {
    if (currentFPS < 20 && this.performanceMode !== 'low') {
      this.performanceMode = 'low';
      return this.getAnimationSettings();
    }
    if (currentFPS < 40 && this.performanceMode === 'high') {
      this.performanceMode = 'medium';
      return this.getAnimationSettings();
    }
    return null; // No change needed
  }
}

// Singleton instance
let performanceOptimizer: PerformanceOptimizer | null = null;

export function getPerformanceOptimizer(): PerformanceOptimizer {
  if (!performanceOptimizer) {
    performanceOptimizer = new PerformanceOptimizer();
  }
  return performanceOptimizer;
}

// React hook for performance optimization
export function usePerformanceOptimization() {
  const optimizer = getPerformanceOptimizer();
  const animationSettings = optimizer.getAnimationSettings();
  const settings3D = optimizer.get3DSettings();
  
  return {
    optimizer,
    animationSettings,
    settings3D,
    shouldLazyLoad: optimizer.shouldLazyLoad.bind(optimizer),
    intersectionSettings: optimizer.getIntersectionObserverSettings(),
  };
}

// Utility functions for performance monitoring
export function measurePerformance(name: string, fn: () => void) {
  if (typeof window === 'undefined') return fn();
  
  const start = performance.now();
  fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
