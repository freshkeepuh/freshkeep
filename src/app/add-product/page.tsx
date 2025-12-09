'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { ProductCategory } from '@prisma/client';
import styles from '../../components/add/add.module.css';
import StorageSelector from '../../components/add/StorageSelector';
import ProductBasics from '../../components/add/ProductBasics';
import QuantityUnit from '../../components/add/QuantityUnit';
import CategorySelector from '../../components/add/CategorySelector';
import ExpirySection from '../../components/add/ExpirySection';
import QuickAddList from '../../components/add/QuickAddList';
import TipsPanel from '../../components/add/TipsPanel';
import SuccessPopUp from '../../components/SuccessPopUp';
import type { Category, StorageUnit } from '../../components/add/types';

function mapCategoryToEnum(category: Category): ProductCategory {
  const key = String(category).replace(/\s+/g, '').toLowerCase();

  const mapping: Record<string, ProductCategory> = {
    fruits: ProductCategory.Fruits,
    vegetables: ProductCategory.Vegetables,
    cannedgoods: ProductCategory.CannedGoods,
    dairy: ProductCategory.Dairy,
    meat: ProductCategory.Meat,
    fishseafood: ProductCategory.FishSeafood,
    deli: ProductCategory.Deli,
    condiments: ProductCategory.Condiments,
    spices: ProductCategory.Spices,
    snacks: ProductCategory.Snacks,
    bakery: ProductCategory.Bakery,
    beverages: ProductCategory.Beverages,
    pasta: ProductCategory.Pasta,
    grains: ProductCategory.Grains,
    cereal: ProductCategory.Cereal,
    baking: ProductCategory.Baking,
    frozenfoods: ProductCategory.FrozenFoods,
    other: ProductCategory.Other,
  };

  return mapping[key] ?? ProductCategory.Other;
}

