'use client';

import React, { useMemo, useState } from 'react';
import styles from '@/app/recipes/page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import slugify from '@/lib/slug';
import { filterRecipes } from '@/utils/filterRecipes';
import { Recipe } from '@/types/recipe';
import FavoriteHeart from './FavoriteHeart';

// Props passed from server component
type LocationOption = {
  id: string;
  name: string;
};

type Props = {
  initialRecipes: Recipe[];
  locations?: LocationOption[];
  selectedLocationId?: string;
};

// Filter option types
type MaxTimeFilter = '< 15 min' | '< 30 min' | '< 45 min' | '< 60 min' | 'Any';
type DifficultyFilter = Recipe['difficulty'];
type DietFilter = Recipe['diet'];

// Small helpers to show emojis for labels
const DIFFICULTY_EMOJI: Record<DifficultyFilter, string> = {
  Easy: '⭐️',
  Normal: '⭐️⭐️',
  Hard: '⭐️⭐️⭐️',
  Any: '🎯',
};

const DIET_EMOJI: Record<DietFilter, string> = {
  Vegan: '🌱',
  Vegetarian: '🥕',
  Pescetarian: '🐟',
  Any: '🍽️',
};

const getDifficultyEmoji = (d: DifficultyFilter) => DIFFICULTY_EMOJI[d];
const getDietEmoji = (d: DietFilter) => DIET_EMOJI[d];

