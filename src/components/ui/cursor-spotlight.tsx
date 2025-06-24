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
          'pointer-events-none absolute rounded-full',
          'bg-radial-gradient from-yellow-400/60 via-orange-500/40 to-red-500/20',
          'blur-3xl transition-opacity duration-300',
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
        }}
      />
    </div>
  );
}
