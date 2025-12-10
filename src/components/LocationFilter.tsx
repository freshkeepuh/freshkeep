import React from 'react';
import { Form } from 'react-bootstrap';
import { Location } from '@prisma/client';
import { useFormContext } from 'react-hook-form';

interface LocationFilterProps {
  label: string;
  disabled: boolean;
  locations: Location[];
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

function LocationFilter({
  label = 'Location',
  disabled = false,
  locations = [],
  onChange = () => {
    /* no-op */
  },
}: LocationFilterProps) {
  const context = useFormContext();
  if (!context) {
    throw new Error('LocationFilter must be used within a FormProvider');
  }
  const {
    register,
    formState: { errors },
  } = context;
  return (
    <>
      {label && <Form.Label htmlFor="locationFilter">{label}</Form.Label>}
      <Form.Select
        id="locationFilter"
        size="lg"
        as="select"
        aria-label="Location Filter"
        {...register('location')}
        disabled={disabled}
        isInvalid={!!errors.location}
        onChange={onChange}
      >
        <option key="all" value="">
          All
        </option>
        {locations
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {errors.location ? errors.location.message?.toString() : null}
      </Form.Control.Feedback>
    </>
  );
}

export default LocationFilter;
