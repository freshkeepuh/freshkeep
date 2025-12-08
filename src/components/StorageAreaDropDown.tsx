import React from 'react';
import { Form } from 'react-bootstrap';
import { StorageArea } from '@prisma/client';
import { useFormContext } from 'react-hook-form';
import RequiredLabel from '@/components/RequiredLabel';

interface StorageAreaDropDownProps {
  label: string;
  disabled: boolean;
  required: boolean;
  storageAreas: StorageArea[];
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

function StorageAreaDropDown({
  label = 'Storage Area',
  disabled = false,
  required = false,
  storageAreas = [],
  onChange = () => {
    /* no-op */
  },
}: StorageAreaDropDownProps) {
  const context = useFormContext();
  if (!context) {
    throw new Error('StorageAreaDropDown must be used within a FormProvider');
  }
  const {
    register,
    formState: { errors },
  } = context;
  return (
    <>
      {label && !required && (
        <Form.Label htmlFor="storageArea">{label}</Form.Label>
      )}
      {label && required && (
        <RequiredLabel htmlFor="storageArea">{label}</RequiredLabel>
      )}
      <Form.Select
        id="storageArea"
        size="lg"
        as="select"
        aria-label="Storage Area Dropdown"
        {...register('storageArea')}
        disabled={disabled}
        isInvalid={!!errors.storageArea}
        onChange={onChange}
      >
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

export default StorageAreaDropDown;
