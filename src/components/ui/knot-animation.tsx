"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { usePerformance } from "@/contexts/PerformanceContext";

/**
 * KnotAnimation - Optimized Version
 *
 * - Animated ASCII trefoil knot with optional colored tube segments.
 * - Pass the prop `color={true}` to enable color; default is grayscale.
 * - Pass the props `speedA` and `speedB` to control the spin speed (optional).
 *
 * Props:
 *   - color?: boolean (default: false) — enable colored tube segments
 *   - speedA?: number (default: 0.04) — rotation speed around the X axis (radians per frame)
 *   - speedB?: number (default: 0.02) — rotation speed around the Y axis (radians per frame)
 *
 * Performance Optimizations:
 *   - Reduced canvas size for better performance
 *   - Implemented requestAnimationFrame for smoother animations
 *   - Added GPU acceleration with CSS transforms
 *   - Optimized rendering loop with reduced complexity
 *   - Memoized expensive calculations
 */

// Reduced size for better performance
const W = 60;
const H = 30;
const PI = 3.14159265;

// ASCII brightness ramp
const ramp = ".,-~:;=!*#$@";

// Color palette for tube segments - matching hero section gradient (yellow-400 via orange-500 to red-500)
const COLOR_PALETTE = [
  "#facc15", // yellow-400
  "#f97316", // orange-500
  "#ef4444", // red-500
  "#fb923c", // orange-400
  "#fbbf24", // amber-400
  "#f59e0b", // amber-500
  "#dc2626", // red-600
  "#ea580c", // orange-600
];

type Vec3 = { x: number; y: number; z: number };

const vadd = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
const vmul = (v: Vec3, s: number): Vec3 => ({ x: v.x * s, y: v.y * s, z: v.z * s });
const vdot = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
const vnorm = (v: Vec3): Vec3 => {
  const r = Math.sqrt(vdot(v, v));
  return vmul(v, 1.0 / r);
};
const cross = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

