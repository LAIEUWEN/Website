"use client";

/**
 * Architectural Neo-Brutalist Background:
 * 1. Precision geometric architectural dot/line grid.
 * 2. Retro blueprint coordinate markers in the corners.
 */
export function BackgroundEffect() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* 1. Global Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-40" />

      {/* 2. Industrial Technical Crosshair & Coordinate Accents */}
      <div className="absolute top-20 left-4 hidden font-mono text-[9px] uppercase tracking-widest text-ink/20 select-none xl:block">
        + SYS_COORD [3.1390° N, 101.6869° E]
      </div>
      <div className="absolute top-20 right-4 hidden font-mono text-[9px] uppercase tracking-widest text-ink/20 select-none xl:block">
        SCALE: 1:1 // GRID_40PX +
      </div>
    </div>
  );
}
