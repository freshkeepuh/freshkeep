'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { ThreeDotsVertical, Pencil, Trash } from 'react-bootstrap-icons';
import styles from '../../styles/dashboard.module.css';

interface StorageInstance {
  id: string;
  name: string;
  quantity: number;
  expiresAt: string | Date | null;
  product?: {
    name: string;
    brand?: string;
    category?: string;
  };
  unit?: {
    id?: string;
    abbr?: string;
    name?: string;
  };
  [key: string]: any;
}

interface Storage {
  id: string;
  name: string;
  instances: StorageInstance[];
  location?: { name: string };
  [key: string]: any;
}

interface StorageDetailProps {
  storage: Storage | any;
}

interface UnitOption {
  id: string;
  label: string;
}

// Helper
function formatDate(date?: string | Date | null) {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return '—';
  }
}

function daysUntil(date?: string | Date | null) {
  if (!date) return null;
  const target = new Date(date).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

// Date Format
function toDateInputValue(date?: string | Date | null): string {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function getExpiryBadge(dte: number | null) {
  if (dte === null) return <Badge bg="secondary">No date</Badge>;
  if (dte < 0)
    return (
      <Badge bg="danger">
        <div>Expired</div>
        <div>{Math.abs(dte)}d</div>
      </Badge>
    );
  if (dte === 0)
    return (
      <Badge bg="warning" text="dark">
        Expires today
      </Badge>
    );
  if (dte <= 3)
    return (
      <Badge bg="warning" text="dark">
        <div>{dte}d left</div>
      </Badge>
    );
  return (
    <Badge bg="success">
      <div>{dte}d left</div>
    </Badge>
  );
}

interface CustomToggleProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const CustomToggle = React.forwardRef<HTMLButtonElement, CustomToggleProps>(
  ({ children, onClick }, ref) => (
    <button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
      type="button"
      className="btn btn-link text-body-secondary p-0 text-decoration-none"
      style={{ padding: '0 0.5rem', border: 'none' }}
    >
      {children}
    </button>
  ),
);

CustomToggle.displayName = 'CustomToggle';
CustomToggle.defaultProps = {
  onClick: undefined,
};

export default function StorageDetail({ storage }: StorageDetailProps) {
  const router = useRouter();

  // Edit
  const [editingItem, setEditingItem] = useState<StorageInstance | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    quantity: 1,
    expiresAt: '',
    unitId: '',
  });

  // Delete
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Units for the dropdown
  const [units, setUnits] = useState<UnitOption[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>(
    'success',
  );

  // Load units so we can change measurements
  useEffect(() => {
    const loadUnits = async () => {
      try {
        const res = await fetch('/api/unit');
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped = data
            .map((u: any) => {
              const idFromApi = u.id;
              // eslint-disable-next-line no-underscore-dangle
              const idFromPrisma = u._id;
              const id = idFromApi ?? idFromPrisma;
              if (!id) return null;
              const label = u.abbr || u.name || 'Unit';
              return { id: String(id), label } as UnitOption;
            })
            .filter((u: UnitOption | null): u is UnitOption => Boolean(u));
          setUnits(mapped);
        }
      } catch {
        // unit dropdown will just have fewer options
      }
    };

    loadUnits();
  }, []);

  if (!storage) {
    return (
      <Container className="py-4">
        <div className="text-center py-5">
          <h3>Storage not found</h3>
        </div>
      </Container>
    );
  }

  const itemCount = Array.isArray(storage.instances)
    ? storage.instances.length
    : 0;

  const handleEditClick = (inst: StorageInstance) => {
    setEditingItem(inst);

    // Try to get unit id from instance
    const rawUnitId = (inst as any).unitId ?? inst.unit?.id ?? '';
    const unitId = rawUnitId ? String(rawUnitId) : '';

    setEditForm({
      quantity: inst.quantity,
      expiresAt: toDateInputValue(inst.expiresAt),
      unitId,
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsSaving(true);

    try {
      const res = await fetch(`/api/storage/item?id=${itemToDelete}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setToastVariant('success');
        setToastMessage('Item deleted successfully.');
        setShowToast(true);
        router.refresh();
      } else {
        setToastVariant('danger');
        setToastMessage('Failed to delete item.');
        setShowToast(true);
      }
    } catch {
      setToastVariant('danger');
      setToastMessage('An error occurred.');
      setShowToast(true);
    } finally {
      setIsSaving(false);
      setShowDeleteModal(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setIsSaving(true);

    try {
      const res = await fetch('/api/storage/item', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem.id,
          quantity: editForm.quantity,
          expiresAt: editForm.expiresAt || null,
          unitId: editForm.unitId === '  ' ? null : editForm.unitId,
        }),
      });

      if (res.ok) {
        setShowEditModal(false);
        setToastVariant('success');
        setToastMessage('Item updated successfully.');
        setShowToast(true);
        router.refresh();
      } else {
        setToastVariant('danger');
        setToastMessage('Failed to update item.');
        setShowToast(true);
      }
    } catch {
      setToastVariant('danger');
      setToastMessage('An error occurred.');
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container className="py-4">
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 1050 }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className={styles.mobileFixed}>
        <Card className="mb-4">
          <Card.Body>
            <Row className="align-items-center">
              <Col>
                <Card.Title className="mb-1">{storage.name}</Card.Title>
                {storage.location?.name ? (
                  <Card.Subtitle className="text-muted">
                    {storage.location.name}
                  </Card.Subtitle>
                ) : null}
              </Col>
              <Col xs="auto" className="text-end">
                <Badge bg="light" text="dark" className="me-2">
                  {itemCount} items
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {itemCount ? (
          <Card>
            <Card.Body>
              <Card.Title className="mb-3">Items</Card.Title>
              <ListGroup variant="flush">
                {storage.instances && storage.instances.length > 0 ? (
                  storage.instances.map((inst: StorageInstance) => {
                    const dte = daysUntil(inst.expiresAt);
                    const expiryBadge = getExpiryBadge(dte);
                    return (
                      <ListGroup.Item
                        key={inst.id}
                        className="d-flex justify-content-between align-items-center px-0 py-3"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div className="ps-3">
                            <div>
                              <strong>
                                {inst.product?.name || 'Unknown product'}
                              </strong>
                              {inst.product?.brand
                                ? ` · ${inst.product.brand}`
                                : ''}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: '0.9rem' }}
                            >
                              {inst.product?.category || ''}
                              {inst.expiresAt && (
                                <>
                                  {' · Exp: '}
                                  {formatDate(inst.expiresAt)}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-3 pe-3">
                          <div className="text-end">
                            <div className="fw-bold">
                              {inst.quantity}{' '}
                              {inst.unit?.abbr || inst.unit?.name || ''}
                            </div>
                            <div className="mt-1">{expiryBadge}</div>
                          </div>

                          <Dropdown align="end">
                            <Dropdown.Toggle as={CustomToggle}>
                              <ThreeDotsVertical size={20} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => handleEditClick(inst)}
                              >
                                <Pencil className="me-2" size={14} /> Edit
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="text-danger"
                                onClick={() => handleDeleteClick(inst.id)}
                              >
                                <Trash className="me-2" size={14} /> Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </ListGroup.Item>
                    );
                  })
                ) : (
                  <ListGroup.Item>No items in this storage.</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        ) : null}
      </div>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        size="sm"
        dialogClassName={styles.editModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  value={editForm.quantity}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      quantity: Number(e.target.value),
                    })
                  }
                  className="flex-grow-1"
                />
                <Form.Select
                  value={editForm.unitId}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      unitId: e.target.value,
                    })
                  }
                  style={{ maxWidth: '140px' }}
                  aria-label="Unit"
                >
                  <option value="">Unit</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expiration Date</Form.Label>
              <Form.Control
                type="date"
                value={editForm.expiresAt}
                onChange={(e) =>
                  setEditForm({ ...editForm, expiresAt: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleSaveEdit}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Item?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this item? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={isSaving}>
            {isSaving ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
