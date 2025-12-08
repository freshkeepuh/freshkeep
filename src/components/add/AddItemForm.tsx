'use client';

import { useMemo, useState, useCallback } from 'react';
import { $Enums, ProductCategory } from '@prisma/client';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import ProductInformation from './ProductInformation';
import Expiration from './ExpirySection';
import type {
  ContainerOption,
  GroceryOption,
  LocationOption,
  UnitOption,
  Mode,
} from './types';

type GroceryCategory = $Enums.ProductCategory;

interface Props {
  locations: LocationOption[];
  containers: ContainerOption[];
  units: UnitOption[];
  groceries: GroceryOption[];
}

export default function AddItemForm({
  locations,
  containers,
  units,
  groceries,
}: Props) {
  const [mode, setMode] = useState<Mode>('existing');
  const [locId, setLocId] = useState('');
  const [conId, setConId] = useState('');
  const [groceryItemId, setGroceryItemId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<GroceryCategory | undefined>(
    undefined,
  );
  const [newDefaultQty, setNewDefaultQty] = useState<number | undefined>(
    undefined,
  );
  const [newUnitId, setNewUnitId] = useState<string | undefined>(undefined);
  const [unitId, setUnitId] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [expiresAt, setExpiresAt] = useState<string | undefined>(undefined);
  const [picture, setPicture] = useState<string | undefined>(undefined);
  const [submittedPreview, setSubmittedPreview] = useState<string | null>(null);

  const filteredContainers = useMemo(
    () => containers.filter((c) => c.locId === locId),
    [containers, locId],
  );

  const handleLocChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLocId(e.currentTarget.value);
      setConId('');
    },
    [],
  );

  const handleConChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setConId(e.currentTarget.value);
    },
    [],
  );

  const handleUnitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setUnitId(e.currentTarget.value);
    },
    [],
  );

  const handleQtyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.currentTarget.value || 0);
      setQuantity(val);
    },
    [],
  );

  const handleSubmitMock = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const payload = {
        mode,
        locId,
        conId,
        unitId,
        quantity,
        expiresAt,
        picture,
        groceryItemId: mode === 'existing' ? groceryItemId : undefined,
        newName: mode === 'new' ? newName || undefined : undefined,
        newCategory: mode === 'new' ? newCategory : undefined,
        newDefaultQty: mode === 'new' ? newDefaultQty : undefined,
        newUnitId: mode === 'new' ? newUnitId : undefined,
      };
      setSubmittedPreview(JSON.stringify(payload, null, 2));
    },
    [
      mode,
      locId,
      conId,
      unitId,
      quantity,
      expiresAt,
      picture,
      groceryItemId,
      newName,
      newCategory,
      newDefaultQty,
      newUnitId,
    ],
  );

  const handleReset = useCallback(() => {
    setMode('existing');
    setLocId('');
    setConId('');
    setGroceryItemId(null);
    setNewName('');
    setNewCategory(undefined);
    setNewDefaultQty(undefined);
    setNewUnitId(undefined);
    setUnitId('');
    setQuantity(1);
    setExpiresAt(undefined);
    setPicture(undefined);
    setSubmittedPreview(null);
  }, []);

  return (
    <Card>
      <Card.Body>
        <Form onSubmit={handleSubmitMock}>
          <Row className="g-3 mb-1">
            <Col md={6}>
              <Form.Group controlId="locId">
                <Form.Label>Location</Form.Label>
                <Form.Select value={locId} onChange={handleLocChange}>
                  <option value="">Select…</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="conId">
                <Form.Label>Container</Form.Label>
                <Form.Select
                  value={conId}
                  onChange={handleConChange}
                  disabled={!locId}
                >
                  <option value="">Select…</option>
                  {filteredContainers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3">
            <ProductInformation
              mode={mode}
              setMode={setMode}
              groceries={groceries}
              groceryItemId={groceryItemId}
              setGroceryItemId={setGroceryItemId}
              newName={newName}
              setNewName={setNewName}
              newCategory={newCategory ?? ProductCategory.Bakery}
              setNewCategory={setNewCategory}
              newDefaultQty={newDefaultQty ?? 1}
              setNewDefaultQty={setNewDefaultQty}
              newUnitId={newUnitId ?? ''}
              setNewUnitId={setNewUnitId}
              units={units}
              disabled={false}
            />
          </div>

          <Row className="g-3 mt-1">
            <Col md={4}>
              <Form.Group controlId="unitId">
                <Form.Label>Unit</Form.Label>
                <Form.Select value={unitId} onChange={handleUnitChange}>
                  <option value="">Select…</option>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {`${u.name}${u.abbr ? ` (${u.abbr})` : ''}`}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="quantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={quantity}
                  onChange={handleQtyChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-2">
            <Expiration
              expiresAt={expiresAt}
              setExpiresAt={(v) => setExpiresAt(v)}
              picture={picture}
              setPicture={(v) => setPicture(v)}
            />
          </div>

          <div className="mt-4 d-flex gap-2">
            <Button type="submit">Add Item (Mock)</Button>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </Form>

        {submittedPreview && (
          <div className="mt-4">
            <h6 className="mb-2 text-muted">Mock submission preview</h6>
            <pre
              className="bg-light p-3 rounded"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {submittedPreview}
            </pre>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
