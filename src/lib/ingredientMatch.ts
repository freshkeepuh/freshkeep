/**
 * Types we might see as an "ingredient" value.
 * Supports both old (string) and new ({ name }) shapes.
 */
export type IngredientLike =
  | string
  | { name?: string | null }
  | null
  | undefined;

/**
 * Safely get the display name for an ingredient.
 */
const getIngredientName = (ing: IngredientLike): string => {
  if (typeof ing === 'string') return ing;
  if (ing && typeof ing.name === 'string') return ing.name;
  return '';
};

/**
 * Normalize a string for fuzzy matching.
 * Lowercases and trims extra spaces.
 */
export const norm = (s: string | null | undefined) =>
  (s ?? '').toLowerCase().trim();

/**
 * Returns true if an ingredient name loosely matches a product name.
 */
export const ingredientMatchesProduct = (
  ingredient: IngredientLike,
  productName: string,
) => {
  const ing = norm(getIngredientName(ingredient));
  const prod = norm(productName);

  if (!ing || !prod) return false;

  return ing.includes(prod) || prod.includes(ing);
};

/**
 * Given recipe ingredients and product names in stock,
 * split them into inStock and missing, plus simple counts.
 *
 * ingredients can be string[] (old) or { name: string }[] (new).
 */
export function splitIngredientsByStock(
  ingredients: IngredientLike[] | null | undefined,
  productNames: string[],
) {
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];

  // Pre-normalize product names
  const normalizedProducts = productNames.map(norm);

  // Ingredients we have in stock
  const inStock = safeIngredients.filter((ing) => {
    const normalizedIng = norm(getIngredientName(ing));
    if (!normalizedIng) return false;

    return normalizedProducts.some(
      (prod) => normalizedIng.includes(prod) || prod.includes(normalizedIng),
    );
  });

  // Ingredients we are missing
  const missing = safeIngredients.filter((ing) => {
    const normalizedIng = norm(getIngredientName(ing));
    if (!normalizedIng) return true;

    return !normalizedProducts.some(
      (prod) => normalizedIng.includes(prod) || prod.includes(normalizedIng),
    );
  });

  return {
    inStock,
    missing,
    haveCount: inStock.length,
    missingCount: missing.length,
    totalIngredients: safeIngredients.length,
  };
}
