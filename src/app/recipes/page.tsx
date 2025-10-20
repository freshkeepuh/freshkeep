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

// Loads recipes from the database and sends them to the client component
export default async function Page() {
  const rows = await prisma.recipe.findMany({ orderBy: { createdAt: 'asc' } });

  // Converts Prisma data to UI format
  const initialRecipes: UiRecipe[] = rows.map((r) => ({
    id: r.id,
    slug: r.slug!,
    title: r.title,
    cookTime: r.cookTime,
    difficulty: toUiDifficulty(r.difficulty),
    diet: toUiDiet(r.diet),
    ingredients: (r.ingredients as string[]) ?? [],
    image: r.image ?? undefined,
  }));

  // Returns the client-side Recipe page with initial data
  return <RecipesPage initialRecipes={initialRecipes} />;
}
