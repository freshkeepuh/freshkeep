'use client';

import { useId } from 'react';
import styles from './add.module.css';

interface Props {
  name: string;
  onChange: (v: string) => void;
}

export default function ProductBasics({ name, onChange }: Props) {
  const inputId = useId();

  return (
    <div style={{ marginBottom: 10 }}>
      <label className={styles.field} htmlFor={inputId}>
        <span className={styles.label}>Product Name</span>
        <input
          id={inputId}
          type="text"
          className={styles.input}
          placeholder="e.g., Milk, Apples, Eggs"
          value={name}
          onChange={(e) => onChange(e.currentTarget.value)}
        />
      </label>
    </div>
  );
}