export default function RecipesPage({
  initialRecipes,
  locations = [],
  selectedLocationId = '',
}: Props) {
  // Recipes loaded from the database
  const [recipes] = useState<Recipe[]>(initialRecipes);

  // Local UI state for filters and search
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [committedQuery, setCommittedQuery] = useState('');
  const [maxTime, setMaxTime] = useState<MaxTimeFilter>('Any');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('Any');
  const [diet, setDiet] = useState<DietFilter>('Any');

  // Parse max time filter to number of minutes
  const parseMaxTime = (value: MaxTimeFilter): number | null => {
    if (value === 'Any') return null;
    const match = value.match(/<\s*(\d+)\s*min/i);
    return match ? Number(match[1]) : null;
  };

  // Handlers for adding/removing ingredients, searching, and filtering
  const handleAddIngredient = () => {
    const v = currentIngredient.trim();
    if (!v) return;
    setIngredients(prev => (prev.some(i => i.toLowerCase() === v.toLowerCase()) ? prev : [...prev, v]));
    setCurrentIngredient('');
  };
  const handleRemoveIngredient = (ing: string) => setIngredients(prev => prev.filter(i => i !== ing));
  const handleIngredientKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddIngredient();
  };
  const handleSearch = () => setCommittedQuery(searchQuery.trim());
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Memoized filtered recipes based on current filters and search
  const filtered = useMemo(() => {
    const maxMinutes = parseMaxTime(maxTime);

    return filterRecipes(recipes, {
      searchQuery: committedQuery,
      ingredients,
      maxMinutes,
      difficulty,
      diet,
    });
  }, [recipes, committedQuery, maxTime, difficulty, diet, ingredients]);

  // Keep location in View Recipe link
  const buildRecipeHref = (slug: string) => {
    const base = `/recipes/${encodeURIComponent(slug)}`;
    if (!selectedLocationId) return base;
    const params = new URLSearchParams({ locationId: selectedLocationId });
    return `${base}?${params.toString()}`;
  };

  // Render layout, filters, and card list
  return (
    <div className={styles.rpPage}>
      <main className={styles.rpMain}>
        <div className={styles.rpMainInner}>
          {/* Location + Filters in one card */}
          <section className={styles.rpCard}>
            {/* Location selector */}
            {locations.length > 0 && (
            <div className={styles.rpBlock} style={{ marginBottom: 16 }}>
              <h2 className={styles.rpH3}>🏠 Location</h2>

              <form
                method="get"
                className={styles.rpRow}
                style={{ alignItems: 'center', gap: 8 }}
              >
                <select
                  name="locationId"
                  defaultValue={selectedLocationId}
                  className={styles.rpSelect}
                  aria-label="Location"
                  style={{ flex: 1 }}
                >
                  <option value="">All locations</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>

                <button type="submit" className={styles.rpBtnDark}>
                  Apply
                </button>
              </form>
            </div>
            )}
            {/* Ingredients input */}
            <div className={styles.rpBlock}>
              <h2 className={styles.rpH3}>🍅 Your Ingredients</h2>
              <div className={styles.rpRow}>
                <input
                  value={currentIngredient}
                  onChange={(e) => setCurrentIngredient(e.target.value)}
                  onKeyDown={handleIngredientKeyDown}
                  placeholder="example: tomato, beef"
                  className={styles.rpInputSearch}
                  style={{ paddingLeft: '1rem', flex: 1, width: 'auto' }}
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className={styles.rpBtnDark}
                >
                  Add
                </button>
              </div>
              {ingredients.length > 0 && (
              <div className={styles.rpChips}>
                {ingredients.map((ing) => (
                  <span key={ing.toLowerCase()} className={styles.rpChip}>
                    {ing}
                    <button
                      type="button"
                      className={styles.rpChipX}
                      onClick={() => handleRemoveIngredient(ing)}
                      aria-label={`Remove ${ing}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              )}
            </div>

            {/* Search input */}
            <div className={styles.rpBlock}>
              <h3 className={styles.rpH3}>🔍 Search Recipes</h3>
              <div className={styles.rpRow}>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="example: soup, pasta"
                  className={styles.rpInputSearch}
                  style={{ paddingLeft: '1rem', flex: 1, width: 'auto' }}
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className={styles.rpBtnDark}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Dropdown filters: time, difficulty & diet */}
            <div className={styles.rpGrid3}>
              <div>
                <label className={styles.rpH4} htmlFor="maxTimeSelect">
                  ⏳ Max Time
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
                </label>
              </div>
              <div>
                <label className={styles.rpH4} htmlFor="difficultySelect">
                  🎯 Difficulty
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
                </label>
              </div>
              <div>
                <label className={styles.rpH4} htmlFor="dietSelect">
                  🍽️ Diet
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
                </label>
              </div>
            </div>
          </section>

          {/* Results */}
          <p className={styles.rpCount}>
            Showing
            {' '}
            <span className={styles.rpCountStrong}>{filtered.length}</span>
            {' '}
            results
          </p>

          {/* Recipe cards */}
          <section className={styles.rpCards}>
            {filtered.map((r) => (
              <article key={r.id} className={styles.rpCardItem}>
                <div
                  className={styles.rpCardMedia}
                  style={{ position: 'relative', height: 180 }}
                >
                  {r.image ? (
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className={styles.rpNoImg}>No image</div>
                  )}
                  <FavoriteHeart recipeId={r.id} variant="oncard" />
                </div>
                <div className={styles.rpCardBody}>
                  <div className={styles.rpCardTitle}>
                    <span className={styles.rpH2}>👨‍🍳</span>
                    <p className={styles.rpH2}>{r.title}</p>
                  </div>
                  <div className={styles.rpMeta}>
                    {/* Cook time, difficulty & diet with emojis */}
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
                  {/* Ingredients list */}
                  <div className={styles.rpIngredients}>
                    <p className={styles.rpH3}>Ingredients:</p>
                    <p className={styles.rpText}>{r.ingredients.join(', ')}</p>
                  </div>

                  {/* View Recipe button */}
                  <Link
                    href={buildRecipeHref(r.slug || slugify(r.title))}
                    className={styles.rpBtnLight}
                  >
                    View Recipe
                  </Link>
                </div>

                {/* Match bar: number of ingredients we have / are missing */}
                {typeof r.haveCount === 'number'
                  && typeof r.totalIngredients === 'number' && (
                    <div className={styles.rpMatchBar}>
                      <span className={styles.rpMatchHave}>
                        Have:
                        {' '}
                        {r.haveCount}
                        /
                        {r.totalIngredients}
                      </span>
                      <span className={styles.rpMatchMissing}>
                        Missing:
                        {' '}
                        {r.totalIngredients - r.haveCount}
                        /
                        {r.totalIngredients}
                      </span>
                    </div>
                )}
              </article>
            ))}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className={styles.rpEmpty}><p>No recipes match your filters.</p></div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
