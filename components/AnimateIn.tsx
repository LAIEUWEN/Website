"use client";

import { m } from "framer-motion";
import { type ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  scale?: boolean;
}

export function AnimateIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  scale = false,
}: AnimateInProps) {
  const getOffset = () => {
    switch (direction) {
      case "up":
        return { y: 28, x: 0 };
      case "down":
        return { y: -28, x: 0 };
      case "left":
        return { x: 28, y: 0 };
      case "right":
        return { x: -28, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();

  return (
    <m.div
      initial={{
        opacity: 0,
        ...offset,
        scale: scale ? 0.94 : 1,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 32,
        delay,
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}