export const KnotAnimation = ({
  color = false,
  speedA = 0.03,
  speedB = 0.015
}: {
  color?: boolean;
  speedA?: number;
  speedB?: number;
}) => {
  const { animationSettings, intersectionSettings } = usePerformance();
  const [frame, setFrame] = useState<React.ReactElement[]>([]);
  const animationRef = useRef<number | null>(null);
  const angleRef = useRef({ A: 0, B: 0 });
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLPreElement>(null);
  const isVisibleRef = useRef(true);
  const [isIntersecting, setIsIntersecting] = useState(true);

  // Adjust animation speed based on performance settings
  const optimizedSpeedA = animationSettings.enableAnimations
    ? speedA * (animationSettings.frameRate / 60)
    : speedA * 0.5;
  const optimizedSpeedB = animationSettings.enableAnimations
    ? speedB * (animationSettings.frameRate / 60)
    : speedB * 0.5;

  // Memoize expensive calculations
  const light = useMemo(() => vnorm({ x: -1, y: 1, z: -1 }), []);

  // Pre-allocate buffers to avoid garbage collection
  const buffersRef = useRef({
    screen: Array(W * H).fill(' '),
    colorIdx: Array(W * H).fill(-1),
    zbuf: Array(W * H).fill(0)
  });

  const renderFrame = useCallback(() => {
    const { screen, colorIdx, zbuf } = buffersRef.current;

    // Reset buffers efficiently
    screen.fill(' ');
    colorIdx.fill(-1);
    zbuf.fill(0);

    const { A, B } = angleRef.current;
    const cA = Math.cos(A), sA = Math.sin(A);
    const cB = Math.cos(B), sB = Math.sin(B);

    let tubeIdx = 0;
    // Reduced step size for better performance while maintaining quality
    for (let u = 0; u < 2 * PI; u += 0.08, tubeIdx++) {
        const cu = u, cu2 = 2 * cu, cu3 = 3 * cu;
        const C: Vec3 = {
          x: Math.sin(cu) + 2 * Math.sin(cu2),
          y: Math.cos(cu) - 2 * Math.cos(cu2),
          z: -Math.sin(cu3)
        };

        const T = vnorm({
          x: Math.cos(cu) + 4 * Math.cos(cu2),
          y: -Math.sin(cu) + 4 * Math.sin(cu2),
          z: -3 * Math.cos(cu3)
        });

        const up = Math.abs(vdot(T, { x: 0, y: 1, z: 0 })) < 0.99
          ? { x: 0, y: 1, z: 0 }
          : { x: 1, y: 0, z: 0 };
        const N = vnorm(cross(T, up));
        const Bn = cross(T, N);

        const R = 0.3;
        // Pick color for this tube segment
        const segColorIdx = tubeIdx % COLOR_PALETTE.length;

        // Reduced inner loop iterations for better performance
        for (let v = 0; v < 2 * PI; v += 0.25) {
          const cv = Math.cos(v), sv = Math.sin(v);
          const offs = vadd(vmul(N, cv * R), vmul(Bn, sv * R));
          const p = vadd(C, offs);

          const x1 = p.x;
          const y1 = p.y * cA - p.z * sA;
          const z1 = p.y * sA + p.z * cA;

          const x2 = x1 * cB + z1 * sB;
          const y2 = y1;
          const z2 = -x1 * sB + z1 * cB + 5.0;

          const invz = 1.0 / z2;
          // Adjusted scaling for smaller canvas
          const px = Math.floor(W / 2 + 30 * x2 * invz);
          const py = Math.floor(H / 2 - 15 * y2 * invz);

          if (px >= 0 && px < W && py >= 0 && py < H) {
            const idx = px + py * W;
            if (invz > zbuf[idx]) {
              zbuf[idx] = invz;

              const n = vnorm(offs);
              const nx1 = n.x;
              const ny1 = n.y * cA - n.z * sA;
              const nz1 = n.y * sA + n.z * cA;

              const nx2 = nx1 * cB + nz1 * sB;
              const ny2 = ny1;
              const nz2 = -nx1 * sB + nz1 * cB;

              const nr = { x: nx2, y: ny2, z: nz2 };
              const lum = Math.max(0, vdot(nr, light));
              const ci = Math.floor(lum * (ramp.length - 1));
              screen[idx] = ramp[ci];
              colorIdx[idx] = segColorIdx;
            }
          }
        }
      }

      // Optimized frame rendering with reduced DOM operations
      const frameLines: React.ReactElement[] = [];
      for (let y = 0; y < H; y++) {
        const line: React.ReactElement[] = [];
        for (let x = 0; x < W; x++) {
          const idx = x + y * W;
          if (screen[idx] === ' ') {
            line.push(<span key={x}> </span>);
          } else if (color) {
            line.push(
              <span key={x} style={{ color: COLOR_PALETTE[colorIdx[idx]] }}>{screen[idx]}</span>
            );
          } else {
            line.push(<span key={x}>{screen[idx]}</span>);
          }
        }
        frameLines.push(<div key={y}>{line}</div>);
      }
      setFrame(frameLines);
    }, [color, light]);

    // Intersection Observer for performance optimization
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          const visible = entry.isIntersecting;
          isVisibleRef.current = visible;
          setIsIntersecting(visible);

          if (!visible && animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }
        },
        intersectionSettings
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, []);

    // Use requestAnimationFrame for smoother animations
    const animate = useCallback((currentTime: number) => {
      if (!isVisibleRef.current || !animationSettings.enableAnimations) return;

      const targetFrameTime = 1000 / animationSettings.frameRate;
      if (currentTime - lastTimeRef.current >= targetFrameTime) {
        angleRef.current.A += optimizedSpeedA;
        angleRef.current.B += optimizedSpeedB;
        renderFrame();
        lastTimeRef.current = currentTime;
      }
      animationRef.current = requestAnimationFrame(animate);
    }, [renderFrame, optimizedSpeedA, optimizedSpeedB, animationSettings]);

    useEffect(() => {
      if (isIntersecting) {
        animationRef.current = requestAnimationFrame(animate);
      }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [animate, isIntersecting]);

  return (
    <pre
      ref={containerRef}
      className="font-mono text-xs whitespace-pre leading-none text-center transform-gpu will-change-transform"
      style={{
        textShadow: color ? '0 0 2px rgba(0,0,0,0.5)' : 'none',
        backfaceVisibility: 'hidden',
        perspective: '1000px',
        transform: 'translateZ(0)',
        opacity: isIntersecting ? 1 : 0.5,
        transition: 'opacity 0.3s ease-out'
      }}
    >
      {frame}
    </pre>
  );
};