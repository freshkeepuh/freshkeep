'use client';

import React, { useMemo, useState } from 'react';
import styles from './page.module.css';

// Types
interface Recipe {
  id: number;
  title: string;
  cookTime: number; // minutes
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Any';
  diet: 'Vegan' | 'Vegetarian' | 'Pescetarian' | 'Any';
  ingredients: string[];
  image?: string;
}

type MaxTimeFilter = '< 15 min' | '< 30 min' | '< 45 min' | '< 60 min' | 'Any';
type DifficultyFilter = 'Easy' | 'Normal' | 'Hard' | 'Any';
type DietFilter = 'Vegan' | 'Vegetarian' | 'Pescetarian' | 'Any';

// Emoji for labels
const getDifficultyEmoji = (d: 'Easy' | 'Normal' | 'Hard' | 'Any') => {
  switch (d) {
    case 'Easy': return '⭐️';
    case 'Normal': return '⭐️⭐️';
    case 'Hard': return '⭐️⭐️⭐️';
    default: return '🎯'; // fallback
  }
};

const getDietEmoji = (d: 'Vegan' | 'Vegetarian' | 'Pescetarian' | 'Any') => {
  switch (d) {
    case 'Vegan': return '🌱';
    case 'Vegetarian': return '🥕';
    case 'Pescetarian': return '🐟';
    case 'Any': return '🍽️';
    default: return '🍽️';
  }
};

