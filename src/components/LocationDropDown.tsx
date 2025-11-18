import React from 'react';
import { Form } from 'react-bootstrap';
import { Location } from '@prisma/client';
import { useFormContext } from 'react-hook-form';
import RequiredLabel from '@/components/RequiredLabel';

interface LocationDropDownProps {
  label?: string;
  disabled?: boolean;
  required?: boolean;
  locations?: Location[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

const LocationDropDown: React.FC<LocationDropDownProps> = (
  {
    label = 'Location',
    disabled = false,
    required = false,
    locations = [],
    onChange = () => { /* no-op */ }
  }
) => {
  const context = useFormContext();
  if (!context) {
    throw new Error('LocationDropDown must be used within a FormProvider');
  }
  const {
    register,
    formState: { errors },
  } = context;
  return (
    <>
      {(label && !required) && <Form.Label htmlFor="location">{label}</Form.Label>}
      {(label && required) && <RequiredLabel htmlFor="location">{label}</RequiredLabel>}
      <Form.Select
        id="location"
        size="lg"
        as="select"
        aria-label="Location Dropdown"
        {...register('location')}
        disabled={disabled}
        isInvalid={!!errors.location}
        onChange={onChange}
      >
        {
          locations.sort((a, b) => a.name.localeCompare(b.name))
            .map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))
        }
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {errors.location ? errors.location.message?.toString() : null}
      </Form.Control.Feedback>
    </>
  );
};

export default LocationDropDown;
