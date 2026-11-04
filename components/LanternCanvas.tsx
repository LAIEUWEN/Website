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

const GLOW_PALETTES: Record<
  GlowTone,
  {
    core: string;
    ambient: string;
    wash: string;
  }
> = {
  amber: {
    core: "radial-gradient(circle, rgba(255, 215, 90, 0.95) 0%, rgba(242, 130, 65, 0.75) 30%, rgba(217, 56, 30, 0.25) 60%, transparent 75%)",
    ambient: "radial-gradient(circle, rgba(242, 130, 65, 0.6) 0%, rgba(217, 56, 30, 0.2) 45%, transparent 75%)",
    wash: "radial-gradient(circle, rgba(232, 111, 44, 0.25) 0%, transparent 70%)",
  },
  golden: {
    core: "radial-gradient(circle, rgba(255, 240, 130, 0.98) 0%, rgba(250, 195, 55, 0.82) 32%, rgba(230, 120, 25, 0.25) 62%, transparent 75%)",
    ambient: "radial-gradient(circle, rgba(250, 185, 45, 0.65) 0%, rgba(230, 100, 20, 0.2) 45%, transparent 75%)",
    wash: "radial-gradient(circle, rgba(245, 160, 40, 0.25) 0%, transparent 70%)",
  },
  crimson: {
    core: "radial-gradient(circle, rgba(255, 195, 110, 0.95) 0%, rgba(235, 95, 50, 0.82) 32%, rgba(190, 35, 20, 0.3) 65%, transparent 75%)",
    ambient: "radial-gradient(circle, rgba(230, 75, 40, 0.62) 0%, rgba(180, 30, 20, 0.22) 48%, transparent 75%)",
    wash: "radial-gradient(circle, rgba(217, 56, 30, 0.25) 0%, transparent 70%)",
  },
  warm: {
    core: "radial-gradient(circle, rgba(255, 235, 160, 0.95) 0%, rgba(245, 170, 75, 0.75) 32%, rgba(210, 105, 30, 0.22) 60%, transparent 75%)",
    ambient: "radial-gradient(circle, rgba(240, 160, 65, 0.58) 0%, rgba(200, 95, 30, 0.18) 45%, transparent 75%)",
    wash: "radial-gradient(circle, rgba(220, 135, 50, 0.22) 0%, transparent 70%)",
  },
};

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
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isSwinging, setIsSwinging] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const animationTimerRef = useRef<number | null>(null);
  const isCooldownRef = useRef<boolean>(false);

  // Performance Optimization: IntersectionObserver pauses off-screen animation loops (0 CPU/GPU when out of view)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      {
        rootMargin: "250px 0px", // Pre-wake 250px before scrolling into view for seamless zero-hitch transitions
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const config = LANTERN_CONFIGS[currentStyle];
  const canvasWidth = Math.round(config.frameWidth * scale);
  const canvasHeight = Math.round(config.frameHeight * scale);

  // Auto-pick defaults based on style & scale if not explicitly given
  const resolvedGlowTone: GlowTone =
    glowTone ?? (currentStyle === "pagoda" ? "crimson" : currentStyle === "tall" ? "golden" : "warm");

  const resolvedChainStyle: ChainStyle =
    chainStyle ?? (scale >= 3.5 ? "heavy" : scale <= 2.2 ? "thin" : "iron");

  const resolvedSwayAngle =
    swayAngle ?? (scale >= 3.5 ? 1.9 : scale <= 2.2 ? 3.2 : 2.5);

  const palette = GLOW_PALETTES[resolvedGlowTone];

  // Load sprite sheet
  useEffect(() => {
    const img = new window.Image();
    img.src = config.sheetSrc;
    img.onload = () => {
      imgRef.current = img;
      drawFrame(currentFrame);
    };
  }, [config.sheetSrc]);

  // Draw current frame
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

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
        img,
        sx,
        sy,
        config.frameWidth,
        config.frameHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );
    },
    [config]
  );

  // Frame animation controller: 0..6 (igniting) -> 7..13 (burning loop) -> 34..37 (extinguishing)
  useEffect(() => {
    // When off-screen, completely suspend the animation loop to free CPU & GPU cycles
    if (!isInViewport) return;

    let frame = currentFrame;

    const tick = () => {
      if (state === "igniting") {
        if (frame < 6) {
          frame++;
          setCurrentFrame(frame);
          drawFrame(frame);
          animationTimerRef.current = window.setTimeout(tick, 90);
        } else {
          // Reached full flame -> start burning loop
          setState("burning");
          frame = 7;
          setCurrentFrame(frame);
          drawFrame(frame);
          animationTimerRef.current = window.setTimeout(tick, 120);
        }
      } else if (state === "burning") {
        // Continuous burning loop (frames 7 to 13)
        frame = frame >= 13 ? 7 : frame + 1;
        setCurrentFrame(frame);
        drawFrame(frame);
        animationTimerRef.current = window.setTimeout(tick, 120);
      } else if (state === "extinguishing") {
        if (frame < 34 || frame > 37) {
          frame = 34;
        } else if (frame < 37) {
          frame++;
        } else {
          setState("unlit");
          frame = 0;
          setCurrentFrame(0);
          drawFrame(0);
          return;
        }
        setCurrentFrame(frame);
        drawFrame(frame);
        animationTimerRef.current = window.setTimeout(tick, 100);
      } else if (state === "unlit") {
        setCurrentFrame(0);
        drawFrame(0);
      }
    };

    animationTimerRef.current = window.setTimeout(tick, 90);

    return () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    };
  }, [state, drawFrame, isInViewport]);

  // Dynamic brightness tied to animation sequence
  const getBrightness = (): number => {
    if (state === "unlit" || currentFrame === 0) return 0;
    if (state === "igniting") {
      return (currentFrame / 6) * 1 * lightIntensity;
    }
    if (state === "burning") {
      const flickers = [0.95, 1.05, 0.9, 0.88, 0.98, 1.06, 0.92];
      return (flickers[(currentFrame - 7) % flickers.length] || 1) * lightIntensity;
    }
    if (state === "extinguishing") {
      const remaining = 37 - currentFrame;
      return (remaining / 4) * 0.7 * lightIntensity;
    }
    return 0;
  };

  const brightness = getBrightness() * opacity;
  const isLit = state === "burning" || state === "igniting";
  const isInteractive = interactive && opacity >= 0.5;
  const isTransitioning = state === "igniting" || state === "extinguishing";

  const handleToggle = () => {
    if (!isInteractive) return;

    // Under-the-hood spam guard: ignore rapid clicks while transitioning or in cooldown
    if (isTransitioning || isCooldownRef.current) {
      return;
    }

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

  // Chain & Bracket Visual Variations
  const bracketClasses: Record<ChainStyle, string> = {
    heavy: "h-2.5 w-8 border-2 border-ink bg-espresso shadow-brutal-sm rounded-[1px] z-30",
    iron: "h-2 w-6 border-2 border-ink bg-espresso shadow-brutal-sm rounded-[1px] z-30",
    brass: "h-2 w-6 border-2 border-ink bg-[#3a2215] shadow-brutal-sm rounded-[1px] z-30",
    thin: "h-1.5 w-4 border-2 border-ink bg-espresso shadow-brutal-sm rounded-[1px] z-30",
  };

  const chainClasses: Record<ChainStyle, string> = {
    heavy:
      "w-[5px] border-x-2 border-ink bg-[repeating-linear-gradient(to_bottom,#111_0px,#111_5px,transparent_5px,transparent_9px)] dark:bg-[repeating-linear-gradient(to_bottom,#fff_0px,#fff_5px,transparent_5px,transparent_9px)] transition-all duration-300",
    iron:
      "w-[3px] border-x border-ink/90 bg-[repeating-linear-gradient(to_bottom,#111_0px,#111_4px,transparent_4px,transparent_7px)] dark:bg-[repeating-linear-gradient(to_bottom,#eee_0px,#eee_4px,transparent_4px,transparent_7px)] transition-all duration-300",
    brass:
      "w-[3px] border-x border-[#4a2e18] bg-[repeating-linear-gradient(to_bottom,#b8860b_0px,#b8860b_3px,transparent_3px,transparent_6px)] transition-all duration-300",
    thin:
      "w-[2px] border-x border-ink/70 bg-[repeating-linear-gradient(to_bottom,#111_0px,#111_3px,transparent_3px,transparent_5px)] dark:bg-[repeating-linear-gradient(to_bottom,#ccc_0px,#ccc_3px,transparent_3px,transparent_5px)] transition-all duration-300",
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
      style={{
        opacity,
      }}
    >
      {/* 1. Anchored Ceiling Bracket (Stationary) */}
      <div className={bracketClasses[resolvedChainStyle]} />

      {/* 2. Pendulum Sway Container (Chain + Ring + Lantern Body all swing naturally as one) */}
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

        {/* 3. Lantern Body & Emitted Light */}
        <div className="relative -mt-1">
          {/* =========================================================================
              DYNAMIC LIGHT EMISSION (Radiates outward from flame center)
             ========================================================================= */}
          {brightness > 0 && (
            <>
              {/* Core Hot Flame Glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 will-change-transform"
                style={{
                  top: `${flameOffsetTop}px`,
                  width: `${Math.round(200 * Math.max(0.65, brightness) * lightRadius)}px`,
                  height: `${Math.round(200 * Math.max(0.65, brightness) * lightRadius)}px`,
                  opacity: Math.min(1, brightness * 0.95),
                  background: palette.core,
                  filter: "blur(18px)",
                }}
              />

              {/* Expansive Ambient Background Illumination Aura */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200"
                style={{
                  top: `${flameOffsetTop}px`,
                  width: `${Math.round(380 * Math.max(0.65, brightness) * lightRadius)}px`,
                  height: `${Math.round(380 * Math.max(0.65, brightness) * lightRadius)}px`,
                  opacity: Math.min(1, brightness * 0.7),
                  background: palette.ambient,
                  filter: "blur(50px)",
                }}
              />

              {/* Deep Wide Illumination Wash onto background grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 opacity-60 dark:opacity-85"
                style={{
                  top: `${flameOffsetTop}px`,
                  width: `${Math.round(580 * Math.max(0.65, brightness) * lightRadius)}px`,
                  height: `${Math.round(580 * Math.max(0.65, brightness) * lightRadius)}px`,
                  background: palette.wash,
                  filter: "blur(80px)",
                }}
              />
            </>
          )}

          {/* Pixel-Art Animated Canvas */}
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="relative z-10 [image-rendering:pixelated] drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-[1.04]"
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
