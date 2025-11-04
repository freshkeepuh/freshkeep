'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import styles from '@/app/recipes/page.module.css';

type Props = {
  recipeId: string;
  variant?: 'badge' | 'inline';
  withLabel?: boolean;
};

const LS_KEY = 'fav:recipes';

export default function FavoriteHeart({ recipeId, variant = 'badge', withLabel = false }: Props) {
  const [ready, setReady] = useState(false);
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setIds(new Set(JSON.parse(raw)));
    } catch (e) {
      console.warn('Favorites: failed to read localStorage', e);
    }
    setReady(true);
  }, []);

  const isFavorite = useMemo(() => ids.has(recipeId), [ids, recipeId]);

  const toggle = () => {
    const next = new Set(ids);
    if (next.has(recipeId)) {
      next.delete(recipeId);
    } else {
      next.add(recipeId);
    }
    setIds(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify([...next]));
    } catch (e) {
      console.warn('Favorites: failed to write localStorage', e);
    }
  };

  if (!ready) return null;

  const Icon = isFavorite ? HeartFill : Heart;
  const iconClass = isFavorite ? styles.rpFavIconActive : styles.rpFavIconInactive;

  if (variant === 'inline') {
    return (
      <button
        type="button"
        className={styles.rpFavInlineBtn}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        onClick={toggle}
      >
        <Icon className={`${styles.rpFavIcon} ${iconClass}`} size={18} />
        {withLabel && (
          <span className={styles.rpActionLabel}>
            {isFavorite ? 'Favorited' : 'Favorite'}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={styles.rpFavBtn}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Favorited — click to remove' : 'Favorite — click to add'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation?.();
        toggle();
      }}
    >
      <Icon className={styles.rpFavIcon} size={18} />
    </button>
  );
}