export default function RecipesPage() {
  // Form states
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [committedQuery, setCommittedQuery] = useState('');
  const [maxTime, setMaxTime] = useState<MaxTimeFilter>('Any');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('Any');
  const [diet, setDiet] = useState<DietFilter>('Any');

  // Mock data
  const mockRecipes: Recipe[] = [
    {
      id: 1,
      title: 'Recipe #1',
      cookTime: 30,
      difficulty: 'Easy',
      diet: 'Vegan',
      ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3', 'ingredient 4'],
    },
    {
      id: 2,
      title: 'Recipe #2',
      cookTime: 15,
      difficulty: 'Easy',
      diet: 'Vegetarian',
      ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3'],
    },
    {
      id: 3,
      title: 'Recipe #3',
      cookTime: 50,
      difficulty: 'Hard',
      diet: 'Pescetarian',
      ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3', 'ingredient 4', 'ingredient 5', 'ingredient 6'],
    },
    {
      id: 4,
      title: 'Recipe #4',
      cookTime: 10,
      difficulty: 'Easy',
      diet: 'Any',
      ingredients: ['ingredient 1', 'ingredient 2'],
    },
    {
      id: 5,
      title: 'Recipe #5',
      cookTime: 30,
      difficulty: 'Normal',
      diet: 'Vegan',
      ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3', 'ingredient 4', 'ingredient 5'],
    },
    {
      id: 6,
      title: 'Recipe #6',
      cookTime: 20,
      difficulty: 'Easy',
      diet: 'Vegetarian',
      ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3'],
    },
  ];

  // Parse time label to minutes
  const parseMaxTime = (value: MaxTimeFilter): number | null => {
    if (value === 'Any') return null;
    const match = value.match(/<\s*(\d+)\s*min/i);
    return match ? Number(match[1]) : null;
  };

  // Ingredient handlers
  const handleAddIngredient = () => {
    const v = currentIngredient.trim();
    if (!v) return;
    if (!ingredients.some((i) => i.toLowerCase() === v.toLowerCase())) {
      setIngredients((prev) => [...prev, v]);
    }
    setCurrentIngredient('');
  };

  const handleRemoveIngredient = (ing: string) => {
    setIngredients((prev) => prev.filter((i) => i !== ing));
  };

  const handleIngredientKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddIngredient();
  };

  // Search handlers
  const handleSearch = () => {
    setCommittedQuery(searchQuery.trim());
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  // filtering logic
  const filteredRecipes = useMemo(() => {
    const maxMinutes = parseMaxTime(maxTime);
    const q = committedQuery.toLowerCase();

    return mockRecipes.filter((r) => {
      const matchesQuery = q.length === 0
        || r.title.toLowerCase().includes(q)
        || r.ingredients.some((ing) => ing.toLowerCase().includes(q));

      const matchesTime = maxMinutes == null || r.cookTime <= maxMinutes;
      const matchesDifficulty = difficulty === 'Any' || r.difficulty === difficulty;
      const matchesDiet = diet === 'Any' || r.diet === diet;

      // require all chosen ingredients to exist in the recipe
      const matchesIngredients = ingredients.length === 0
        || ingredients.every((ing) => r.ingredients.map((x) => x.toLowerCase()).includes(ing.toLowerCase()));
      return matchesQuery && matchesTime && matchesDifficulty && matchesDiet && matchesIngredients;
    });
  }, [mockRecipes, committedQuery, maxTime, difficulty, diet, ingredients]);

  return (
    <div className={styles.rpPage}>
      <main className={styles.rpMain}>
        <div className={styles.rpMainInner}>
          {/* Filter/Search card */}
          <section className={styles.rpCard}>
            {/* Ingredients input */}
            <div className={styles.rpBlock}>
              <h2 className={styles.rpH3}>Your Ingredients</h2>
              <div className={styles.rpRow}>
                <div className={styles.rpSearchWrap}>
                  <input
                    type="text"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    onKeyDown={handleIngredientKeyDown}
                    placeholder="example: tomato, beef"
                    className={styles.rpInputSearch}
                  />
                  <span className={styles.rpSearchIcon}>🍅</span>
                </div>
                <button type="button" onClick={handleAddIngredient} className={styles.rpBtnDark}>
                  Add
                </button>
              </div>

              {/* Ingredient chips */}
              {ingredients.length > 0 && (
                <div className={styles.rpChips}>
                  {ingredients.map((ing) => (
                    <span key={ing.toLowerCase()} className={styles.rpChip}>
                      {ing}
                      <button
                        type="button"
                        aria-label={`Remove ${ing}`}
                        className={styles.rpChipX}
                        onClick={() => handleRemoveIngredient(ing)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Text Search */}
            <div className={styles.rpBlock}>
              <h3 className={styles.rpH3}>Search Recipes</h3>
              <div className={styles.rpRow}>
                <div className={styles.rpSearchWrap}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="example: soup, pasta"
                    className={styles.rpInputSearch}
                  />
                  <span className={styles.rpSearchIcon}>🔍</span>
                </div>
                <button type="button" onClick={handleSearch} className={styles.rpBtnDark}>
                  Search
                </button>
              </div>
            </div>

            {/* Dropdown Filters */}
            <div className={styles.rpGrid3}>
              <div>
                <label className={styles.rpH4} htmlFor="maxTimeSelect">
                  <span>⏳</span>
                  {' '}
                  <span>Max Time</span>
                </label>
                <select
                  id="maxTimeSelect"
                  value={maxTime}
                  onChange={(e) => setMaxTime(e.target.value as MaxTimeFilter)}
                  className={styles.rpSelect}
                >
                  <option>{'< 15 min'}</option>
                  <option>{'< 30 min'}</option>
                  <option>{'< 45 min'}</option>
                  <option>{'< 60 min'}</option>
                  <option>Any</option>
                </select>
              </div>

              <div>
                <label className={styles.rpH4} htmlFor="difficultySelect">
                  <span>🎯</span>
                  {' '}
                  <span>Difficulty</span>
                </label>
                <select
                  id="difficultySelect"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyFilter)}
                  className={styles.rpSelect}
                >
                  <option>Any</option>
                  <option>Easy</option>
                  <option>Normal</option>
                  <option>Hard</option>
                </select>
              </div>

              <div>
                <label className={styles.rpH4} htmlFor="dietSelect">
                  <span>🍽️</span>
                  {' '}
                  <span>Diet</span>
                </label>
                <select
                  id="dietSelect"
                  value={diet}
                  onChange={(e) => setDiet(e.target.value as DietFilter)}
                  className={styles.rpSelect}
                >
                  <option>Any</option>
                  <option>Vegan</option>
                  <option>Vegetarian</option>
                  <option>Pescetarian</option>
                </select>
              </div>
            </div>
          </section>

          {/* Results count */}
          <p className={styles.rpCount}>
            Showing
            {' '}
            <span className={styles.rpCountStrong}>{filteredRecipes.length}</span>
            {' '}
            results
          </p>

          {/* Recipe cards grid */}
          <section className={styles.rpCards}>
            {filteredRecipes.map((r) => (
              <article key={r.id} className={styles.rpCardItem}>
                <div className={styles.rpCardMedia} />
                <div className={styles.rpCardBody}>
                  <div className={styles.rpCardTitle}>
                    <span className={styles.rpH2}>👨‍🍳</span>
                    <p className={styles.rpH2}>{r.title}</p>
                  </div>

                  {/* meta line */}
                  <div className={styles.rpMeta}>
                    <div>
                      <span>⏳</span>
                      <span>
                        {r.cookTime}
                        {' '}
                        min
                      </span>
                    </div>
                    <div>
                      <span>{getDifficultyEmoji(r.difficulty)}</span>
                      <span>{r.difficulty}</span>
                    </div>
                    <div>
                      <span>{getDietEmoji(r.diet)}</span>
                      <span>{r.diet}</span>
                    </div>
                  </div>
                  {/* Ingredients text */}
                  <div className={styles.rpIngredients}>
                    <p className={styles.rpH3}>Ingredients:</p>
                    <p className={styles.rpText}>{r.ingredients.join(', ')}</p>
                  </div>

                  {/* action button */}
                  <button type="button" className={styles.rpBtnLight}>View Recipe</button>
                </div>
              </article>
            ))}

            {/* empty state */}
            {filteredRecipes.length === 0 && (
              <div className={styles.rpEmpty}>
                <p>No recipes match your filters.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
