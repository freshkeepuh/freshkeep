'use client';

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import RequiredLabel from '../RequiredLabel';

export interface NewStorageData {
  name: string;
  type: 'Fridge' | 'Freezer' | 'Pantry' | 'Spice Rack' | 'Other';
  itemCount: number | string;
  locId?: string;
}

interface AddStorageModalProps {
  show: boolean;
  onClose: () => void;
  onAdd: (storage: NewStorageData) => void;
  locations: { id: string; name: string }[]; // narrow Location type as needed
}

export default function AddStorageModal({ show, onClose, onAdd, locations }: AddStorageModalProps) {
  const [formData, setFormData] = useState<NewStorageData>({
    name: '',
    type: '' as any,
    itemCount: '' as any,
    locId: '',
  });

  const [errors, setErrors] = useState<{ [key in keyof NewStorageData]?: boolean }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = () => {
    // Validate required fields
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.type) newErrors.type = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // convert input itemCount to number
    const itemCountNumber = formData.itemCount === '' ? 0 : Number(formData.itemCount);

    const submissionData: NewStorageData = {
      name: formData.name.trim(),
      type: formData.type,
      itemCount: itemCountNumber,
      locId: formData.locId || undefined,
    };

    onAdd(submissionData);

    setFormData({ name: '', type: 'Fridge', itemCount: '', locId: '' });
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
            <RequiredLabel htmlFor="name">Storage Name</RequiredLabel>
            <Form.Control
              name="name"
              type="text"
              placeholder="e.g. Upstairs Pantry"
              value={formData.name}
              onChange={handleChange}
              isInvalid={errors.name}
            />
            <Form.Control.Feedback type="invalid">Please provide a storage name.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <RequiredLabel htmlFor="type">Storage Type</RequiredLabel>
            <Form.Select name="type" value={formData.type} onChange={handleChange} isInvalid={errors.type}>
              <option value="" disabled hidden>Select type</option>
              <option value="Fridge">Fridge</option>
              <option value="Freezer">Freezer</option>
              <option value="Pantry">Pantry</option>
              <option value="Spice Rack">Spice Rack</option>
              <option value="Other">Other</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">Please select a storage type.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="storageLocation" className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Select name="locId" value={formData.locId} onChange={handleChange} isInvalid={errors.locId}>
              <option value="" disabled hidden>Select location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Item Count (optional)</Form.Label>
            <Form.Control
              name="itemCount"
              type="number"
              placeholder="e.g. 10"
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
