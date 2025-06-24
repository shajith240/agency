'use client'

import { Suspense, lazy, useEffect, useRef, useState, Component, ReactNode } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class SplineErrorBoundary extends Component<{ children: ReactNode; onError?: (error: Error) => void }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode; onError?: (error: Error) => void }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.warn('Spline 3D scene error (non-critical):', error.message)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-400/20 via-orange-500/20 to-yellow-400/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400"></div>
            </div>
            <p className="text-sm text-neutral-400 mb-2">3D Scene Error</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Delay loading slightly to improve perceived performance
          setTimeout(() => setShouldLoad(true), 100);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className || ''}`}
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      {shouldLoad ? (
        <SplineErrorBoundary
          onError={(error) => {
            console.warn('Spline 3D scene error (non-critical):', error.message);
            setHasError(true);
          }}
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            }
          >
            <Spline
              scene={scene}
              className="w-full h-full"
              style={{
                transform: 'translateZ(0)',
              }}
            />
          </Suspense>
        </SplineErrorBoundary>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse"></div>
            </div>
            <p className="text-sm text-neutral-400">Loading 3D Scene...</p>
          </div>
        </div>
      )}
    </div>
  )
}