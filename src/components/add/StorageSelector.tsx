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

          let activeClass = '';
          if (isSelected) {
            activeClass = s.type === 'fridge' ? styles.storageActiveFridge : styles.storageActivePantry;
          }

          const emoji = s.type === 'fridge' ? '❄️' : '🏠';
          const temperature = s.type === 'fridge' ? s.temperature : undefined;

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
              <p className={styles.storageMeta}>
                {s.items}
                <span>items</span>
              </p>
              {temperature ? <p className={styles.storageTemp}>{temperature}</p> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
