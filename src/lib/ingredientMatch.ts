/**
 * Normalize a string for fuzzy matching.
 * Lowercases and trims extra spaces.
 */
export const norm = (s: string) => s.toLowerCase().trim();

/**
 * Returns true if an ingredient name loosely matches a product name.
 */
export const ingredientMatchesProduct = (ingredient: string, productName: string) => {
  const ing = norm(ingredient);
  const prod = norm(productName);
  return ing.includes(prod) || prod.includes(ing);
};

/**
 * Given recipe ingredients and product names in stock,
 * split them into inStock and missing, plus simple counts.
 */
export function splitIngredientsByStock(
  ingredients: string[] | null | undefined,
  productNames: string[],
) {
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];

  // Ingredients we have in stock
  const inStock = safeIngredients.filter(
    (ing) => productNames.some((prodName) => ingredientMatchesProduct(ing, prodName)),
  );

  // Ingredients we are missing
  const missing = safeIngredients.filter(
    (ing) => !productNames.some((prodName) => ingredientMatchesProduct(ing, prodName)),
  );

  return {
    inStock,
    missing,
    haveCount: inStock.length,
    missingCount: missing.length,
    totalIngredients: safeIngredients.length,
  };
}
