'use client';
import { cn } from '@/lib/utils';
import { useMotionValue, animate, motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import useMeasure from 'react-use-measure';
import { usePerformance } from '@/contexts/PerformanceContext';

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const { animationSettings, intersectionSettings } = usePerformance();
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const isVisibleRef = useRef(true);

  // Adjust duration based on performance settings
  const optimizedDuration = animationSettings.enableAnimations
    ? duration * (animationSettings.frameRate / 60)
    : duration * 2;

  // Intersection Observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting && animationRef.current) {
          animationRef.current.stop();
        }
      },
      intersectionSettings
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!isVisibleRef.current) return;
    let controls;
    const size = direction === 'horizontal' ? width : height;
    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration:
          currentDuration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: animationSettings.enableAnimations ? optimizedDuration : optimizedDuration * 2,
        repeat: animationSettings.enableAnimations ? Infinity : 0,
        repeatType: 'loop',
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    animationRef.current = controls;
    return () => controls?.stop();
  }, [
    key,
    translation,
    currentDuration,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
  ]);

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentDuration(durationOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentDuration(duration);
        },
      }
    : {};

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        className='flex w-max will-change-transform'
        style={{
          ...(direction === 'horizontal'
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          transform: 'translateZ(0)', // Force GPU acceleration
          backfaceVisibility: 'hidden',
        }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
