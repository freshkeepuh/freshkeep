import { Recipe } from '@/components/Recipe';

export type Filters = {
  searchQuery: string;
  ingredients: string[];
  maxMinutes: number | null;
  difficulty: Recipe['difficulty'];
  diet: Recipe['diet'];
};

/**
 * Filters an array of recipes based on the provided filtering criteria.
 * @param recipes - The array of recipes to be filtered
 * @param filters - The filtering criteria
 * @returns The filtered array of recipes
 */
export const filterRecipes = (recipes: Recipe[], filters: Filters) => {
  const { searchQuery, ingredients, maxMinutes, difficulty, diet } = filters;
  const q = searchQuery.trim().toLowerCase();

  // Filter logic
  return recipes.filter((r) => {
    const matchesQuery = q.length === 0
    || r.title.toLowerCase().includes(q)
    || r.ingredients.some((ing) => ing.toLowerCase().includes(q));

    // Check cook time, difficulty & diet dropdowns
    const matchesTime = maxMinutes == null || r.cookTime <= maxMinutes;
    const matchesDifficulty = difficulty === 'Any' || r.difficulty === difficulty;
    const matchesDiet = diet === 'Any' || r.diet === diet;

    // Check ingredients
    const recipeIngs = Array.isArray(r.ingredients)
      ? r.ingredients.map((i) => String(i).toLowerCase())
      : [];

    const matchesIngredients = ingredients.length === 0
    || ingredients.every((chip) => {
      const c = chip.trim().toLowerCase();
      if (!c) return true;
      return recipeIngs.some((ing) => ing.includes(c));
    });

    return (
      matchesQuery
      && matchesTime
      && matchesDifficulty
      && matchesDiet
      && matchesIngredients
    );
  });
};
