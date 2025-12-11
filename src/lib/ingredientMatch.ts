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
 * UI-friendly ingredient shape used by the recipe pages.
 */
export interface UiIngredient {
  name: string;
  quantity?: number;
  unitName?: string;
  note?: string;
}

/**
 * Safely get the display name for an ingredient.
 */
export const getIngredientName = (ing: IngredientLike): string => {
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
 * Normalize a product/ingredient name into a key for lookups.
 * Lowercase, collapse spaces, and drop a trailing "s".
 */
export const normalizeNameKey = (name: string): string => {
  const base = norm(name).replace(/\s+/g, ' ');
  // Remove a basic trailing "s" without affecting words ending in "ss"
  if (base.endsWith('s') && !base.endsWith('ss')) {
    return base.slice(0, -1);
  }
  return base;
};
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

/**
 * Normalize raw DB ingredients (string[] or object[]) into UiIngredient[].
 * Handles:
 *  - "chicken thighs"
 *  - { name, quantity, unitName, note }
 */
export const normalizeIngredients = (value: unknown): UiIngredient[] => {
  if (!Array.isArray(value)) return [];

  return value.map((ing: any) => {
    // Old shape: "chicken thighs"
    if (typeof ing === 'string') {
      return { name: ing };
    }

    // New shape: { name, quantity, unitName, note }
    if (ing && typeof ing === 'object') {
      let name: string;
      if (typeof ing.name === 'string') {
        name = ing.name;
      } else {
        name = ing.name != null ? String(ing.name) : '';
      }

      return {
        name,
        quantity:
          typeof ing.quantity === 'number' && Number.isFinite(ing.quantity)
            ? ing.quantity
            : undefined,
        unitName:
          typeof ing.unitName === 'string' && ing.unitName.length > 0
            ? ing.unitName
            : undefined,
        note:
          typeof ing.note === 'string' && ing.note.length > 0
            ? ing.note
            : undefined,
      };
    }

    // Fallback
    return { name: String(ing ?? '') };
  });
};

/**
 * Normalize instructions from JSON into string[]
 */
export const normalizeInstructions = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((step) => String(step ?? ''));
};

/**
 * Format ingredient for display like "2 cups flour" or "1 nori".
 * Treats "each"/"piece"/"ea"/"pc" as a plain count.
 */
export const formatIngredientDisplay = (
  item: UiIngredient | string,
): string => {
  if (typeof item === 'string') return item;

  const name = item?.name ?? '';
  if (!name) return '';

  const qty =
    typeof item.quantity === 'number' && Number.isFinite(item.quantity)
      ? item.quantity
      : undefined;

  const unitRaw =
    typeof item.unitName === 'string' && item.unitName.length > 0
      ? item.unitName
      : undefined;

  const COUNT_UNITS = ['each', 'ea', 'piece', 'pc', 'pieces'];

  const useUnit = unitRaw && !COUNT_UNITS.includes(unitRaw.toLowerCase());

  const parts: string[] = [];
  if (qty != null) parts.push(String(qty));
  if (useUnit) parts.push(unitRaw);
  parts.push(name);

  return parts.join(' ');
};
