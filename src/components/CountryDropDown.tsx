'use client';

import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { Country } from '@prisma/client'; // Update the path as needed
import { getCountryDisplayName } from '@/lib/dbEnums';
import RequiredLabel from './RequiredLabel';

interface CountryDropDownProps {
  label?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

/**
 * CountryDropDown component.
 *
 * Note: The default value for the country field should be set via useForm initialization,
 * not via a prop or defaultValue on the select element. Example:
 *   useForm({ defaultValues: { country: Country.USA } })
 */
const CountryDropDown: React.FC<CountryDropDownProps> = (
  {
    label = 'Country',
    disabled = false,
    required = false,
    onChange = () => { /* no-op */ },
  },
) => {
  const context = useFormContext();
  if (!context) {
    throw new Error('CountryDropDown must be used within a FormProvider');
  }
  const {
    register,
    formState: { errors },
  } = context;
  return (
    <>
      {(label && !required) && <Form.Label htmlFor="country">{label}</Form.Label>}
      {(label && required) && <RequiredLabel htmlFor="country">{label}</RequiredLabel>}
      <Form.Select
        id="country"
        size="lg"
        aria-label="Country"
        {...register('country')}
        disabled={disabled}
        required={required}
        isInvalid={!!errors.country}
        onChange={onChange}
      >
        {
          Object.values(Country)
            .filter((country) => typeof country === 'string')
            .sort()
            .map((country) => (
              <option key={country} value={country}>
                {getCountryDisplayName(country as Country)}
              </option>
            ))
        }
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {errors.country ? errors.country.message?.toString() : null}
      </Form.Control.Feedback>
    </>
  );
};

export default CountryDropDown;
