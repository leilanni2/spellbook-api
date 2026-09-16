export interface Spell {
  id: string;
  name: string;
  flavor: string;
  ingredients: string[];
  expected_stirs: number;
}

export type BrewOutcome = "success" | "fizzle" | "explode";

export interface BrewResult {
  result: BrewOutcome;
  confidence: number;
}

export interface BrewPayload {
  spell_id: string;
  selected_ingredients: string[];
  stir_count: number;
}

function apiBase(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Add it to your environment (e.g. frontend/.env.local) " +
        "pointing at the Spellbook API base URL."
    );
  }
  return url.replace(/\/+$/, "");
}

export async function getSpells(): Promise<Spell[]> {
  const res = await fetch(`${apiBase()}/spells`);
  if (!res.ok) {
    throw new Error(`Failed to load spells (${res.status})`);
  }
  return res.json();
}

export async function brew(payload: BrewPayload): Promise<BrewResult> {
  const res = await fetch(`${apiBase()}/brew`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Brew failed (${res.status}): ${detail}`);
  }
  return res.json();
}
