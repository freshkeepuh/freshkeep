/**
 * CRUD Actions for the Recipe Model.
 */

'use server';

import { RecipeDiet, RecipeDifficulty } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  recipeSelect,
} from './dbActionTypes';

/**
 * Create a new recipe.
 * @param data The recipe data to create.
 * @returns The created recipe.
 */
export async function createRecipe(data: {
  title: string,
  slug: string | null,
  cookTime: number,
  difficulty: string,
  diet: string,
  ingredients: any,
  instructions: any | null,
  image: string | null,
}) {
  const newRecipe = await prisma.recipe.create({
    data: {
      title: data.title,
      slug: data.slug,
      cookTime: data.cookTime,
      difficulty: data.difficulty as RecipeDifficulty,
      diet: data.diet as RecipeDiet,
      ingredients: data.ingredients,
      instructions: data.instructions,
      image: data.image,
    },
    select: recipeSelect,
  });
  return newRecipe;
}

/**
 * Read all recipes.
 * @returns All recipes.
 */
export async function readRecipes() {
  const recipes = await prisma.recipe.findMany(
    {
      select: recipeSelect,
      orderBy: { title: 'asc' },
    },
  );
  return recipes;
}

/**
 * Read a recipe by ID.
 * @param id The ID of the recipe to read.
 * @returns The recipe if found, otherwise null.
 */
export async function readRecipe(id: string | null | undefined) {
  if (!id) return null;
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: recipeSelect,
  });
  return recipe;
}

/**
 * Update a recipe by ID.
 * @param id The ID of the recipe to update.
 * @param data The new data for the recipe.
 * @returns The updated recipe if found, otherwise null.
 */
export async function updateRecipe(id: string, data: {
  title: string,
  slug: string | null,
  cookTime: number,
  difficulty: string,
  diet: string,
  ingredients: any,
  instructions: any | null,
  image: string | null,
}) {
  const updatedRecipe = await prisma.recipe.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      cookTime: data.cookTime,
      difficulty: data.difficulty as RecipeDifficulty,
      diet: data.diet as RecipeDiet,
      ingredients: data.ingredients,
      instructions: data.instructions,
      image: data.image,
    },
    select: recipeSelect,
  });
  return updatedRecipe;
}

/**
 * Delete a recipe by ID.
 * @param id The ID of the recipe to delete.
 * @returns The deleted recipe if found, otherwise null.
 */
export async function deleteRecipe(id: string) {
  const deletedRecipe = await prisma.recipe.delete({
    where: { id },
    select: recipeSelect,
  });
  return deletedRecipe;
}
