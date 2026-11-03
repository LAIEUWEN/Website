"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/**
 * Loads only the lightweight "domAnimation" feature set (~15kb) instead of the
 * full Framer Motion bundle, and respects the user's reduced-motion setting.
 * Components should use `m.div` (not `motion.div`) to benefit from this.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
