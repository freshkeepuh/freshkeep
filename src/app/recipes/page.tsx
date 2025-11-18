import { prisma } from '@/lib/prisma';
import RecipesPage from '@/components/Recipe';
import type { Recipe as UiRecipe } from '@/components/Recipe';
import type { RecipeDifficulty, RecipeDiet } from '@prisma/client';

// Converts database difficulty to UI label
const toUiDifficulty = (d: RecipeDifficulty): UiRecipe['difficulty'] => {
  switch (d) {
    case 'EASY': return 'Easy';
    case 'NORMAL': return 'Normal';
    case 'HARD': return 'Hard';
    default: return 'Any';
  }
};

// Converts database diet to UI label
const toUiDiet = (d: RecipeDiet): UiRecipe['diet'] => {
  switch (d) {
    case 'VEGAN': return 'Vegan';
    case 'VEGETARIAN': return 'Vegetarian';
    case 'PESCETARIAN': return 'Pescetarian';
    default: return 'Any';
  }
};

// Small helper to normalize strings for matching
const norm = (s: string) => s.toLowerCase().trim();

// Basic match between ingredient text and product name
const ingredientMatchesProduct = (ingredient: string, productName: string) => {
  const ing = norm(ingredient);
  const prod = norm(productName);
  return ing.includes(prod) || prod.includes(ing);
};

// Loads recipes from the database and sends them to the client component
export default async function Page() {
  // Load all recipes
  const rows = await prisma.recipe.findMany({ orderBy: { createdAt: 'asc' } });

  // Load all products that are in stock
  const instances = await prisma.productInstance.findMany({
    where: { quantity: { gt: 0 } },
    include: { product: true },
  });

  // Get product names we have
  const haveNames = instances
    .map((inst) => inst.product?.name)
    .filter((name): name is string => !!name);

  // Map recipes -> UI with counts
  const initialRecipes: UiRecipe[] = rows.map((r) => {
    const ingredients = (r.ingredients as string[]) ?? [];
    const totalIngredients = ingredients.length;

    const haveCount = ingredients.filter((ing) => haveNames.some(
      (prodName) => ingredientMatchesProduct(ing, prodName),
    )).length;

    const missingCount = Math.max(totalIngredients - haveCount, 0);

    return {
      id: r.id,
      slug: r.slug!,
      title: r.title,
      cookTime: r.cookTime,
      difficulty: toUiDifficulty(r.difficulty),
      diet: toUiDiet(r.diet),
      ingredients,
      image: r.image ?? undefined,
      haveCount,
      missingCount,
      totalIngredients,
    };
  });

  // Returns the client-side Recipe page with initial data
  return <RecipesPage initialRecipes={initialRecipes} />;
}
