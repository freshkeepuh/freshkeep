'use client';

import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { StorageType } from '@prisma/client'; // Update the path as needed
import { getStorageTypeDisplayName } from '@/lib/dbEnums';

interface StorageTypeFilterProps {
  label?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

/**
 * StorageTypeFilter component.
 *
 * Note: The default value for the storageType field should be set via useForm initialization,
 * not via a prop or defaultValue on the select element. Example:
 *   useForm({ defaultValues: { storageType: StorageType.Freezer } })
 */
const StorageTypeFilter: React.FC<StorageTypeFilterProps> = (
  {
    label = 'Storage Type',
    disabled = false,
    onChange = () => { /* no-op */ },
  },
) => {
  const [isDisabled] = React.useState(disabled);
  const context = useFormContext();
  if (!context) {
    throw new Error('StorageTypeFilter must be used within a FormProvider');
  }
  const {
    register,
    formState: { errors },
  } = context;
  return (
    <>
      {label && <Form.Label htmlFor="storageTypeFilter">{label}</Form.Label>}
      <Form.Select
        id="storageTypeFilter"
        size="lg"
        aria-label="Storage Type Filter"
        {...register('storageType')}
        disabled={isDisabled}
        onChange={onChange}
        isInvalid={!!errors.storageType}
      >
        <option key="all" value="">All</option>
        {
          Object.values(StorageType)
            .filter((storageType) => typeof storageType === 'string')
            .sort()
            .map((storageType) => (
              <option key={storageType} value={storageType}>
                {getStorageTypeDisplayName(storageType as StorageType)}
              </option>
            ))
        }
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {errors.storageType ? errors.storageType.message?.toString() : null}
      </Form.Control.Feedback>
    </>
  );
};

export default StorageTypeFilter;
