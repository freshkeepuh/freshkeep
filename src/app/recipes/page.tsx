import { prisma } from '@/lib/prisma';
import RecipesPage from '@/components/Recipe';
import type { Recipe as UiRecipe } from '@/components/Recipe';
import type { RecipeDifficulty, RecipeDiet } from '@prisma/client';
import { splitIngredientsByStock } from '@/lib/ingredientMatch';

/**
 * Maps Prisma RecipeDifficulty enum to UI difficulty label.
 */
const toUiDifficulty = (d: RecipeDifficulty): UiRecipe['difficulty'] => {
  switch (d) {
    case 'EASY':
      return 'Easy';
    case 'NORMAL':
      return 'Normal';
    case 'HARD':
      return 'Hard';
    default:
      return 'Any';
  }
};

/**
 * Maps Prisma RecipeDiet enum to UI diet label.
 */
const toUiDiet = (d: RecipeDiet): UiRecipe['diet'] => {
  switch (d) {
    case 'VEGAN':
      return 'Vegan';
    case 'VEGETARIAN':
      return 'Vegetarian';
    case 'PESCETARIAN':
      return 'Pescetarian';
    default:
      return 'Any';
  }
};

/**
 * Server component for /recipes.
 * Loads recipes, stock, and locations, then passes data to the client page.
 */
export default async function Page(props: any) {
  // Normalize searchParams (Next may give it as a Promise)
  const rawSearchParams = await Promise.resolve(props?.searchParams ?? {});
  const selectedLocationId =
    typeof rawSearchParams.locationId === 'string' &&
    rawSearchParams.locationId.length > 0
      ? rawSearchParams.locationId
      : '';

  // Load recipes, in-stock product instances and locations
  const [rows, instances, locations] = await Promise.all([
    prisma.recipe.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.productInstance.findMany({
      where: {
        quantity: { gt: 0 },
        ...(selectedLocationId ? { locId: selectedLocationId } : {}),
      },
      include: { product: true },
    }),
    prisma.location.findMany({ orderBy: { name: 'asc' } }),
  ]);

  // Collect product names that are in stock at the selected location
  const haveNames = instances
    .map((inst) => inst.product?.name)
    .filter((name): name is string => !!name);

  // Build recipe objects with have/missing counts
  const initialRecipes: UiRecipe[] = rows.map((r) => {
    const ingredients = (r.ingredients as string[]) ?? [];

    const { haveCount, missingCount, totalIngredients } =
      splitIngredientsByStock(ingredients, haveNames);

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

  // Shape locations for the dropdown
  const locationOptions = locations.map((loc) => ({
    id: loc.id,
    name: loc.name,
  }));

  // Render client-side recipes page with initial data
  return (
    <RecipesPage
      initialRecipes={initialRecipes}
      locations={locationOptions}
      selectedLocationId={selectedLocationId}
    />
  );
}
