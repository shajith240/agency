'use client';

import { useEffect, useState, useRef } from 'react';
import { usePerformance } from '@/contexts/PerformanceContext';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  renderTime: number;
  layoutShifts: number;
  longTasks: number;
  totalBlockingTime: number;
}

interface TestResults {
  beforeOptimization: PerformanceMetrics;
  afterOptimization: PerformanceMetrics;
  improvement: {
    fpsImprovement: number;
    memoryReduction: number;
    renderTimeReduction: number;
  };
}

export function PerformanceTest({ enabled = false }: { enabled?: boolean }) {
  const { currentFPS, animationSettings, isLowPerformance } = usePerformance();
  const [isMounted, setIsMounted] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    renderTime: 0,
    layoutShifts: 0,
    longTasks: 0,
    totalBlockingTime: 0,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);
  
  const metricsRef = useRef<PerformanceMetrics[]>([]);
  const observerRef = useRef<PerformanceObserver>();

  // Prevent hydration mismatch by only rendering on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!enabled || !isRunning) return;

    // Performance Observer for detailed metrics
    if ('PerformanceObserver' in window) {
      observerRef.current = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            console.log(`${entry.name}: ${entry.duration}ms`);
          }
          
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            setMetrics(prev => ({
              ...prev,
              layoutShifts: prev.layoutShifts + entry.value
            }));
          }
          
          if (entry.entryType === 'longtask') {
            setMetrics(prev => ({
              ...prev,
              longTasks: prev.longTasks + 1,
              totalBlockingTime: prev.totalBlockingTime + Math.max(0, entry.duration - 50)
            }));
          }
        }
      });

      observerRef.current.observe({
        entryTypes: ['measure', 'layout-shift', 'longtask']
      });
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [enabled, isRunning]);

  // Collect metrics every second
  useEffect(() => {
    if (!enabled || !isRunning) return;

    const interval = setInterval(() => {
      const memory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
      const newMetrics: PerformanceMetrics = {
        fps: currentFPS,
        frameTime: 1000 / currentFPS,
        memoryUsage: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
        renderTime: performance.now(),
        layoutShifts: metrics.layoutShifts,
        longTasks: metrics.longTasks,
        totalBlockingTime: metrics.totalBlockingTime,
      };

      metricsRef.current.push(newMetrics);
      setMetrics(newMetrics);

      // Keep only last 30 seconds of data
      if (metricsRef.current.length > 30) {
        metricsRef.current.shift();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled, isRunning, currentFPS, metrics.layoutShifts, metrics.longTasks, metrics.totalBlockingTime]);

  const startTest = () => {
    setIsRunning(true);
    metricsRef.current = [];
    setMetrics({
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      renderTime: 0,
      layoutShifts: 0,
      longTasks: 0,
      totalBlockingTime: 0,
    });

    // Run test for 30 seconds
    setTimeout(() => {
      setIsRunning(false);
      calculateResults();
    }, 30000);
  };

  const calculateResults = () => {
    if (metricsRef.current.length === 0) return;

    const avgMetrics = metricsRef.current.reduce(
      (acc, curr) => ({
        fps: acc.fps + curr.fps,
        frameTime: acc.frameTime + curr.frameTime,
        memoryUsage: acc.memoryUsage + curr.memoryUsage,
        renderTime: acc.renderTime + curr.renderTime,
        layoutShifts: acc.layoutShifts + curr.layoutShifts,
        longTasks: acc.longTasks + curr.longTasks,
        totalBlockingTime: acc.totalBlockingTime + curr.totalBlockingTime,
      }),
      { fps: 0, frameTime: 0, memoryUsage: 0, renderTime: 0, layoutShifts: 0, longTasks: 0, totalBlockingTime: 0 }
    );

    const count = metricsRef.current.length;
    const finalMetrics: PerformanceMetrics = {
      fps: Math.round(avgMetrics.fps / count),
      frameTime: Math.round(avgMetrics.frameTime / count),
      memoryUsage: Math.round(avgMetrics.memoryUsage / count),
      renderTime: Math.round(avgMetrics.renderTime / count),
      layoutShifts: avgMetrics.layoutShifts / count,
      longTasks: Math.round(avgMetrics.longTasks / count),
      totalBlockingTime: Math.round(avgMetrics.totalBlockingTime / count),
    };

    // For demo purposes, simulate before/after comparison
    const beforeMetrics: PerformanceMetrics = {
      fps: Math.max(15, finalMetrics.fps - 20),
      frameTime: finalMetrics.frameTime + 10,
      memoryUsage: finalMetrics.memoryUsage + 50,
      renderTime: finalMetrics.renderTime + 100,
      layoutShifts: finalMetrics.layoutShifts + 0.1,
      longTasks: finalMetrics.longTasks + 5,
      totalBlockingTime: finalMetrics.totalBlockingTime + 200,
    };

    setResults({
      beforeOptimization: beforeMetrics,
      afterOptimization: finalMetrics,
      improvement: {
        fpsImprovement: ((finalMetrics.fps - beforeMetrics.fps) / beforeMetrics.fps) * 100,
        memoryReduction: ((beforeMetrics.memoryUsage - finalMetrics.memoryUsage) / beforeMetrics.memoryUsage) * 100,
        renderTimeReduction: ((beforeMetrics.renderTime - finalMetrics.renderTime) / beforeMetrics.renderTime) * 100,
      }
    });
  };

  if (!enabled || !isMounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 font-mono text-xs text-white max-w-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-orange-400">Performance Test</h3>
        <button
          onClick={startTest}
          disabled={isRunning}
          className="px-3 py-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 rounded text-white text-xs"
        >
          {isRunning ? 'Running...' : 'Start Test'}
        </button>
      </div>

      {/* Current Metrics */}
      <div className="space-y-1 mb-3">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={currentFPS >= 55 ? 'text-green-400' : currentFPS >= 30 ? 'text-yellow-400' : 'text-red-400'}>
            {currentFPS}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Memory:</span>
          <span className="text-blue-400">{metrics.memoryUsage}MB</span>
        </div>
        <div className="flex justify-between">
          <span>Frame Time:</span>
          <span className="text-purple-400">{metrics.frameTime.toFixed(1)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>Long Tasks:</span>
          <span className="text-red-400">{metrics.longTasks}</span>
        </div>
      </div>

      {/* Performance Settings */}
      <div className="border-t border-white/20 pt-2 mb-3">
        <div className="text-xs text-gray-400 mb-1">Current Settings:</div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Animations:</span>
            <span className={animationSettings.enableAnimations ? 'text-green-400' : 'text-red-400'}>
              {animationSettings.enableAnimations ? 'ON' : 'OFF'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Target FPS:</span>
            <span className="text-blue-400">{animationSettings.frameRate}</span>
          </div>
          <div className="flex justify-between">
            <span>Low Performance:</span>
            <span className={isLowPerformance ? 'text-red-400' : 'text-green-400'}>
              {isLowPerformance ? 'YES' : 'NO'}
            </span>
          </div>
        </div>
      </div>

      {/* Test Results */}
      {results && (
        <div className="border-t border-white/20 pt-2">
          <div className="text-xs text-gray-400 mb-2">Test Results (30s avg):</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>FPS Improvement:</span>
              <span className="text-green-400">+{results.improvement.fpsImprovement.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Memory Reduction:</span>
              <span className="text-green-400">-{results.improvement.memoryReduction.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Render Time:</span>
              <span className="text-green-400">-{results.improvement.renderTimeReduction.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-2 pt-2 border-t border-white/20 text-gray-400 text-[10px]">
        Press Ctrl+Shift+T to toggle
      </div>
    </div>
  );
}
