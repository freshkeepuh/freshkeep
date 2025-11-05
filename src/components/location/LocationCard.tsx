'use client';

import { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { Pencil, Trash, Check, X } from 'react-bootstrap-icons';
import styles from './LocationCard.module.css';

interface LocationCardProps {
  id: string;
  name: string;
  address: string;
  onEdit: (id: string, name: string, address: string) => void;
  onDelete: (id: string) => Promise<void> | void;
  className?: string;
}

const LocationCard = ({ id, name, address, onEdit, onDelete, className }: LocationCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editAddress, setEditAddress] = useState(address);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditName(name);
    setEditAddress(address);
  };

  const handleSaveClick = async () => {
    try {
      setSaving(true);
      await Promise.resolve(onEdit(id, editName, editAddress));
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelClick = () => {
    setEditName(name);
    setEditAddress(address);
    setIsEditing(false);
  };

  if (isEditing) {
    const editingLiClass = [
      styles.item,
      styles.cardEditing,
      saving ? styles.saving : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <li className={editingLiClass}>
        {/* Edit form */}
        <div className={styles.row}>
          <Form.Control
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            size="sm"
            className={styles.inputName}
            disabled={saving}
            placeholder="Location name"
          />
          <span>
            <Button
              variant="success"
              size="sm"
              className={styles.iconBtn}
              aria-label={`Save ${editName}`}
              onClick={handleSaveClick}
              disabled={saving}
            >
              {saving ? <Spinner animation="border" size="sm" /> : <Check />}
            </Button>
            <Button
              variant="danger"
              size="sm"
              className={styles.iconBtn}
              aria-label="Cancel editing"
              onClick={handleCancelClick}
              disabled={saving}
            >
              <X />
            </Button>
          </span>
        </div>
        <div>
          {/* Address edit */}
          <Form.Control
            type="text"
            value={editAddress}
            onChange={(e) => setEditAddress(e.target.value)}
            size="sm"
            placeholder="Address"
            className={styles.input}
            disabled={saving}
          />
        </div>
      </li>
    );
  }

  return (
    <li
      className={[
        styles.item,
        styles.card,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Header with name and action buttons */}
      <div className={styles.row}>
        <h6 className={styles.title}>{name}</h6>
        <span>
          <Button
            variant="outline-dark"
            size="sm"
            className={styles.iconBtn}
            aria-label={`Edit ${name}`}
            onClick={handleEditClick}
            disabled={deleting}
          >
            <Pencil />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            className={styles.iconBtn}
            aria-label={`Delete ${name}`}
            onClick={async () => {
              try {
                setDeleting(true);
                await Promise.resolve(onDelete(id));
              } finally {
                setDeleting(false);
              }
            }}
            disabled={deleting}
          >
            {deleting ? <Spinner animation="border" size="sm" /> : <Trash />}
          </Button>
        </span>
      </div>
      {/* Address */}
      <div className={styles.addressText}>
        <strong>Address: </strong>
        {address}
      </div>
    </li>
  );
};

export default LocationCard;
