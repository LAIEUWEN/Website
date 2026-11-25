"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type LanternStyle = "tall" | "pagoda" | "globe";
export type ChainStyle = "iron" | "brass" | "heavy" | "thin";
export type GlowTone = "amber" | "golden" | "crimson" | "warm";

export interface LanternConfig {
  name: string;
  sheetSrc: string;
  frameWidth: number;
  frameHeight: number;
  cols: number;
  rows: number;
  flameCenterY: number;
}

export const LANTERN_CONFIGS: Record<LanternStyle, LanternConfig> = {
  tall: {
    name: "Gothic Iron",
    sheetSrc: "/lanterns/sprites/lantern-tall-sheet.png",
    frameWidth: 32,
    frameHeight: 51,
    cols: 7,
    rows: 6,
    flameCenterY: 34,
  },
  pagoda: {
    name: "Pagoda Red",
    sheetSrc: "/lanterns/sprites/lantern-pagoda-sheet.png",
    frameWidth: 34,
    frameHeight: 40,
    cols: 7,
    rows: 6,
    flameCenterY: 26,
  },
  globe: {
    name: "Brass Globe",
    sheetSrc: "/lanterns/sprites/lantern-globe-sheet.png",
    frameWidth: 30,
    frameHeight: 45,
    cols: 7,
    rows: 6,
    flameCenterY: 29,
  },
};

// Pure multi-stop radial gradients (no expensive CSS filter: blur() passes)
const GLOW_PALETTES: Record<
  GlowTone,
  {
    core: string;
    wash: string;
  }
> = {
  amber: {
    core: "radial-gradient(circle, rgba(255, 220, 105, 0.9) 0%, rgba(242, 130, 65, 0.58) 22%, rgba(217, 56, 30, 0.22) 45%, rgba(217, 56, 30, 0.06) 65%, transparent 78%)",
    wash: "radial-gradient(circle, rgba(242, 130, 65, 0.34) 0%, rgba(232, 111, 44, 0.15) 34%, rgba(217, 56, 30, 0.04) 58%, transparent 76%)",
  },
  golden: {
    core: "radial-gradient(circle, rgba(255, 242, 140, 0.94) 0%, rgba(250, 195, 55, 0.62) 24%, rgba(230, 120, 25, 0.22) 46%, rgba(230, 120, 25, 0.06) 66%, transparent 78%)",
    wash: "radial-gradient(circle, rgba(250, 185, 45, 0.36) 0%, rgba(245, 160, 40, 0.16) 35%, rgba(230, 100, 20, 0.04) 58%, transparent 76%)",
  },
  crimson: {
    core: "radial-gradient(circle, rgba(255, 200, 120, 0.9) 0%, rgba(235, 95, 50, 0.6) 24%, rgba(190, 35, 20, 0.24) 46%, rgba(190, 35, 20, 0.06) 66%, transparent 78%)",
    wash: "radial-gradient(circle, rgba(230, 75, 40, 0.36) 0%, rgba(217, 56, 30, 0.16) 35%, rgba(180, 30, 20, 0.04) 58%, transparent 76%)",
  },
  warm: {
    core: "radial-gradient(circle, rgba(255, 238, 170, 0.9) 0%, rgba(245, 170, 75, 0.58) 24%, rgba(210, 105, 30, 0.2) 46%, rgba(210, 105, 30, 0.05) 66%, transparent 78%)",
    wash: "radial-gradient(circle, rgba(240, 160, 65, 0.32) 0%, rgba(220, 135, 50, 0.14) 35%, rgba(200, 95, 30, 0.04) 58%, transparent 76%)",
  },
};

// Shared sprite sheet cache across all lantern instances
const spriteCache = new Map<string, HTMLImageElement>();
const spritePromises = new Map<string, Promise<HTMLImageElement>>();

function loadSpriteSheet(src: string): Promise<HTMLImageElement> {
  const cached = spriteCache.get(src);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }
  const existing = spritePromises.get(src);
  if (existing) return existing;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      spriteCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
  spritePromises.set(src, promise);
  return promise;
}

export interface LanternCanvasProps {
  style?: LanternStyle;
  scale?: number; // Visual pixel multiplier (e.g. 2.4 - 3.8 for foreground, 1.3 - 2.2 for depth)
  cordLength?: number; // Length of hanging chain in px (e.g. 28 to 185)
  autoIgnite?: boolean; // Starts igniting on load (default: true)
  className?: string;
  opacity?: number; // Opacity for background depth (0.1 to 1.0)
  swayDelay?: number; // Offset swing phase in seconds
  swayDuration?: number; // Swing speed in seconds
  swayAngle?: number; // Swing angle in degrees (default: auto based on scale)
  lightIntensity?: number; // Multiplier for emitted light (default: 1)
  lightRadius?: number; // Multiplier for glow aura size (default: 1)
  glowTone?: GlowTone; // Color atmosphere of the emitted flame
  chainStyle?: ChainStyle; // Appearance of bracket & chain links
  interactive?: boolean; // Allow clicking lantern itself to toggle (default: true)
  showControls?: boolean; // Kept for backwards compatibility
}

