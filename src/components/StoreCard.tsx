'use client';

import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Pencil, Trash, Check, X, Link } from 'react-bootstrap-icons';
import { Store } from '@prisma/client';

interface StoreCardProps {
  store: Store;
  onSave: (store: Store) => void;
  onDelete: (id: string) => void;
}

const StoreCard = ({ store, onSave, onDelete }: StoreCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(store.name);
  const [editAddress1, setEditAddress1] = useState(store.address1);
  const [editAddress2, setEditAddress2] = useState(store.address2);
  const [editCity, setEditCity] = useState(store.city);
  const [editState, setEditState] = useState(store.state);
  const [editZipcode, setEditZipcode] = useState(store.zipcode);
  const [editPhone, setEditPhone] = useState(store.phone);
  const [editWebsite, setEditWebsite] = useState(store.website);
  const [editPicture, setEditPicture] = useState(store.picture);
  const [errors, setErrors] = useState<string[]>([]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditName(store.name);
    setEditAddress1(store.address1);
    setEditAddress2(store.address2);
    setEditCity(store.city);
    setEditState(store.state);
    setEditZipcode(store.zipcode);
    setEditPhone(store.phone);
    setEditWebsite(store.website);
    setEditPicture(store.picture);
    setErrors([]);
  };

  const handleDeleteClick = () => {
    try {
      setErrors([]);
      onDelete(store.id);
    } catch (error) {
      setErrors(['Failed to delete the store. Please try again.']);
    }
  };

  const handleSaveClick = () => {
    try {
      setErrors([]);
      onSave({
        ...store,
        name: editName,
        address1: editAddress1,
        address2: editAddress2,
        city: editCity,
        state: editState,
        zipcode: editZipcode,
        phone: editPhone,
        website: editWebsite,
        picture: editPicture,
      });
      setIsEditing(false);
    } catch (error) {
      setErrors(['Failed to save changes. Please try again.']);
    }
  };

  const handleCancelClick = () => {
    setEditName(store.name);
    setEditAddress1(store.address1);
    setEditAddress2(store.address2);
    setEditCity(store.city);
    setEditState(store.state);
    setEditZipcode(store.zipcode);
    setEditPhone(store.phone);
    setEditWebsite(store.website);
    setEditPicture(store.picture);
    setErrors([]);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li
        className="d-flex flex-column mb-3 p-3"
        style={{
          background: '#f8f9fa', // Slightly different background to indicate edit mode
          borderRadius: '8px',
          border: '2px solid #28a745',
          boxShadow: '0 4px 16px rgba(40, 167, 69, 0.15)',
        }}
      >
        {errors.length > 0 && (
          <div className="mb-2">
            {errors.map((error) => (
              <div className="text-danger">
                {error}
              </div>
            ))}
          </div>
        )}
        {/* Edit form */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          <Form.Control
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            size="sm"
            className="fw-bold"
            placeholder="Location name"
            style={{
              flex: 1,
              marginRight: '0.5rem',
              border: '1px solid #ced4da',
              borderRadius: '4px',
            }}
          />
          <span>
            <Button
              variant="success"
              size="sm"
              className="me-2 p-1"
              aria-label={`Save ${editName}`}
              onClick={handleSaveClick}
            >
              <Check />
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="p-1"
              aria-label="Cancel editing"
              onClick={handleCancelClick}
            >
              <X />
            </Button>
          </span>
        </div>
        <div>
          {/* Address1 edit */}
          <Form.Control
            type="text"
            value={editAddress1 as string}
            onChange={(e) => setEditAddress1(e.target.value)}
            size="sm"
            placeholder="Address"
            style={{
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: 'inherit',
            }}
          />
        </div>
      </li>
    );
  }

  return (
    <li
      className="d-flex flex-column mb-3 p-3"
      style={{
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
      }}
    >
      {/* Header with name and action buttons */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h6 className="mb-0 fw-bold text-dark">
          <Link href={store.website ? store.website : '#'}>{store.name}</Link>
        </h6>
        <span>
          <Button
            variant="outline-dark"
            size="sm"
            className="me-2 p-1"
            aria-label={`Edit ${store.name}`}
            onClick={handleEditClick}
          >
            <Pencil />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            className="p-1"
            aria-label={`Delete ${store.name}`}
            onClick={handleDeleteClick}
          >
            <Trash />
          </Button>
        </span>
      </div>
      {/* Address */}
      <div className="text-muted small">
        <strong>Address: </strong>
        {store.address1}
        {store.address2 ? `, ${store.address2}` : ''}
        {store.city ? `, ${store.city}` : ''}
        {store.state ? `, ${store.state}` : ''}
        {store.zipcode ? `, ${store.zipcode}` : ''}
        {store.country ? `, ${store.country}` : ''}
      </div>
      {/* Phone */}
      <div className="text-muted small">
        <strong>Phone: </strong>
        {store.phone}
      </div>
    </li>
  );
};

export default StoreCard;
