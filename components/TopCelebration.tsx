"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import confetti from "canvas-confetti";
import { LanternIcon } from "./icons";

export function TopCelebration() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerCelebration = () => {
    // 1. Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 2. Fire side confetti cannons
    try {
      const colors = ["#D9381E", "#E86F2C", "#F5EFE6", "#111111", "#F4C19C"];

      // Initial powerful bursts from both sides
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 75,
        origin: { x: 0, y: 0.85 },
        colors,
        zIndex: 999999,
      });

      confetti({
        particleCount: 60,
        angle: 120,
        spread: 75,
        origin: { x: 1, y: 0.85 },
        colors,
        zIndex: 999999,
      });

      // Follow-up celebratory stream for 1.6 seconds
      const end = Date.now() + 1600;
      const interval: ReturnType<typeof setInterval> = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }
        confetti({
          particleCount: 18,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.85 },
          colors,
          zIndex: 999999,
        });
        confetti({
          particleCount: 18,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.85 },
          colors,
          zIndex: 999999,
        });
      }, 180);
    } catch (e) {
      console.warn("Confetti animation failed:", e);
    }

    // 3. Show darkened overlay & pop-up
    setIsOpen(true);
  };

  // Global listener for any click targeting "#top" or [data-back-to-top]
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(
        'a[href="#top"], [data-back-to-top], [data-top-celebration]'
      );
      if (target) {
        e.preventDefault();
        triggerCelebration();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Celebration message"
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
        >
          {/* 1. Darkened backdrop (click to close) */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm cursor-pointer"
          />

          {/* 2. Neo-brutalist pop-up card */}
          <m.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
            className="relative z-10 w-full max-w-sm border-2 border-ink bg-sand p-6 text-center text-ink shadow-brutal-lg"
          >
            {/* Close X button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close message"
              className="absolute top-3 right-3 grid h-8 w-8 place-items-center border-2 border-ink bg-beige text-ink shadow-brutal-sm transition-transform hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none cursor-pointer"
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            {/* Lantern celebration icon */}
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center border-2 border-ink bg-orange text-ink shadow-brutal-sm">
              <LanternIcon size={26} />
            </div>

            {/* Requested message */}
            <h4 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
              pretty cool ey.
            </h4>

            <p className="mt-2 text-sm text-ink/80">
              Click the button or anywhere on the screen to close!
            </p>

            {/* Close CTA button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="brutal-btn btn-crimson mt-5 w-full text-sm cursor-pointer"
            >
              Close
            </button>
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
