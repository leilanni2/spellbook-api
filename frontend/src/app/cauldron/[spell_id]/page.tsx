"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, useAnimationControls, motion } from "framer-motion";
import { brew, getSpells, type Spell } from "@/lib/api";
import ResultOverlay from "@/components/ResultOverlay";
import CauldronHearth from "@/components/CauldronHearth";

const MAX_INGREDIENTS = 10;
const DECOY_COUNT = 6;

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type BrewState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; result: Awaited<ReturnType<typeof brew>> }
  | { status: "error"; message: string };

export default function CauldronPage() {
  const params = useParams<{ spell_id: string }>();
  const spellId = params.spell_id;

  const [spells, setSpells] = useState<Spell[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pool, setPool] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [stirCount, setStirCount] = useState(0);
  const [brewState, setBrewState] = useState<BrewState>({ status: "idle" });

  const spoonControls = useAnimationControls();

  useEffect(() => {
    getSpells()
      .then((all) => {
        setSpells(all);
        const spell = all.find((s) => s.id === spellId);
        if (!spell) return;

        const correct = spell.ingredients;
        const correctSet = new Set(correct);
        const otherIngredients = Array.from(
          new Set(
            all
              .filter((s) => s.id !== spellId)
              .flatMap((s) => s.ingredients)
              .filter((ingredient) => !correctSet.has(ingredient))
          )
        );
        const decoys = shuffle(otherIngredients).slice(0, DECOY_COUNT);
        setPool(shuffle([...correct, ...decoys]));
      })
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : String(err))
      );
  }, [spellId]);

  const spell = useMemo(
    () => spells?.find((s) => s.id === spellId) ?? null,
    [spells, spellId]
  );

  function toggleIngredient(ingredient: string) {
    setSelected((current) => {
      if (current.includes(ingredient)) {
        return current.filter((i) => i !== ingredient);
      }
      if (current.length >= MAX_INGREDIENTS) return current;
      return [...current, ingredient];
    });
  }

  function stir() {
    if (stirCount >= 20) return;
    setStirCount((c) => c + 1);
    spoonControls.start({
      rotate: [0, -28, 22, -12, 0],
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  }

  function resetAttempt() {
    setSelected([]);
    setStirCount(0);
    setBrewState({ status: "idle" });
  }

  async function handleBrew() {
    if (!spell || selected.length === 0) return;
    setBrewState({ status: "loading" });
    try {
      const result = await brew({
        spell_id: spell.id,
        selected_ingredients: selected,
        stir_count: stirCount,
      });
      setBrewState({ status: "done", result });
    } catch (err) {
      setBrewState({
        status: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (loadError) {
    return (
      <div className="bg-dark-wood-texture flex flex-1 items-center justify-center p-8 text-center">
        <p className="max-w-md text-red-300">{loadError}</p>
      </div>
    );
  }

  if (!spells) {
    return (
      <div className="bg-dark-wood-texture flex flex-1 items-center justify-center">
        <p className="animate-pulse text-parchment/70">Gathering ingredients…</p>
      </div>
    );
  }

  if (!spell) {
    return (
      <div className="bg-dark-wood-texture flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-parchment">Unknown spell: {spellId}</p>
        <Link href="/" className="text-accent underline">
          Back to the spellbook
        </Link>
      </div>
    );
  }

  const shelfIngredients = pool.filter((i) => !selected.includes(i));

  return (
    <main className="bg-dark-wood-texture mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10">
      <div>
        <Link href="/" className="text-sm text-accent underline">
          ← Back to the spellbook
        </Link>
        <h1 className="font-heading mt-2 text-4xl text-parchment drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          🧪 Brewing: {spell.name}
        </h1>
        <p className="text-parchment/60">
          Select the ingredients, stir the cauldron, then brew.
        </p>
      </div>

      <CauldronHearth />

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-parchment/60">
          Ingredient Shelf
        </h2>
        <div className="flex flex-wrap gap-2 rounded-lg border border-parchment/20 p-3">
          {shelfIngredients.length === 0 && (
            <p className="text-sm text-parchment/40">Shelf is empty.</p>
          )}
          {shelfIngredients.map((ingredient) => (
            <button
              key={ingredient}
              onClick={() => toggleIngredient(ingredient)}
              disabled={selected.length >= MAX_INGREDIENTS}
              className="rounded-full bg-parchment px-3 py-1.5 text-sm capitalize text-ink shadow transition hover:bg-parchment-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {ingredient}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-parchment/60">
            Cauldron ({selected.length}/{MAX_INGREDIENTS})
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-parchment/60">Stirs: {stirCount}</span>
            <motion.button
              type="button"
              onClick={stir}
              animate={spoonControls}
              style={{ transformOrigin: "50% 90%" }}
              title="Stir the cauldron"
              className="text-2xl"
            >
              🥄
            </motion.button>
          </div>
        </div>

        <div className="min-h-[120px] rounded-full border-4 border-accent/50 bg-ink/60 p-4">
          <div className="flex flex-wrap gap-2">
            {selected.length === 0 && (
              <p className="text-sm text-parchment/30">
                Click ingredients on the shelf to drop them in.
              </p>
            )}
            {selected.map((ingredient) => (
              <button
                key={ingredient}
                onClick={() => toggleIngredient(ingredient)}
                className="rounded-full bg-accent px-3 py-1.5 text-sm capitalize text-ink shadow"
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>
      </section>

      {brewState.status === "error" && (
        <p className="text-sm text-red-300">{brewState.message}</p>
      )}

      <button
        onClick={handleBrew}
        disabled={selected.length === 0 || brewState.status === "loading"}
        className="self-start rounded-full bg-accent px-6 py-2.5 font-semibold text-ink shadow transition hover:bg-accent/80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {brewState.status === "loading" ? "Brewing…" : "Brew!"}
      </button>

      <AnimatePresence>
        {brewState.status === "done" && (
          <ResultOverlay result={brewState.result} onBrewAgain={resetAttempt} />
        )}
      </AnimatePresence>
    </main>
  );
}
