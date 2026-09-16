import re

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from pipeline_def import expected_stir_count

app = FastAPI(title="Spellbook API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    _bundle = joblib.load("pipeline.joblib")
    PIPELINE = _bundle["pipeline"]
    SPELLS = _bundle["spells"]
    METADATA = _bundle["metadata"]
    MODEL_LOADED = True
except Exception:
    PIPELINE = None
    SPELLS = []
    METADATA = None
    MODEL_LOADED = False


def _slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


SPELL_LOOKUP = {_slugify(spell["name"]): spell for spell in SPELLS}


class BrewRequest(BaseModel):
    spell_id: str
    selected_ingredients: list[str] = Field(min_length=1, max_length=10)
    stir_count: int = Field(ge=0, le=20)


@app.get("/spells")
def list_spells():
    if not MODEL_LOADED:
        raise HTTPException(status_code=503, detail="model artifact unavailable")

    return [
        {
            "id": _slugify(spell["name"]),
            "name": spell["name"],
            "flavor": spell["flavor"],
            "ingredients": spell["ingredients"],
            "expected_stirs": spell["expected_stirs"],
        }
        for spell in SPELLS
    ]


@app.post("/brew")
def brew(payload: BrewRequest):
    if not MODEL_LOADED:
        raise HTTPException(status_code=503, detail="model artifact unavailable")

    spell = SPELL_LOOKUP.get(payload.spell_id)
    if spell is None:
        raise HTTPException(status_code=404, detail=f"unknown spell_id: {payload.spell_id}")

    correct_ingredients = spell["ingredients"]
    expected_stir = expected_stir_count(correct_ingredients)

    attempt = [(payload.selected_ingredients, correct_ingredients, payload.stir_count, expected_stir)]

    probabilities = PIPELINE.predict_proba(attempt)[0]
    classes = PIPELINE.classes_
    best_index = probabilities.argmax()

    return {
        "result": classes[best_index],
        "confidence": float(probabilities[best_index]),
    }
