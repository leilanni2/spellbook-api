import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin


def expected_stir_count(ingredients):
    # Reasonable stand-in: longer recipes need more stirring.
    return 3 + 2 * len(ingredients)


class RecipeMatchTransformer(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, attempts):
        features = []
        for selected_ingredients, correct_ingredients, str_count, expected_stir in attempts:
            selected_set = set(selected_ingredients)
            correct_set = set(correct_ingredients)

            overlap_count = len(selected_set & correct_set)
            missing_count = len(correct_set - selected_set)
            extra_count = len(selected_set - correct_set)
            stir_deviation = abs(str_count - expected_stir)

            features.append([overlap_count, missing_count, extra_count, stir_deviation])

        return np.array(features)
