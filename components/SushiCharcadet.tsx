"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";

export function SushiCharcadet() {
  const [reaction, setReaction] = useState<string | null>(null);
  const [isJumping, setIsJumping] = useState(false);

  const handleCharcadetClick = () => {
    if (isJumping) return;
    setIsJumping(true);

    const emotes = ["🔥", "❤️"];
    const chosen = emotes[Math.floor(Math.random() * emotes.length)];
    setReaction(chosen);

    setTimeout(() => {
      setIsJumping(false);
    }, 520);

    setTimeout(() => {
      setReaction(null);
    }, 1400);
  };

  return (
    <div className="mt-8 flex flex-col items-center select-none">
      {/* 
        Native-resolution pixel stage (280x160):
      */}
      <div className="relative h-[155px] w-[280px]">
        {/* Charcadet: */}
        <m.div
          onClick={handleCharcadetClick}
          className="absolute z-10 cursor-pointer"
          style={{
            left: "111px",
            top: "14px",
            width: "57px",
            height: "129px",
          }}
          animate={
            isJumping
              ? { y: [0, -28, 0], scale: [1, 1.05, 1] }
              : { y: [0, -2, 0] }
          }
          transition={
            isJumping
              ? { duration: 0.48, ease: "easeOut" }
              : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
          }
          title="Click Charcadet!"
        >
          {/* Reaction Emote Bubble */}
          <AnimatePresence>
            {reaction && (
              <m.span
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -20, scale: 1.2 }}
                exit={{ opacity: 0, y: -30, scale: 0.8 }}
                transition={{ duration: 0.35 }}
                className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 text-base select-none"
              >
                {reaction}
              </m.span>
            )}
          </AnimatePresence>

          {/* Charcadet Sprite  */}
          <img
            src="/sushi/charcadet_cropped.png"
            alt="Charcadet"
            width={57}
            height={129}
            draggable={false}
            className="pixel-art block select-none drop-shadow-sm"
            style={{
              width: "57px",
              height: "129px",
              imageRendering: "pixelated",
            }}
          />
        </m.div>

        {/* Wooden Sushi Geta  */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: "20px",
            top: "95px",
            width: "240px",
            height: "55px",
          }}
        >
          <img
            src="/sushi/table.png"
            alt="Wooden Sushi Table"
            width={240}
            height={55}
            draggable={false}
            className="pixel-art block select-none"
            style={{
              width: "240px",
              height: "55px",
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* Cup */}
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            left: "68px",
            top: "76px",
            width: "34px",
            height: "38px",
          }}
        >
          <img
            src="/sushi/cup.png"
            alt="Teacup"
            width={34}
            height={38}
            draggable={false}
            className="pixel-art block select-none"
            style={{
              width: "34px",
              height: "38px",
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* Sushi  */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "114px",
            top: "88px",
            width: "54px",
            height: "17px",
            zIndex: 31,
          }}
        >
          <img
            src="/sushi/sushi.png"
            alt="Sushi 1"
            width={54}
            height={17}
            draggable={false}
            className="pixel-art block select-none"
            style={{
              width: "54px",
              height: "17px",
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* Front Sushi Piece */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "122px",
            top: "98px",
            width: "54px",
            height: "17px",
            zIndex: 32,
          }}
        >
          <img
            src="/sushi/sushi.png"
            alt="Sushi 2"
            width={54}
            height={17}
            draggable={false}
            className="pixel-art block select-none"
            style={{
              width: "54px",
              height: "17px",
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* Chopsticks  */}
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            left: "160px",
            top: "80px",
            width: "68px",
            height: "50px",
          }}
        >
          <img
            src="/sushi/chopsticks.png"
            alt="Chopsticks"
            width={68}
            height={50}
            draggable={false}
            className="pixel-art block select-none"
            style={{
              width: "68px",
              height: "50px",
              imageRendering: "pixelated",
            }}
          />
        </div>
      </div>

      <p className="mt-2 text-center font-mono text-xs text-ink/60">
        Click on charcadet for something cool
      </p>
    </div>
  );
}
