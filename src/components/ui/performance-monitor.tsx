'use client';

import { useEffect, useState, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  isVisible: boolean;
}

export function PerformanceMonitor({ enabled = false }: { enabled?: boolean }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
    isVisible: false,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const measurePerformance = () => {
      const now = performance.now();
      frameCountRef.current++;

      // Calculate FPS every second
      if (now - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        
        // Get memory usage if available
        const memoryUsage = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory
          ? Math.round((performance as unknown as { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize / 1024 / 1024)
          : 0;

        setMetrics(prev => ({
          ...prev,
          fps,
          memoryUsage,
          renderTime: now - lastTimeRef.current,
        }));

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(measurePerformance);
    };

    animationFrameRef.current = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled]);

  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setMetrics(prev => ({ ...prev, isVisible: !prev.isVisible }));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!enabled || !metrics.isVisible) return null;

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3 font-mono text-xs text-white">
      <div className="space-y-1">
        <div className={`flex justify-between ${getFPSColor(metrics.fps)}`}>
          <span>FPS:</span>
          <span className="font-bold">{metrics.fps}</span>
        </div>
        <div className="flex justify-between text-blue-400">
          <span>Memory:</span>
          <span>{metrics.memoryUsage}MB</span>
        </div>
        <div className="flex justify-between text-purple-400">
          <span>Render:</span>
          <span>{metrics.renderTime.toFixed(1)}ms</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-white/20 text-gray-400 text-[10px]">
        Ctrl+Shift+P to toggle
      </div>
    </div>
  );
}

// Hook for performance monitoring
export function usePerformanceMonitor() {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const fpsHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrame: number;

    const checkPerformance = () => {
      const now = performance.now();
      frameCount++;

      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        
        // Keep history of last 5 FPS measurements
        fpsHistoryRef.current.push(fps);
        if (fpsHistoryRef.current.length > 5) {
          fpsHistoryRef.current.shift();
        }

        // Check if consistently low performance
        const avgFPS = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
        setIsLowPerformance(avgFPS < 30);

        frameCount = 0;
        lastTime = now;
      }

      animationFrame = requestAnimationFrame(checkPerformance);
    };

    animationFrame = requestAnimationFrame(checkPerformance);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return { isLowPerformance };
}
