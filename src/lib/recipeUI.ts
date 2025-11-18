// src/lib/recipeUI.ts

// Difficulty labels with emojis
export const DIFFICULTY_OPTIONS = [
  { value: 'ANY', label: '🎯 Any' },
  { value: 'EASY', label: '⭐️ Easy' },
  { value: 'NORMAL', label: '⭐️⭐️ Normal' },
  { value: 'HARD', label: '⭐️⭐️⭐️ Hard' },
] as const;

// Diet labels with emojis
export const DIET_OPTIONS = [
  { value: 'ANY', label: '🍽️ Any' },
  { value: 'VEGAN', label: '🌱 Vegan' },
  { value: 'VEGETARIAN', label: '🥕 Vegetarian' },
  { value: 'PESCETARIAN', label: '🐟 Pescetarian' },
] as const;

// Lookup maps for recipe card display
export const DIFFICULTY_EMOJI: Record<string, string> = {
  Easy: '⭐️',
  Normal: '⭐️⭐️',
  Hard: '⭐️⭐️⭐️',
  Any: '🎯',
};

export const DIET_EMOJI: Record<string, string> = {
  Vegan: '🌱',
  Vegetarian: '🥕',
  Pescetarian: '🐟',
  Any: '🍽️',
};
