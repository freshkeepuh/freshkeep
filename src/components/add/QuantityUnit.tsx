'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './add.module.css';

interface Props {
  quantity: number;
  unit: string | null;
  onQuantity: (n: number) => void;
  onUnit: (u: string) => void;
}

interface UnitOption {
  id: string;
  name: string;
  abbr: string;
}

export default function QuantityUnit({
  quantity,
  unit,
  onQuantity,
  onUnit,
}: Props) {
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUnits = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/unit');
        if (!res.ok) {
          throw new Error('Failed to load units');
        }

        const raw = await res.json();

        const data: UnitOption[] = raw.map((u: any) => ({
          id: u.id,
          name: u.name,
          abbr: u.abbr,
        }));

        setUnits(data);

        // If no unit is selected yet, default to the first loaded unit
        if (!unit && data.length > 0) {
          onUnit(data[0].id);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to load units';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadUnits();
  }, [unit, onUnit]); // ✅ include all referenced values

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
          value={unit ?? ''}
          onChange={(e) => onUnit(e.currentTarget.value)}
          disabled={loading || units.length === 0}
        >
          {loading && <option value="">Loading units…</option>}
          {!loading && units.length === 0 && (
            <option value="">No units available</option>
          )}
          {!loading &&
            units.length > 0 &&
            units.map((u) => (
              <option key={u.id} value={u.id}>
                {`${u.name} (${u.abbr})`}
              </option>
            ))}
        </select>
        {error && <p style={{ color: 'red', marginTop: 4 }}>{error}</p>}
      </div>
    </div>
  );
}
