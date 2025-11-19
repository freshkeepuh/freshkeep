import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowBigLeft } from 'lucide-react';
import Link from 'next/link';
import styles from '@/app/recipes/page.module.css';
import slugify from '@/lib/slug';
import FavoriteHeart from '@/components/FavoriteHeart';
import { splitIngredientsByStock } from '@/lib/ingredientMatch';

export const dynamic = 'force-dynamic';

export default async function RecipeViewPage(props: any) {
  const { slug: routeSlug } = await Promise.resolve(props?.params);
  const rawSearchParams = await Promise.resolve(props?.searchParams ?? {});
  const selectedLocationId = typeof rawSearchParams.locationId === 'string' && rawSearchParams.locationId.length > 0
    ? rawSearchParams.locationId
    : '';

  // Normal lookup by slug
  let recipe = await prisma.recipe.findUnique({
    where: { slug: routeSlug },
  });

  // Fallback: if slug is missing in DB, match by slugified title
  if (!recipe) {
    const rows = await prisma.recipe.findMany({
      select: {
        id: true,
        title: true,
        cookTime: true,
        difficulty: true,
        diet: true,
        ingredients: true,
        instructions: true,
        image: true,
      },
    });
    const match = rows.find((r) => slugify(r.title) === routeSlug);
    if (match) recipe = match as any;
  }

  if (!recipe) notFound();

  const ingredients: string[] = Array.isArray(recipe.ingredients)
    ? (recipe.ingredients as any)
    : [];
  const instructions: string[] = Array.isArray(recipe.instructions)
    ? (recipe.instructions as any)
    : [];

  // Load all locations for the dropdown (no user filter for now)
  const locations = await prisma.location.findMany({
    orderBy: { name: 'asc' },
  });

  // Load items we have
  const instances = await prisma.productInstance.findMany({
    where: {
      quantity: { gt: 0 },
      ...(selectedLocationId ? { locId: selectedLocationId } : {}),
    },
    include: { product: true },
  });

  const haveNames = instances
    .map((inst) => inst.product?.name)
    .filter((name): name is string => !!name);

  const { inStock, missing } = splitIngredientsByStock(ingredients, haveNames);

  const difficultyMeta = {
    EASY: { label: 'Easy', icon: '⭐️' },
    NORMAL: { label: 'Normal', icon: '⭐️⭐️' },
    HARD: { label: 'Hard', icon: '⭐️⭐️⭐️' },
    ANY: { label: 'Any', icon: '🎯' },
  } as const;

  const dietMeta = {
    ANY: { label: 'Any', icon: '🍽️' },
    VEGAN: { label: 'Vegan', icon: '🌱' },
    VEGETARIAN: { label: 'Vegetarian', icon: '🥕' },
    PESCETARIAN: { label: 'Pescetarian', icon: '🐟' },
  } as const;

  const { label: difficultyLabel,
    icon: difficultyIcon } = difficultyMeta[recipe.difficulty as keyof typeof difficultyMeta] ?? difficultyMeta.ANY;

  const { label: dietLabel, icon: dietIcon } = dietMeta[recipe.diet as keyof typeof dietMeta] ?? dietMeta.ANY;

  return (
    <main className={styles.rpPage} style={{ background: 'rgb(236, 255, 239)' }}>
      <div className={styles.rpMain}>
        <div className={styles.rpMainInner}>

          {/* Back Button */}
          <Link href="/recipes" className={styles.rpBackBtn}>
            <span className={styles.rpBackIcon} aria-hidden>
              <ArrowBigLeft size={18} />
            </span>
            <span>Back to Recipes</span>
          </Link>

          {/* Two column layout */}
          <div className={styles.rpRow} style={{ alignItems: 'flex-start', gap: 24 }}>
            {/* Left Column: Image + Ingredients */}
            <div style={{ flex: '1 1 48%', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Image */}
              <div className={styles.rpViewImage}>
                <div className={styles.rpViewImageWrap}>
                  {recipe.image ? (
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  ) : (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'grid',
                        placeItems: 'center',
                        background: '#f3f4f6',
                      }}
                    >
                      No image
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredients Card */}
              <div className={styles.rpCard}>
                <div className={styles.rpRow} style={{ alignItems: 'center', marginBottom: 16, gap: 8 }}>
                  <span style={{ fontSize: 25 }}>🥘</span>
                  <h2 className={styles.rpH1}>Ingredients</h2>
                </div>

                {/* Location selector */}
                {locations.length > 0 && (
                <form
                  method="get"
                  style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}
                >
                  <div className={styles.rpH4} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Location</span>
                    <select
                      name="locationId"
                      defaultValue={selectedLocationId}
                      className={styles.rpSelect}
                      aria-label="Location"
                    >
                      <option value="">All locations</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className={styles.rpBtnDark}>
                    Apply
                  </button>
                </form>
                )}

                {/* In Stock section */}
                <div className={styles.rpBlock}>
                  <h3 className={styles.rpH2} style={{ color: '#16a34a' }}>In Stock:</h3>
                  <div className={styles.rpIngredientsGrid}>
                    {inStock.map((item, idx) => {
                      const id = `have-${item.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${idx}`;
                      return (
                        <div key={id} className={styles.rpIngredientItem}>
                          <input
                            id={id}
                            type="checkbox"
                            className={styles.rpCheckbox}
                            name="ingredients-have"
                            value={item}
                          />
                          <label htmlFor={id} className={styles.rpMedium}>
                            {item}
                          </label>
                        </div>
                      );
                    })}
                    {inStock.length === 0 && (
                      <p className={styles.rpText}>No ingredients in stock at this location.</p>
                    )}
                  </div>
                </div>

                {/* Missing section */}
                <div className={styles.rpBlock}>
                  <h3 className={styles.rpH2} style={{ color: '#dc2626' }}>Missing:</h3>
                  <div className={styles.rpIngredientsGrid}>
                    {missing.map((item, idx) => {
                      const id = `miss-${item.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${idx}`;
                      return (
                        <div key={id} className={styles.rpIngredientItem}>
                          <input
                            id={id}
                            type="checkbox"
                            className={styles.rpCheckbox}
                            name="ingredients-miss"
                            value={item}
                          />
                          <label htmlFor={id} className={styles.rpMedium}>
                            {item}
                          </label>
                        </div>
                      );
                    })}
                    {missing.length === 0 && (
                      <p className={styles.rpText}>Nothing missing for this location 🎉</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.rpRow}>
                  <button className={styles.rpBtnDark} type="button" style={{ flex: 1 }}>
                    Add to Shopping List
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Title + Stats + Instructions */}
            <div style={{ flex: '1 1 48%', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Title Card */}
              <div className={styles.rpCard}>
                <div
                  className={styles.rpRow}
                  style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}
                >
                  <h1 className={styles.rpViewTitle}>{recipe.title}</h1>

                  {/* Favorite toggle */}
                  <FavoriteHeart recipeId={recipe.id} variant="ondetail" />
                </div>
                {/* Stats (time, difficulty, and diet) */}
                <div className={styles.rpRow}>
                  <div className={styles.rpStatPill}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>⏳</div>
                    <div className={styles.rpStatLabel}>TIME</div>
                    <div className={styles.rpStatValue}>
                      {recipe.cookTime}
                      {' '}
                      min
                    </div>
                  </div>
                  <div className={styles.rpStatPill}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{difficultyIcon}</div>
                    <div className={styles.rpStatLabel}>DIFFICULTY</div>
                    <div className={styles.rpStatValue}>{difficultyLabel}</div>
                  </div>
                  <div className={styles.rpStatPill}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{dietIcon}</div>
                    <div className={styles.rpStatLabel}>DIET</div>
                    <div className={styles.rpStatValue}>{dietLabel}</div>
                  </div>
                </div>
              </div>

              {/* Instructions Card */}
              <div className={styles.rpCard} style={{ flex: 1 }}>
                <div className={styles.rpRow} style={{ alignItems: 'center', marginBottom: 16, gap: 8 }}>
                  <span style={{ fontSize: 25 }}>📋</span>
                  <h2 className={styles.rpH1}>Instructions</h2>
                </div>

                {/* Instruction Steps */}
                <ol className={styles.rpSteps}>
                  {(() => {
                    const seen = new Map<string, number>();
                    return instructions.map((step, idx) => {
                      const slug = step.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      const n = (seen.get(slug) ?? 0) + 1;
                      seen.set(slug, n);
                      const key = `step-${slug}-${n}`;

                      return (
                        <li key={key} className={styles.rpStep}>
                          <div className={styles.rpStepNumber}>{idx + 1}</div>
                          <p className={styles.rpMedium} style={{ margin: 0 }}>{step}</p>
                        </li>
                      );
                    });
                  })()}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