export function LanternCanvas({
  style = "tall",
  scale = 3.4,
  cordLength = 60,
  autoIgnite = true,
  className = "",
  opacity = 1,
  swayDelay = 0,
  swayDuration = 4.8,
  swayAngle,
  lightIntensity = 1,
  lightRadius = 1,
  glowTone,
  chainStyle,
  interactive = true,
}: LanternCanvasProps) {
  const [currentStyle] = useState<LanternStyle>(style);
  const [state, setState] = useState<"unlit" | "igniting" | "burning" | "extinguishing">(
    autoIgnite ? "igniting" : "unlit"
  );
  const [isSwinging, setIsSwinging] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef<number>(0);
  const isCooldownRef = useRef<boolean>(false);

  // Pause both canvas sprite ticks and CSS sway/glow animations when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      {
        rootMargin: "200px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const config = LANTERN_CONFIGS[currentStyle];
  const displayWidth = Math.round(config.frameWidth * scale);
  const displayHeight = Math.round(config.frameHeight * scale);

  const resolvedGlowTone: GlowTone =
    glowTone ?? (currentStyle === "pagoda" ? "crimson" : currentStyle === "tall" ? "golden" : "warm");

  const resolvedChainStyle: ChainStyle =
    chainStyle ?? (scale >= 3.5 ? "heavy" : scale <= 2.2 ? "thin" : "iron");

  const resolvedSwayAngle =
    swayAngle ?? (scale >= 3.5 ? 1.9 : scale <= 2.2 ? 3.2 : 2.5);

  const palette = GLOW_PALETTES[resolvedGlowTone];

  // Draw native 1:1 sprite pixels onto compact canvas buffer; CSS scales crisply via GPU
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      if (!canvas || !img) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const col = frameIndex % config.cols;
      const row = Math.floor(frameIndex / config.cols);
      const sx = col * config.frameWidth;
      const sy = row * config.frameHeight;

      ctx.clearRect(0, 0, config.frameWidth, config.frameHeight);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        img,
        sx,
        sy,
        config.frameWidth,
        config.frameHeight,
        0,
        0,
        config.frameWidth,
        config.frameHeight
      );
    },
    [config]
  );

  // Load shared sprite sheet once
  useEffect(() => {
    let cancelled = false;
    loadSpriteSheet(config.sheetSrc)
      .then((img) => {
        if (cancelled) return;
        imgRef.current = img;
        drawFrame(frameRef.current);
      })
      .catch(() => {
        // Ignore transient image load errors
      });
    return () => {
      cancelled = true;
    };
  }, [config.sheetSrc, drawFrame]);

  // Vsync-aligned rAF loop with zero React state re-renders during steady-state burning
  useEffect(() => {
    if (!isInViewport) return;

    if (state === "unlit") {
      frameRef.current = 0;
      drawFrame(0);
      return;
    }

    let rafId = 0;
    let lastTime = performance.now();

    const step = (now: number) => {
      if (document.hidden) {
        lastTime = now;
        rafId = window.requestAnimationFrame(step);
        return;
      }

      const interval = state === "igniting" ? 90 : state === "burning" ? 120 : 100;
      if (now - lastTime >= interval) {
        lastTime = now - ((now - lastTime) % interval);

        if (state === "igniting") {
          if (frameRef.current < 6) {
            frameRef.current += 1;
            drawFrame(frameRef.current);
          } else {
            frameRef.current = 7;
            drawFrame(7);
            setState("burning");
            return;
          }
        } else if (state === "burning") {
          frameRef.current =
            frameRef.current >= 13 || frameRef.current < 7 ? 7 : frameRef.current + 1;
          drawFrame(frameRef.current);
        } else if (state === "extinguishing") {
          if (frameRef.current < 34 || frameRef.current > 37) {
            frameRef.current = 34;
            drawFrame(34);
          } else if (frameRef.current < 37) {
            frameRef.current += 1;
            drawFrame(frameRef.current);
          } else {
            frameRef.current = 0;
            drawFrame(0);
            setState("unlit");
            return;
          }
        }
      }

      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [state, drawFrame, isInViewport]);

  const isLit = state === "burning" || state === "igniting";
  const isInteractive = interactive && opacity >= 0.5;
  const isTransitioning = state === "igniting" || state === "extinguishing";

  const handleToggle = () => {
    if (!isInteractive) return;
    if (isTransitioning || isCooldownRef.current) return;

    isCooldownRef.current = true;
    setTimeout(() => {
      isCooldownRef.current = false;
    }, 750);

    setIsSwinging(true);
    setTimeout(() => setIsSwinging(false), 2000);

    if (state === "unlit") {
      setState("igniting");
    } else {
      setState("extinguishing");
    }
  };

  const flameOffsetTop = Math.round(config.flameCenterY * scale);
  const bracketHeight = scale >= 3.5 ? 10 : scale <= 2.2 ? 6 : 8;
  const ringOffset = scale <= 2.2 ? 10 : 12;
  const stationaryWashTop = bracketHeight + cordLength + ringOffset + flameOffsetTop;

  const bracketClasses: Record<ChainStyle, string> = {
    heavy: "h-2.5 w-8 border-2 border-ink bg-espresso shadow-brutal-sm rounded-[1px] z-30",
    iron: "h-2 w-6 border-2 border-ink bg-espresso shadow-brutal-sm rounded-[1px] z-30",
    brass: "h-2 w-6 border-2 border-ink bg-[#3a2215] shadow-brutal-sm rounded-[1px] z-30",
    thin: "h-1.5 w-4 border-2 border-ink bg-espresso shadow-brutal-sm rounded-[1px] z-30",
  };

  const chainClasses: Record<ChainStyle, string> = {
    heavy:
      "w-[5px] border-x-2 border-ink bg-[repeating-linear-gradient(to_bottom,#111_0px,#111_5px,transparent_5px,transparent_9px)] dark:bg-[repeating-linear-gradient(to_bottom,#fff_0px,#fff_5px,transparent_5px,transparent_9px)]",
    iron:
      "w-[3px] border-x border-ink/90 bg-[repeating-linear-gradient(to_bottom,#111_0px,#111_4px,transparent_4px,transparent_7px)] dark:bg-[repeating-linear-gradient(to_bottom,#eee_0px,#eee_4px,transparent_4px,transparent_7px)]",
    brass:
      "w-[3px] border-x border-[#4a2e18] bg-[repeating-linear-gradient(to_bottom,#b8860b_0px,#b8860b_3px,transparent_3px,transparent_6px)]",
    thin:
      "w-[2px] border-x border-ink/70 bg-[repeating-linear-gradient(to_bottom,#111_0px,#111_3px,transparent_3px,transparent_5px)] dark:bg-[repeating-linear-gradient(to_bottom,#ccc_0px,#ccc_3px,transparent_3px,transparent_5px)]",
  };

  const ringClasses: Record<ChainStyle, string> = {
    heavy: "-mt-1 h-4 w-4 rounded-full border-2 border-ink bg-sand shadow-sm z-20",
    iron: "-mt-1 h-3.5 w-3.5 rounded-full border-2 border-ink bg-sand/90 shadow-sm z-20",
    brass: "-mt-1 h-3.5 w-3.5 rounded-full border-2 border-[#4a2e18] bg-[#d4af37]/80 shadow-sm z-20",
    thin: "-mt-0.5 h-3 w-3 rounded-full border-2 border-ink bg-sand/90 shadow-sm z-20",
  };

  return (
    <div
      ref={containerRef}
      className={`absolute flex flex-col items-center select-none ${
        isInteractive ? "pointer-events-auto" : "pointer-events-none"
      } ${className}`}
      style={{ opacity }}
    >
      {/* Stationary wide ambient wash (outside rotating sway container for low GPU cost) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500"
        style={{
          top: `${stationaryWashTop}px`,
          width: `${Math.round(520 * lightRadius)}px`,
          height: `${Math.round(520 * lightRadius)}px`,
          opacity: isLit ? Math.min(1, 0.78 * lightIntensity) : 0,
          background: palette.wash,
        }}
      />

      {/* 1. Anchored Ceiling Bracket (Stationary) */}
      <div className={bracketClasses[resolvedChainStyle]} />

      {/* 2. Pendulum Sway Container (Chain + Ring + Lantern Body + Compact Core Glow) */}
      <div
        onClick={handleToggle}
        className={`flex flex-col items-center lantern-sway ${
          isInteractive ? "cursor-pointer" : ""
        } ${isSwinging ? "scale-105" : ""}`}
        style={
          {
            transformOrigin: "top center",
            animationDuration: `${swayDuration}s`,
            animationDelay: `${swayDelay}s`,
            animationPlayState: isInViewport ? "running" : "paused",
            "--sway-angle": `${resolvedSwayAngle}deg`,
          } as React.CSSProperties
        }
      >
        {/* Hanging Chain Links */}
        <div
          className={chainClasses[resolvedChainStyle]}
          style={{ height: `${cordLength}px` }}
        />

        {/* Top Iron Mounting Ring */}
        <div className={ringClasses[resolvedChainStyle]} />

        {/* 3. Lantern Body & Compact Core Glow */}
        <div className="relative -mt-1">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
            style={{
              top: `${flameOffsetTop}px`,
              width: `${Math.round(240 * lightRadius)}px`,
              height: `${Math.round(240 * lightRadius)}px`,
              opacity: isLit ? Math.min(1, 0.92 * lightIntensity) : 0,
            }}
          >
            <div
              className={`h-full w-full rounded-full ${isLit ? "lantern-glow" : ""}`}
              style={{
                background: palette.core,
                animationDelay: `${swayDelay}s`,
                animationPlayState: isInViewport ? "running" : "paused",
              }}
            />
          </div>

          {/* Native-buffer Pixel-Art Animated Canvas (GPU crisp upscale) */}
          <canvas
            ref={canvasRef}
            width={config.frameWidth}
            height={config.frameHeight}
            className="relative z-10 pixel-art transition-transform duration-300 hover:scale-[1.04]"
            style={{
              width: `${displayWidth}px`,
              height: `${displayHeight}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
