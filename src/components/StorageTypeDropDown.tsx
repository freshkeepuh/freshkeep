'use client';

import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { StorageType } from '@prisma/client'; // Update the path as needed
import { getStorageTypeDisplayName } from '@/lib/dbEnums';
import RequiredLabel from '@/components/RequiredLabel';

interface StorageTypeDropDownProps {
  label: string;
  disabled: boolean;
  required: boolean;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

/**
 * StorageTypeDropDown component.
 *
 * Note: The default value for the storageType field should be set via useForm initialization,
 * not via a prop or defaultValue on the select element. Example:
 *   useForm({ defaultValues: { storageType: StorageType.Freezer } })
 */
function StorageTypeDropDown({
  label = 'Storage Type',
  disabled = false,
  required = false,
  onChange = () => {
    /* no-op */
  },
}: StorageTypeDropDownProps) {
  const [isDisabled] = React.useState(disabled);
  const context = useFormContext();
  if (!context) {
    throw new Error('StorageTypeDropDown must be used within a FormProvider');
  }
  const {
    register,
    formState: { errors },
  } = context;
  return (
    <>
      {label && !required && (
        <Form.Label htmlFor="storageType">{label}</Form.Label>
      )}
      {label && required && (
        <RequiredLabel htmlFor="storageType">{label}</RequiredLabel>
      )}
      <Form.Select
        id="storageType"
        size="lg"
        aria-label="Storage Type Dropdown"
        {...register('storageType')}
        disabled={isDisabled}
        isInvalid={!!errors.storageType}
        onChange={onChange}
      >
        {Object.values(StorageType)
          .filter((storageType) => typeof storageType === 'string')
          .sort()
          .map((storageType) => (
            <option key={storageType} value={storageType}>
              {getStorageTypeDisplayName(storageType as StorageType)}
            </option>
          ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {errors.storageType ? errors.storageType.message?.toString() : null}
      </Form.Control.Feedback>
    </>
  );
}

export default StorageTypeDropDown;
