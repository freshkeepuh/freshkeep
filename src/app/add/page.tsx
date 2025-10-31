'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../components/add/add.module.css';
import StorageSelector from '../../components/add/StorageSelector';
import ProductBasics from '../../components/add/ProductBasics';
import QuantityUnit from '../../components/add/QuantityUnit';
import CategorySelector from '../../components/add/CategorySelector';
import ExpirySection from '../../components/add/ExpirySection';
import QuickAddList from '../../components/add/QuickAddList';
import TipsPanel from '../../components/add/TipsPanel';
import type { Category, StorageUnit } from '../../components/add/types';

const STORAGE_UNITS: StorageUnit[] = [
  { id: 1, name: 'Kitchen Fridge', items: 6, temperature: '38°F', type: 'fridge' },
  { id: 2, name: 'Garage Freezer', items: 4, temperature: '0°F', type: 'fridge' },
  { id: 3, name: 'Kitchen Pantry', items: 8, type: 'pantry' },
  { id: 4, name: 'Basement Storage', items: 12, type: 'pantry' },
];

export default function AddPage() {
  const router = useRouter();

  const units = useMemo(() => STORAGE_UNITS, []);
  const [selected, setSelected] = useState<StorageUnit | null>(null);

  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState('pieces');
  const [category, setCategory] = useState<Category | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | undefined>(undefined);
  const [picture, setPicture] = useState<string | undefined>(undefined);

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setExpiresAt(d.toISOString().split('T')[0]);
  }, []);

  const onPreset = useCallback((days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setExpiresAt(d.toISOString().split('T')[0]);
  }, []);

  const onQuickAdd = useCallback(
    (n: string, c: Category, days: number) => {
      setName(n);
      setCategory(c);
      onPreset(days);
    },
    [onPreset],
  );

  const resetForm = useCallback(() => {
    setName('');
    setQty(1);
    setUnit('pieces');
    setSelected(null);
    setCategory(null);
    setPicture(undefined);
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setExpiresAt(d.toISOString().split('T')[0]);
  }, []);

  const onSave = useCallback(() => {
    if (!name.trim()) return;
    if (!selected) return;
    if (!category) return;
    if (!expiresAt) return;
    resetForm();
  }, [category, expiresAt, name, resetForm, selected]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <main className={styles.max} style={{ paddingTop: 24, paddingBottom: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 className={styles.h1}>Add New Product 📦</h2>
        <p className={styles.p}>Add items to your storage units and track their freshness</p>
      </div>

      <div className={styles.grid}>
        <div style={{ display: 'grid', gap: 24 }}>
          <StorageSelector units={units} selected={selected} onSelect={setSelected} />

          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>Product Information</h3>
            <ProductBasics name={name} onChange={setName} />
            <QuantityUnit quantity={qty} unit={unit} onQuantity={setQty} onUnit={setUnit} />
            <CategorySelector selected={category} onSelect={setCategory} />
          </section>

          <ExpirySection
            expiresAt={expiresAt}
            setExpiresAt={(v: string | undefined) => setExpiresAt(v)}
            picture={picture}
            setPicture={(v: string | undefined) => setPicture(v)}
          />

          <div className={styles.actions}>
            <button type="button" className={styles.btnSecondary} onClick={goBack}>
              Cancel
            </button>
            <button type="button" className={styles.btnPrimary} onClick={onSave}>
              Add Product
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 24 }}>
          <QuickAddList onQuickAdd={onQuickAdd} />
          <TipsPanel />
        </div>
      </div>
    </main>
  );
}
