"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive Neo-Brutalist & Warm Industrial Background:
 * 1. Precision geometric dot grid & crosshair markings.
 * 2. Subtle organic radial glow that tracks cursor movement.
 * 3. Retro blueprint coordinate markers in the corners.
 */
export function BackgroundEffect() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!glowRef.current) return;
      glowRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* 1. Global Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-40" />

      {/* 2. Interactive Cursor Light Follower */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -top-40 -left-40 h-80 w-80 rounded-full opacity-35 blur-3xl transition-opacity duration-300 dark:opacity-20 will-change-transform"
        style={{
          background: "radial-gradient(circle, var(--color-orange) 0%, transparent 70%)",
        }}
      />

      {/* 3. Ambient Industrial Warm Glows (Corner & Edge depth with gentle breathing pulse) */}
      <div
        className="absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-25 blur-[100px] transition-all duration-1000 dark:opacity-15 animate-pulse"
        style={{
          background: "radial-gradient(circle, var(--color-crimson) 0%, transparent 70%)",
          animationDuration: "6s",
        }}
      />
      <div
        className="absolute top-1/2 -left-40 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full opacity-20 blur-[120px] transition-all duration-1000 dark:opacity-10 animate-pulse"
        style={{
          background: "radial-gradient(circle, var(--color-orange) 0%, transparent 70%)",
          animationDuration: "8s",
        }}
      />

      {/* 4. Industrial Technical Crosshair & Coordinate Accents */}
      <div className="absolute top-20 left-4 hidden font-mono text-[9px] uppercase tracking-widest text-ink/20 select-none xl:block">
        + SYS_COORD [3.1390° N, 101.6869° E]
      </div>
      <div className="absolute top-20 right-4 hidden font-mono text-[9px] uppercase tracking-widest text-ink/20 select-none xl:block">
        SCALE: 1:1 // GRID_40PX +
      </div>
    </div>
  );
}
