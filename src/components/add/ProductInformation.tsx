'use client';

import { useMemo, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import type { $Enums } from '@prisma/client';
import type { GroceryOption, Mode, UnitOption } from './types';

type GroceryCategory = $Enums.ProductCategory;

type Props = {
  mode: Mode;
  setMode: (m: Mode) => void;

  groceries: GroceryOption[];
  groceryItemId: string | null;
  setGroceryItemId: (id: string | null) => void;

  newName?: string;
  setNewName: (v: string) => void;
  newCategory?: GroceryCategory;
  setNewCategory: (v: GroceryCategory | undefined) => void;
  newDefaultQty?: number;
  setNewDefaultQty: (v: number | undefined) => void;
  newUnitId?: string;
  setNewUnitId: (v: string | undefined) => void;

  units: UnitOption[];
  disabled?: boolean;
};

const CATEGORY_VALUES: GroceryCategory[] = [
  'Fruits',
  'Vegetables',
  'CannedGoods',
  'Dairy',
  'Meat',
  'FishSeafood',
  'Deli',
  'Condiments',
  'Spices',
  'Snacks',
  'Bakery',
  'Beverages',
  'Pasta',
  'Grains',
  'Cereal',
  'Baking',
  'FrozenFoods',
  'Other',
];

const CATEGORY_LABELS: Partial<Record<GroceryCategory, string>> = {
  Fruits: 'Fruits',
  Vegetables: 'Vegetables',
  CannedGoods: 'Canned Goods',
  Dairy: 'Dairy',
  Meat: 'Meat',
  FishSeafood: 'Fish & Seafood',
  Deli: 'Deli',
  Condiments: 'Condiments',
  Spices: 'Spices',
  Snacks: 'Snacks',
  Bakery: 'Bakery',
  Beverages: 'Beverages',
  Pasta: 'Pasta',
  Grains: 'Grains',
  Cereal: 'Cereal',
  Baking: 'Baking',
  FrozenFoods: 'Frozen Foods',
  Other: 'Other',
};

export default function ProductInformation({
  mode,
  setMode,
  groceries,
  groceryItemId,
  setGroceryItemId,
  newName,
  setNewName,
  newCategory,
  setNewCategory,
  newDefaultQty,
  setNewDefaultQty,
  newUnitId,
  setNewUnitId,
  units,
  disabled,
}: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groceries;
    return groceries.filter((g) => g.name.toLowerCase().includes(q));
  }, [groceries, query]);

  return (
    <Row className="g-3">
      <Col md={4}>
        <Form.Group controlId="mode">
          <Form.Label>Mode</Form.Label>
          <Form.Select
            value={mode}
            onChange={(e) => setMode(e.currentTarget.value as Mode)}
            disabled={disabled}
          >
            <option value="existing">Use existing item</option>
            <option value="new">Create new grocery item</option>
          </Form.Select>
        </Form.Group>
      </Col>

      {mode === 'existing' && (
        <>
          <Col md={4}>
            <Form.Group controlId="search">
              <Form.Label>Search item</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type to filter…"
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                disabled={disabled}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="groceryItemId">
              <Form.Label>Existing Grocery Item</Form.Label>
              <Form.Select
                value={groceryItemId ?? ''}
                onChange={(e) => setGroceryItemId(e.currentTarget.value || null)}
                disabled={disabled}
              >
                <option value="">Select…</option>
                {filtered.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </>
      )}

      {mode === 'new' && (
        <>
          <Col md={6}>
            <Form.Group controlId="newName">
              <Form.Label>New item name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Greek Yogurt"
                value={newName ?? ''}
                onChange={(e) => setNewName(e.currentTarget.value)}
                disabled={disabled}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="newCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newCategory ?? ''}
                onChange={(e) => setNewCategory(
                  (e.currentTarget.value || undefined) as GroceryCategory | undefined,
                )}
                disabled={disabled}
              >
                <option value="">Select…</option>
                {CATEGORY_VALUES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c] ?? c}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="newDefaultQty">
              <Form.Label>Default Qty (optional)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={newDefaultQty ?? ''}
                onChange={(e) => setNewDefaultQty(
                  e.currentTarget.value === '' ? undefined : Number(e.currentTarget.value),
                )}
                disabled={disabled}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="newUnitId">
              <Form.Label>Default Unit (optional)</Form.Label>
              <Form.Select
                value={newUnitId ?? ''}
                onChange={(e) => setNewUnitId(e.currentTarget.value || undefined)}
                disabled={disabled}
              >
                <option value="">(none)</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {`${u.name}${u.abbr ? ` (${u.abbr})` : ''}`}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </>
      )}
    </Row>
  );
}
