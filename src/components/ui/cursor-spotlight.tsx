'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

type CursorSpotlightProps = {
  className?: string;
  size?: number;
};

export function CursorSpotlight({
  className,
  size = 400,
}: CursorSpotlightProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 25, stiffness: 150, mass: 0.1 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150, mass: 0.1 });

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    // Throttle mouse move events for better performance
    const now = Date.now();
    if (now - (handleMouseMove as any).lastCall < 16) return; // ~60fps
    (handleMouseMove as any).lastCall = now;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Don't render on server to prevent hydration mismatch
  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={cn(
          'pointer-events-none absolute rounded-full scroll-optimized cursor-spotlight',
          'bg-radial-gradient from-yellow-400/30 via-orange-500/20 to-red-500/10',
          'blur-xl transition-opacity duration-200 blur-on-scroll',
          isHovered ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{
          width: size,
          height: size,
          x: springX,
          y: springY,
          translateX: -size / 2,
          translateY: -size / 2,
          willChange: isHovered ? 'transform, opacity' : 'auto',
          contain: 'layout style paint',
        }}
      />
    </div>
  );
}
