'use client';

import { useCallback } from 'react';
import styles from './add.module.css';

type Props = {
  quantity: number;
  unit: string;
  onQuantity: (n: number) => void;
  onUnit: (u: string) => void;
};

const UNITS = [
  { id: 'pieces', label: 'Pieces' },
  { id: 'kg', label: 'Kilograms' },
  { id: 'lbs', label: 'Pounds' },
  { id: 'liters', label: 'Liters' },
  { id: 'bottles', label: 'Bottles' },
  { id: 'cans', label: 'Cans' },
  { id: 'boxes', label: 'Boxes' },
];

export default function QuantityUnit({
  quantity, unit, onQuantity, onUnit,
}: Props) {
  const dec = useCallback(
    () => onQuantity(Math.max(1, quantity - 1)),
    [onQuantity, quantity],
  );
  const inc = useCallback(
    () => onQuantity(quantity + 1),
    [onQuantity, quantity],
  );

  return (
    <div className={styles.fieldGrid}>
      <div>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label id="quantity-label" className={styles.label}>
          Quantity
        </label>

        <div className={styles.qtyRow}>
          <button
            type="button"
            onClick={dec}
            className={styles.sideBtn}
            aria-label="Decrease quantity"
          >
            –
          </button>

          <input
            aria-labelledby="quantity-label"
            type="number"
            min={1}
            step={1}
            value={quantity}
            onChange={(e) => {
              const n = Number(e.currentTarget.value);
              onQuantity(Number.isFinite(n) ? Math.max(1, n) : 1);
            }}
            className={styles.qtyInput}
          />

          <button
            type="button"
            onClick={inc}
            className={styles.sideBtn}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label id="unit-label" className={styles.label}>
          Unit
        </label>

        <select
          aria-labelledby="unit-label"
          className={styles.select}
          value={unit}
          onChange={(e) => onUnit(e.currentTarget.value)}
        >
          {UNITS.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
