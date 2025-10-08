'use client';

import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Pencil, Trash, Check, X, Plus } from 'react-bootstrap-icons';

interface LocationCardProps {
  id: string;
  name: string;
  address: string;
  onEdit: (id: string, name: string, address: string) => void;
  onDelete: (id: string) => void;
}

const LocationCard = ({ id, name, address, onEdit, onDelete }: LocationCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editAddress, setEditAddress] = useState(address);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditName(name);
    setEditAddress(address);
  };

  const handleSaveClick = () => {
    onEdit(id, editName, editAddress);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditName(name);
    setEditAddress(address);
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
          {/* Address edit */}
          <Form.Control
            type="text"
            value={editAddress}
            onChange={(e) => setEditAddress(e.target.value)}
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
        <h6 className="mb-0 fw-bold text-dark">{name}</h6>
        <span>
          <Button
            variant="outline-dark"
            size="sm"
            className="me-2 p-1"
            aria-label={`Edit ${name}`}
            onClick={handleEditClick}
          >
            <Pencil />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            className="p-1"
            aria-label={`Delete ${name}`}
            onClick={() => onDelete(id)}
          >
            <Trash />
          </Button>
        </span>
      </div>
      {/* Address */}
      <div className="text-muted small">
        <strong>Address: </strong>
        {address}
      </div>
    </li>
  );
};

export default LocationCard;
