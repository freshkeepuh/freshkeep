// This file exists to avoid circular dependencies between recipe-related types and functions.
// (e.g., filterRecipes.ts and components/Recipe.tsx)

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  cookTime: number;
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Any';
  diet: 'Vegan' | 'Vegetarian' | 'Pescetarian' | 'Any';
  ingredients: string[];
  image?: string;
}
