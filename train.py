import random
from datetime import datetime, timezone

import joblib
import sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.pipeline import Pipeline

from spells import SPELLS
from pipeline_def import RecipeMatchTransformer, expected_stir_count

random.seed(42)

ATTEMPTS_PER_LABEL = 25

ALL_INGREDIENTS = sorted({ingredient for spell in SPELLS for ingredient in spell["ingredients"]})


def make_success_attempt(correct, expected_stir):
    selected = list(correct)
    stir_count = expected_stir + random.choice([-1, 0, 0, 0, 1])
    return selected, stir_count


def make_fizzle_attempt(correct, expected_stir):
    selected = list(correct)
    stir_count = expected_stir
    kind = random.choice(["missing", "extra", "stir"])

    if kind == "missing":
        removed = random.choice(selected)
        selected = [i for i in selected if i != removed]
        stir_count += random.choice([-1, 0, 1])
    elif kind == "extra":
        candidates = [i for i in ALL_INGREDIENTS if i not in correct]
        selected = selected + [random.choice(candidates)]
        stir_count += random.choice([-1, 0, 1])
    else:  # stir count off by a little
        stir_count = expected_stir + random.choice([-4, -3, -2, 2, 3, 4])

    return selected, stir_count


def make_explode_attempt(correct, expected_stir):
    selected = list(correct)
    stir_count = expected_stir
    kind = random.choice(["ingredients", "stir", "both"])

    if kind in ("ingredients", "both"):
        num_remove = min(len(selected), random.randint(2, max(2, len(selected))))
        removed = random.sample(selected, k=num_remove)
        selected = [i for i in selected if i not in removed]

        candidates = [i for i in ALL_INGREDIENTS if i not in correct]
        num_add = min(len(candidates), random.randint(2, 4))
        selected += random.sample(candidates, k=num_add)

    if kind in ("stir", "both"):
        stir_count = expected_stir + random.choice([-15, -12, -10, 10, 12, 15])

    return selected, stir_count


def build_dataset():
    X = []
    y = []

    for spell in SPELLS:
        correct = spell["ingredients"]
        expected_stir = expected_stir_count(correct)

        for _ in range(ATTEMPTS_PER_LABEL):
            selected, stir_count = make_success_attempt(correct, expected_stir)
            X.append((selected, correct, stir_count, expected_stir))
            y.append("success")

        for _ in range(ATTEMPTS_PER_LABEL):
            selected, stir_count = make_fizzle_attempt(correct, expected_stir)
            X.append((selected, correct, stir_count, expected_stir))
            y.append("fizzle")

        for _ in range(ATTEMPTS_PER_LABEL):
            selected, stir_count = make_explode_attempt(correct, expected_stir)
            X.append((selected, correct, stir_count, expected_stir))
            y.append("explode")

    return X, y


def main():
    X, y = build_dataset()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    pipeline = Pipeline([
        ("features", RecipeMatchTransformer()),
        ("clf", RandomForestClassifier(n_estimators=200, random_state=42)),
    ])

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    print(classification_report(y_test, y_pred))

    pipeline.fit(X, y)

    bundle = {
        "pipeline": pipeline,
        "spells": SPELLS,
        "metadata": {
            "steps": [name for name, _ in pipeline.steps],
            "built_at": datetime.now(timezone.utc).isoformat(),
            "sklearn_version": sklearn.__version__,
        },
    }

    joblib.dump(bundle, "pipeline.joblib")
    print("Saved pipeline.joblib")


if __name__ == "__main__":
    main()
