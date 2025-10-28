'use client';

import { useCallback } from 'react';
import styles from './add.module.css';
import type { Category } from './types';

type Props = {
  onQuickAdd: (name: string, category: Category, days: number) => void;
};

type QuickItem = {
  name: string;
  category: Category;
  days: number;
  emoji: string;
  className: string;
  subtitle: string;
};

const QUICK_ITEMS: QuickItem[] = [
  {
    name: 'Milk',
    category: 'dairy',
    days: 7,
    emoji: '🥛',
    className: [styles.quickRow, styles.qBlue].join(' '),
    subtitle: 'Expires in 7 days',
  },
  {
    name: 'Bread',
    category: 'pantry',
    days: 5,
    emoji: '🍞',
    className: [styles.quickRow, styles.qYellow].join(' '),
    subtitle: 'Expires in 5 days',
  },
  {
    name: 'Eggs',
    category: 'dairy',
    days: 14,
    emoji: '🥚',
    className: [styles.quickRow, styles.qOrange].join(' '),
    subtitle: 'Expires in 2 weeks',
  },
  {
    name: 'Apples',
    category: 'fruits',
    days: 10,
    emoji: '🍎',
    className: [styles.quickRow, styles.qGreen].join(' '),
    subtitle: 'Expires in 10 days',
  },
];

export default function QuickAddList({ onQuickAdd }: Props) {
  const handleAdd = useCallback(
    (name: string, category: Category, days: number) => () => onQuickAdd(name, category, days),
    [onQuickAdd],
  );

  return (
    <section className={styles.panel}>
      <h3 className={styles.panelTitle}>Quick Add Common Items</h3>

      <ul
        aria-label="Quick add items"
        style={{ display: 'grid', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}
      >
        {QUICK_ITEMS.map((item) => (
          <li key={item.name}>
            <button
              type="button"
              className={item.className}
              aria-label={`Quick add ${item.name}`}
              onClick={handleAdd(item.name, item.category, item.days)}
            >
              <span className={styles.quickEmoji}>{item.emoji}</span>
              <div>
                <div className={styles.quickTitle}>{item.name}</div>
                <div className={styles.quickSub}>{item.subtitle}</div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
