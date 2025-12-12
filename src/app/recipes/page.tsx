import prisma from '@/lib/prisma';
import RecipesPage from '@/components/Recipe';
import type { Recipe as UiRecipe } from '@/components/Recipe';
import {
  splitIngredientsByStock,
  normalizeIngredients,
} from '@/lib/ingredientMatch';
import { DIFFICULTY_META, DIET_META } from '@/lib/recipeUI';

export default async function Page(props: any) {
  // Normalize searchParams
  const rawSearchParams = await Promise.resolve(props?.searchParams ?? {});
  const selectedLocationId =
    typeof rawSearchParams.locationId === 'string' &&
    rawSearchParams.locationId.length > 0
      ? rawSearchParams.locationId
      : '';

  // Load recipes, in-stock product instances, and locations
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

  // Check Which ingredient names we have
  const haveNames = instances
    .map((inst) => inst.product?.name)
    .filter((name): name is string => !!name);

  // Build UI recipes
  const initialRecipes: UiRecipe[] = rows.map((r) => {
    const ingredients = normalizeIngredients(r.ingredients);

    const { haveCount, missingCount, totalIngredients } =
      splitIngredientsByStock(ingredients, haveNames);

    // Use meta maps from recipeUI
    const difficultyMeta = DIFFICULTY_META[r.difficulty] ?? DIFFICULTY_META.ANY;
    const dietMeta = DIET_META[r.diet] ?? DIET_META.ANY;

    return {
      id: r.id,
      slug: r.slug!,
      title: r.title,
      cookTime: r.cookTime,
      difficulty: difficultyMeta.label,
      diet: dietMeta.label,
      ingredients,
      image: r.image ?? undefined,
      haveCount,
      missingCount,
      totalIngredients,
    };
  });

  const locationOptions = locations.map((loc) => ({
    id: loc.id,
    name: loc.name,
  }));

  return (
    <RecipesPage
      initialRecipes={initialRecipes}
      locations={locationOptions}
      selectedLocationId={selectedLocationId}
    />
  );
}
