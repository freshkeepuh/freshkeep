'use client';

import React from 'react';
import styles from './add.module.css';
import type { StorageUnit } from './types';

type Props = {
  units: StorageUnit[];
  selected: StorageUnit | null;
  onSelect: (u: StorageUnit) => void;
};

export default function StorageSelector({ units, selected, onSelect }: Props) {
  return (
    <section className={styles.panel}>
      <h3 className={styles.panelTitle}>Select Storage Location</h3>

      <div className={styles.storageGrid}>
        {units.map((s) => {
          const isSelected = selected?.id === s.id;

          // One consistent "active" style for ALL types
          const activeClass = isSelected ? styles.storageActivePantry : '';

          // Emoji by type (purely visual)
          let emoji = '📦';
          if (s.type === 'fridge' || s.type === 'freezer') {
            emoji = '🧊';
          } else if (s.type === 'pantry' || s.type === 'spice-rack') {
            emoji = '🏠';
          }

          return (
            <button
              key={s.id}
              type="button"
              className={`${styles.storageBtn} ${activeClass}`}
              onClick={() => onSelect(s)}
              aria-pressed={isSelected}
            >
              <div className={styles.storageEmoji}>{emoji}</div>
              <div className={styles.storageName}>{s.name}</div>

              {/* Location name (e.g., Main Home, Vacation Home) */}
              {s.locationName && (
                <p className={styles.storageMeta}>{s.locationName}</p>
              )}

              <p className={styles.storageMeta}>
                {s.items}
                <span> items</span>
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
