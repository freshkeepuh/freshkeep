'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal, Button, Form } from 'react-bootstrap';
import { ProductInstance, Location } from '@prisma/client';
import { AddStorageSchema } from '@/lib/validationSchemas';
import RequiredLabel from '../RequiredLabel';

export type NewStorageData = {
  name: string;
  location: Location | string;
  type: 'Refrigerator' | 'Freezer' | 'Pantry' | 'SpiceRack' | 'Other';
  instances?: ProductInstance[];
  picture?: string;
  itemCount?: number | string;
};
type productItem = {
  id: string;
  locId: string;
  storId: string;
  prodId: string;
  grocId: string; // include the field the resolver expects
  unitId: string;
  quantity: number;
  expiresAt?: Date | null;
  picture?: string | null;
};

const defaultValues: NewStorageData = {
  name: '',
  location: '',
  type: 'Refrigerator',
  itemCount: '' as any,
  picture: '' as any,
  instances: [] as any,
};

interface AddStorageModalProps {
  show: boolean;
  onClose: () => void;
  onAdd: (storage: NewStorageData) => void;
}

const AddStorageModal: React.FC<AddStorageModalProps> = ({ show, onClose, onAdd }: AddStorageModalProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<NewStorageData>({
    defaultValues,
    resolver: yupResolver(AddStorageSchema),
  });

  // const [errors, setErrors] = useState<{ [key in keyof NewStorageData]?: boolean }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    FormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error on change
    // setErrors((prev) => ({ ...prev, [name]: false }));
  };
  /*
  const handleSubmit = () => {
    // Validate required fields
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.type) newErrors.type = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } */

  // convert input itemCount to number
  const itemCountNumber = FormData.itemCount === '' ? 0 : Number(FormData.itemCount);

  const submissionData: NewStorageData = {
    name: FormData.name.trim(),
    location: FormData.location.trim(),
    type: FormData.type,
    itemCount: itemCountNumber,
  };

  onAdd(submissionData);

  FormData({ name: '', location: '', type: 'Refrigerator', itemCount: '' });
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
            isInvalid={errors.name}
          />
          <Form.Control.Feedback type="invalid">Please provide a storage name.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <RequiredLabel>Storage Type</RequiredLabel>
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
        <Form.Group>
          <Form.Label>Location (optional)</Form.Label>
          <Form.Control
            name="location"
            type="text"
            placeholder="e.g. Main House 123 Ave Honolulu, HI 96814"
            value={formData.location}
            onChange={handleChange}
          />
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
export default AddStorageModal;
