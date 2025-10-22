'use client';

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import RequiredLabel from '../RequiredLabel';

export interface NewStorageData {
  name: string;
  type: 'Fridge' | 'Freezer' | 'Pantry' | 'Spice Rack' | 'Other';
  itemCount: number;
}

interface AddStorageModalProps {
  show: boolean;
  onClose: () => void;
  onAdd: (storage: NewStorageData) => void;
}

export default function AddStorageModal({ show, onClose, onAdd }: AddStorageModalProps) {
  const [formData, setFormData] = useState<NewStorageData>({
    name: '',
    type: '',
    itemCount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'itemCount' ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    onAdd(formData);
    setFormData({ name: '', type: 'Fridge', itemCount: 0 });
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Storage</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <RequiredLabel>Storage Name</RequiredLabel>
            <Form.Control
              name="name"
              type="text"
              placeholder="e.g. Upstairs Pantry"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">Please provide a storage name.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <RequiredLabel>Storage Type</RequiredLabel>
            <Form.Select name="type" value={formData.type} onChange={handleChange} required>
              <option value="" disabled hidden>Select type</option>
              <option value="Fridge">Fridge</option>
              <option value="Freezer">Freezer</option>
              <option value="Pantry">Pantry</option>
              <option value="Spice Rack">Spice Rack</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Item Count (optional)</Form.Label>
            <Form.Control
              name="itemCount"
              type="number"
              min="0"
              value={formData.itemCount}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Add Storage
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
