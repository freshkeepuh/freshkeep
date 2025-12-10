'use client';

import React from 'react';
import styles from './add.module.css';
import type { StorageUnit } from './types';

interface Props {
  units: StorageUnit[];
  selected: StorageUnit | null;
  onSelect: (u: StorageUnit) => void;
}

// Generic Box
function BoxIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0" />
      <path d="M12 22.08V12" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <path d="M21 16l-7-4" />
    </svg>
  );
}

// Fridge
function IceCubeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0" />
      <path d="M3.29 7 12 12.01 20.7 7" />
      <path d="M12 22.08V12" />
    </svg>
  );
}

// Freezer
function SnowflakeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12h20" />
      <path d="M12 2v20" />
      <path d="M20 20 4 4" />
      <path d="M4 20 20 4" />
      <path d="m17 17 4 4" />
    </svg>
  );
}

// Pantry
function CanIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6c0 1.66 4 3 9 3s9-1.34 9-3" />
      <path d="M21 6v12c0 1.66-4 3-9 3s-9-1.34-9-3V6" />
      <ellipse cx="12" cy="6" rx="9" ry="3" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="14" x2="21" y2="14" />
    </svg>
  );
}

// Spice Rack
function ChiliIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 21c0-3 1.8-5.3 3.7-6.9 3.5-3 5.3-4.4 6-8.5.6-3.6-1.5-4.4-1.5-4.4s4.2.4 5.3 4" />
      <path d="M15.5 5.2c1 3.5-.6 6-3.8 9.3-2.1 2.2-4.7 4-9.7 6.5" />
      <path d="M13 6l3-3" />
    </svg>
  );
}

export default function StorageSelector({ units, selected, onSelect }: Props) {
  return (
    <section className={styles.panel}>
      <h3 className={styles.panelTitle}>Select Storage Location</h3>

      <div className={styles.storageGrid}>
        {units.map((s) => {
          const isSelected = selected?.id === s.id;
          const activeClass = isSelected ? styles.storageActivePantry : '';

          let IconComponent = BoxIcon;
          if (s.type === 'freezer') {
            IconComponent = SnowflakeIcon;
          } else if (s.type === 'fridge') {
            IconComponent = IceCubeIcon;
          } else if (s.type === 'pantry') {
            IconComponent = CanIcon;
          } else if (s.type === 'spice-rack') {
            IconComponent = ChiliIcon;
          }

          return (
            <button
              key={s.id}
              type="button"
              className={`${styles.storageBtn} ${activeClass}`}
              onClick={() => onSelect(s)}
              aria-pressed={isSelected}
            >
              {/* SVG Component */}
              <div className={styles.storageEmoji}>
                <IconComponent />
              </div>

              <div className={styles.storageName}>{s.name}</div>

              {/* Location name */}
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
