import React from 'react';
import { Form } from 'react-bootstrap';
import { StorageArea } from '@prisma/client';
import { useFormContext } from 'react-hook-form';

interface StorageAreaFilterProps {
  label: string;
  disabled: boolean;
  storageAreas: StorageArea[];
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

function StorageAreaFilter({
  label = 'Storage Area',
  disabled = false,
  storageAreas = [],
  onChange = () => {
    /* no-op */
  },
}: StorageAreaFilterProps) {
  const context = useFormContext();
  if (!context) {
    throw new Error('StorageAreaFilter must be used within a FormProvider');
  }
  const {
    register,
    formState: { errors },
  } = context;
  return (
    <>
      {label && <Form.Label htmlFor="storageAreaFilter">{label}</Form.Label>}
      <Form.Select
        id="storageAreaFilter"
        size="lg"
        as="select"
        aria-label="Storage Area Filter"
        {...register('storageArea')}
        disabled={disabled}
        isInvalid={!!errors.storageArea}
        onChange={onChange}
      >
        <option key="all" value="">
          All
        </option>
        {storageAreas
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((storageArea) => (
            <option key={storageArea.id} value={storageArea.id}>
              {storageArea.name}
            </option>
          ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {errors.storageArea ? errors.storageArea.message?.toString() : null}
      </Form.Control.Feedback>
    </>
  );
}

export default StorageAreaFilter;