export default function AddPage() {
  const router = useRouter();

  const [storages, setStorages] = useState<StorageUnit[]>([]);
  const [storagesLoading, setStoragesLoading] = useState(true);
  const [storagesError, setStoragesError] = useState<string | null>(null);
  const [selected, setSelected] = useState<StorageUnit | null>(null);

  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | undefined>(undefined);
  const [picture, setPicture] = useState<string | undefined>(undefined);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successBody, setSuccessBody] = useState('');

  // ---- Load storages + locations ----
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setStoragesLoading(true);
        setStoragesError(null);

        const [storagesRes, locationsRes] = await Promise.all([
          fetch('/api/storage', { cache: 'no-store' }),
          fetch('/api/location', { cache: 'no-store' }),
        ]);

        if (!storagesRes.ok) {
          throw new Error('Failed to load storage units');
        }

        const rawStorages = (await storagesRes.json()) as any[];
        const rawLocations = locationsRes.ok
          ? ((await locationsRes.json()) as any[])
          : [];

        const locById: Record<string, string> = {};
        rawLocations.forEach((l) => {
          if (l.id && l.name) locById[l.id] = l.name;
        });

        const mapped: StorageUnit[] = rawStorages.map((s) => {
          const t = (s.type as string) || 'Pantry';

          let uiType: StorageUnit['type'] = 'pantry';
          if (t === 'Refrigerator' || t === 'Fridge') uiType = 'fridge';
          else if (t === 'Freezer') uiType = 'freezer';
          else if (t === 'SpiceRack' || t === 'Spice Rack') uiType = 'spice-rack';
          else if (t === 'Pantry') uiType = 'pantry';
          else uiType = 'other';

          return {
            id: s.id,
            name: s.name,
            items: s.itemCount ?? 0,
            type: uiType,
            locId: s.locId ?? null,
            locationName: s.locId ? locById[s.locId] ?? null : null,
          };
        });

        if (!cancelled) {
          setStorages(mapped);
          if (!selected && mapped.length > 0) {
            setSelected(mapped[0]);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : 'Failed to load storage units';
          setStoragesError(msg);
        }
      } finally {
        if (!cancelled) setStoragesLoading(false);
      }
    };

    load().catch(() => {});

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Default expiry to +7 days ----
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
    setUnit(null);
    setCategory(null);
    setPicture(undefined);
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setExpiresAt(d.toISOString().split('T')[0]);
    setError(null);
  }, []);

  // ---- Save handler: create Product + ProductInstance ----
  const onSave = useCallback(async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!category) {
      setError('Please select a category');
      return;
    }
    if (!unit) {
      setError('Please select a unit');
      return;
    }
    if (!expiresAt) {
      setError('Please select an expiry date');
      return;
    }
    if (!selected) {
      setError('Please select a storage area');
      return;
    }
    if (!selected.locId) {
      setError('Selected storage must be linked to a location');
      return;
    }

    setSaving(true);
    setError(null);

    const trimmedName = name.trim();

    try {
      const res = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          brand: null,
          category: mapCategoryToEnum(category),
          unitId: unit,
          defaultQty: qty,
          isNeeded: false,
          picture: picture ?? null,
        }),
      });

      const body: any = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message =
          typeof body.error === 'string' ? body.error : 'Failed to create product';
        throw new Error(message);
      }

      const prodId: string | undefined = body.id ?? body._id;
      if (!prodId) {
        throw new Error('Could not determine ID of new product');
      }

      // 2) Convert date-only string to full ISO DateTime for Prisma
      const isoExpiresAt = `${expiresAt}T00:00:00.000Z`;

      // 3) Create ProductInstance in selected storage
      const instRes = await fetch('/api/product/instance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locId: selected.locId,
          storId: selected.id,
          prodId,
          unitId: unit,
          quantity: qty,
          expiresAt: isoExpiresAt,
        }),
      });

      const instBody: any = await instRes.json().catch(() => ({}));

      if (!instRes.ok) {
        const message =
          typeof instBody.error === 'string'
            ? instBody.error
            : 'Failed to create product in storage';
        throw new Error(message);
      }

      // 4) Update local counts
      setStorages((prev) =>
        prev.map((s) =>
          s.id === selected.id
            ? { ...s, items: (s.items ?? 0) + 1 }
            : s,
        ),
      );
      setSelected((prev) =>
        prev && prev.id === selected.id
          ? { ...prev, items: (prev.items ?? 0) + 1 }
          : prev,
      );

      setSuccessBody(`"${trimmedName}" was added to ${selected.name}.`);
      setShowSuccess(true);
      resetForm();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to add product';
      setError(message);
    } finally {
      setSaving(false);
    }
  }, [category, expiresAt, name, picture, qty, resetForm, selected, unit]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <main className={styles.max} style={{ paddingTop: 24, paddingBottom: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 className={styles.h1}>Add New Product 📦</h2>
        <p className={styles.p}>
          Add items to your storage units and track their freshness
        </p>
      </div>

      <div className={styles.grid}>
        <div style={{ display: 'grid', gap: 24 }}>
          <StorageSelector
            units={storages}
            selected={selected}
            onSelect={setSelected}
          />
          {storagesLoading && (
            <p style={{ marginTop: -12, marginBottom: 8, fontSize: 13 }}>
              Loading storage units…
            </p>
          )}
          {storagesError && (
            <p
              style={{ color: 'red', marginTop: -12, marginBottom: 8, fontSize: 13 }}
            >
              {storagesError}
            </p>
          )}

          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>Product Information</h3>
            <ProductBasics name={name} onChange={setName} />
            <QuantityUnit
              quantity={qty}
              unit={unit}
              onQuantity={setQty}
              onUnit={setUnit}
            />
            <CategorySelector selected={category} onSelect={setCategory} />
          </section>

          <ExpirySection
            expiresAt={expiresAt}
            setExpiresAt={(v: string | undefined) => setExpiresAt(v)}
            picture={picture}
            setPicture={(v: string | undefined) => setPicture(v)}
          />

          {error && (
            <p
              style={{ color: 'red', marginTop: 8 }}
              data-testid="add-product-error"
            >
              {error}
            </p>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={goBack}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={onSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Add Product'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 24 }}>
          <QuickAddList onQuickAdd={onQuickAdd} />
          <TipsPanel />
        </div>
      </div>

      {/* Success popup */}
      <SuccessPopUp
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Product added"
        body={successBody}
      />
    </main>
  );
}
