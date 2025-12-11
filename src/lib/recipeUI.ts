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

// Lookup maps for recipe card display (keyed by UI labels)
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

// Meta maps keyed by enum values from the DB
export const DIFFICULTY_META = {
  ANY: { label: 'Any', icon: '🎯' },
  EASY: { label: 'Easy', icon: '⭐️' },
  NORMAL: { label: 'Normal', icon: '⭐️⭐️' },
  HARD: { label: 'Hard', icon: '⭐️⭐️⭐️' },
} as const;

export const DIET_META = {
  ANY: { label: 'Any', icon: '🍽️' },
  VEGAN: { label: 'Vegan', icon: '🌱' },
  VEGETARIAN: { label: 'Vegetarian', icon: '🥕' },
  PESCETARIAN: { label: 'Pescetarian', icon: '🐟' },
} as const;

// Create unique, stable keys for instruction steps
export function buildInstructionList(steps: string[]) {
  const seen = new Map<string, number>();

  return steps.map((step, idx) => {
    const slug = step
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const count = (seen.get(slug) ?? 0) + 1;
    seen.set(slug, count);

    return {
      key: `step-${slug}-${count}`,
      step,
      index: idx + 1,
    };
  });
}
