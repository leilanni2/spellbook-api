"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { BrewResult } from "@/lib/api";

const POTION_BUBBLES = [
  { cx: 44, delay: 0, duration: 2.2 },
  { cx: 60, delay: 0.7, duration: 2.6 },
  { cx: 75, delay: 1.3, duration: 2.1 },
  { cx: 52, delay: 1.9, duration: 2.4 },
];

function SuccessScene() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 10 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
      })),
    []
  );

  return (
    <div className="relative flex h-64 w-64 items-center justify-center">
      <div className="animate-potion-glow absolute h-32 w-32 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500" />

      {sparkles.map((s, i) => (
        <span
          key={i}
          className="animate-sparkle absolute bottom-10 h-1.5 w-1.5 rounded-full bg-yellow-200"
          style={{ left: `${s.left}%`, animationDelay: `${s.delay}s` }}
        />
      ))}

      <motion.svg
        viewBox="0 0 120 170"
        className="relative h-44 w-32 drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.5 },
          scale: { duration: 0.6, ease: "backOut" },
          y: {
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          },
        }}
      >
        <defs>
          <linearGradient id="potionLiquid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff3b0" />
            <stop offset="45%" stopColor="#f6b93b" />
            <stop offset="100%" stopColor="#b5741a" />
          </linearGradient>
          <linearGradient id="potionGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="potionCork" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d0a86a" />
            <stop offset="100%" stopColor="#8a5a2e" />
          </linearGradient>
          <clipPath id="bottleClip">
            <path d="M50,40 C50,40 30,46 24,62 C16,84 16,112 26,130 C34,144 86,144 94,130 C104,112 104,84 96,62 C90,46 70,40 70,40 Z" />
            <rect x="50" y="20" width="20" height="20" />
          </clipPath>
          <clipPath id="liquidLevelClip">
            <rect x="10" y="58" width="100" height="90" />
          </clipPath>
        </defs>

        {/* liquid, clipped to the bottle silhouette and the fill level */}
        <g clipPath="url(#bottleClip)">
          <g clipPath="url(#liquidLevelClip)">
            <rect x="10" y="0" width="100" height="160" fill="url(#potionLiquid)" />
            {POTION_BUBBLES.map((b, i) => (
              <circle
                key={i}
                cx={b.cx}
                cy={130}
                r={i % 2 === 0 ? 4 : 3}
                fill="#fff8dd"
                opacity={0.75}
                className="animate-potion-bubble"
                style={{
                  animationDelay: `${b.delay}s`,
                  animationDuration: `${b.duration}s`,
                }}
              />
            ))}
          </g>
        </g>

        {/* glass */}
        <rect x="50" y="20" width="20" height="20" fill="url(#potionGlass)" stroke="#e8dcc0" strokeOpacity="0.5" />
        <path
          d="M50,40 C50,40 30,46 24,62 C16,84 16,112 26,130 C34,144 86,144 94,130 C104,112 104,84 96,62 C90,46 70,40 70,40 Z"
          fill="url(#potionGlass)"
          stroke="#e8dcc0"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <path
          d="M34,60 C28,78 27,102 34,120"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.35"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* cork */}
        <rect x="48" y="4" width="24" height="18" rx="5" fill="url(#potionCork)" stroke="#5a3a1e" strokeWidth="1.5" />
      </motion.svg>
    </div>
  );
}

function FizzleScene() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 8 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.1,
        drift: `${Math.random() * 20 - 10}px`,
      })),
    []
  );

  return (
    <div className="relative flex h-56 w-56 items-center justify-center">
      <div className="animate-sputter h-28 w-28 rounded-full bg-gradient-to-br from-lime-700 to-lime-900" />
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="animate-bubble absolute bottom-10 h-2 w-2 rounded-full bg-lime-300/80"
          style={
            {
              left: `${b.left}%`,
              animationDelay: `${b.delay}s`,
              "--bubble-drift": b.drift,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function ExplodeScene() {
  const shards = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return {
          x: `${Math.cos(angle) * 90}px`,
          y: `${Math.sin(angle) * 90}px`,
          delay: Math.random() * 0.15,
        };
      }),
    []
  );

  return (
    <div className="relative flex h-56 w-56 items-center justify-center text-6xl">
      <span>💥</span>
      <div className="animate-explosion absolute h-16 w-16 rounded-full bg-orange-500" />
      {shards.map((s, i) => (
        <span
          key={i}
          className="animate-shard absolute h-2 w-4 rounded-sm bg-orange-300"
          style={
            {
              "--shard-x": s.x,
              "--shard-y": s.y,
              animationDelay: `${s.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default function ResultOverlay({
  result,
  onBrewAgain,
}: {
  result: BrewResult;
  onBrewAgain: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/80 p-6 text-center ${
        result.result === "explode" ? "animate-shake" : ""
      }`}
    >
      {result.result === "success" && <SuccessScene />}
      {result.result === "fizzle" && <FizzleScene />}
      {result.result === "explode" && <ExplodeScene />}

      <div className="relative z-10">
        <p className="text-2xl font-bold capitalize text-parchment">
          {result.result}!
        </p>
        <p className="mt-1 text-sm text-parchment/60">
          confidence {(result.confidence * 100).toFixed(1)}%
        </p>
        <button
          onClick={onBrewAgain}
          className="mt-6 rounded-full bg-accent px-6 py-2 font-semibold text-ink shadow transition hover:bg-accent/80"
        >
          Brew again
        </button>
      </div>
    </motion.div>
  );
}
