'use client';

import styles from './add.module.css';
import type { Category } from './types';

type Props = {
  selected: Category | null;
  onSelect: (c: Category) => void;
};

const CATS: Array<{ id: Category; emoji: string; label: string }> = [
  { id: 'dairy', emoji: '🥛', label: 'Dairy' },
  { id: 'fruits', emoji: '🍎', label: 'Fruits' },
  { id: 'vegetables', emoji: '🥕', label: 'Veggies' },
  { id: 'meat', emoji: '🥩', label: 'Meat' },
  { id: 'pantry', emoji: '🍞', label: 'Pantry' },
  { id: 'other', emoji: '📦', label: 'Other' },
];

export default function CategorySelector({ selected, onSelect }: Props) {
  const labelId = 'category-label';
  return (
    <div style={{ marginTop: 8 }}>
      <span id={labelId} className={styles.label}>Category</span>
      <div className={styles.catGrid} role="group" aria-labelledby={labelId}>
        {CATS.map((c) => {
          const active = c.id === selected;
          return (
            <button
              type="button"
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`${styles.catBtn} ${active ? styles.catActive : ''}`}
              aria-pressed={active}
            >
              <div className={styles.catEmoji}>{c.emoji}</div>
              <div className={styles.catText}>{c.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
