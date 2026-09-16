"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { getSpells, type Spell } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [spells, setSpells] = useState<Spell[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    getSpells()
      .then(setSpells)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, []);

  function goTo(next: number) {
    if (!spells || next < 0 || next >= spells.length) return;
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  }

  if (error) {
    return (
      <div className="bg-parchment-texture flex flex-1 items-center justify-center p-8 text-center">
        <p className="max-w-md text-red-300">{error}</p>
      </div>
    );
  }

  if (!spells) {
    return (
      <div className="bg-parchment-texture flex flex-1 items-center justify-center">
        <p className="animate-pulse text-parchment/70">Opening the spellbook…</p>
      </div>
    );
  }

  const spell = spells[index];

  return (
    <main className="bg-parchment-texture flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
      <h1 className="font-heading text-4xl tracking-wide text-parchment drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
        📖 Spellbook
      </h1>

      <div className="relative w-full max-w-xl" style={{ perspective: 1800 }}>
        <div className="relative h-[460px]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.article
              key={spell.id}
              custom={direction}
              initial={{ rotateY: direction > 0 ? 100 : -100, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: direction > 0 ? -100 : 100, opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: direction > 0 ? "left center" : "right center",
                backfaceVisibility: "hidden",
              }}
              className="absolute inset-0 flex flex-col justify-between rounded-lg border-4 border-accent/60 bg-parchment p-8 text-ink shadow-2xl"
            >
              <div>
                <h2 className="font-heading text-3xl">{spell.name}</h2>
                <p className="mt-2 italic text-ink/70">{spell.flavor}</p>

                <h3 className="mt-6 text-sm font-semibold uppercase tracking-widest text-ink/60">
                  Ingredients
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {spell.ingredients.map((ingredient) => (
                    <li key={ingredient} className="capitalize">
                      {ingredient}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-sm text-ink/60">
                  Stir {spell.expected_stirs} times
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-ink/50">
                  Page {index + 1} / {spells.length}
                </span>
                <button
                  onClick={() => router.push(`/cauldron/${spell.id}`)}
                  className="rounded-full bg-accent px-5 py-2 font-semibold text-ink shadow transition hover:bg-accent/80"
                >
                  Brew this
                </button>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="rounded-full border border-parchment/40 px-4 py-2 text-parchment disabled:opacity-30"
        >
          ← Prev
        </button>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index === spells.length - 1}
          className="rounded-full border border-parchment/40 px-4 py-2 text-parchment disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </main>
  );
}
