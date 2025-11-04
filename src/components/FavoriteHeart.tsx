'use client';

import React, { useEffect, useState } from 'react';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import styles from '@/app/recipes/page.module.css';

type Props = {
  recipeId: string;
  variant?: 'oncard' | 'ondetail';
};

/**
 * Returns true if this recipe is favorited by the current user.
 */
async function fetchIsFavorite(recipeId: string) {
  const res = await fetch(`/api/recipes/${recipeId}/favorite`, { method: 'GET' });
  if (!res.ok) return false;
  const data = await res.json();
  return Boolean(data.favorite);
}

export default function FavoriteHeart({ recipeId, variant = 'oncard' }: Props) {
  // Render only after initial state is fetched
  const [ready, setReady] = useState(false);
  // Current favorite state
  const [isFavorite, setIsFavorite] = useState(false);

  // Load initial state whenever the recipeId changes
  useEffect(() => {
    fetchIsFavorite(recipeId).then(setIsFavorite).finally(() => setReady(true));
  }, [recipeId]);

  // Toggle with optimistic UI; revert if the request fails
  const toggle = async () => {
    setIsFavorite((v) => !v);
    const method = isFavorite ? 'DELETE' : 'POST';
    const res = await fetch(`/api/recipes/${recipeId}/favorite`, { method });
    if (!res.ok) {
      setIsFavorite((v) => !v);
    }
  };

  if (!ready) return null;

  const Icon = isFavorite ? HeartFill : Heart;
  const tip = isFavorite ? 'Unfavorite' : 'Favorite';

  // Favorites on recipe detail page
  if (variant === 'ondetail') {
    return (
      <button
        type="button"
        className={`${styles.rpFavBtn} ${styles.rpFavOnDetail}`}
        data-tip={tip}
        aria-pressed={isFavorite}
        aria-label={tip}
        onClick={toggle}
      >
        <Icon className={styles.rpFavIcon} />
      </button>
    );
  }

  // Favorites on recipe card/list
  return (
    <button
      type="button"
      className={`${styles.rpFavBtn} ${styles.rpFavOnCard}`}
      aria-pressed={isFavorite}
      aria-label={tip}
      onClick={toggle}
    >
      <Icon className={styles.rpFavIcon} />
    </button>
  );
}
