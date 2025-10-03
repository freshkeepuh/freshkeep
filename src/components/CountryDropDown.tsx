'use client';

import React from 'react';
import { Form } from 'react-bootstrap';
import { UseFormRegister } from 'react-hook-form';
import { Country } from '@prisma/client'; // Update the path as needed

const displayNames: Record<Country, string> = {
  [Country.USA]: 'United States',
  [Country.CAN]: 'Canada',
};

// Helper function to get display name for country
const getCountryDisplayName = (country: Country): string => (
  displayNames[country]
);

export interface ICountryField {
  country: Country;
}

export interface CountryDropDownProps {
  register: UseFormRegister<ICountryField>;
  errors: { country?: { message?: string } };
  disabled?: boolean;
}

const CountryDropDown = ({ register, errors, disabled }: CountryDropDownProps) => (
  <>
    <Form.Select
      id="country"
      size="lg"
      as="select"
      aria-label="Country"
      {...register('country')}
      disabled={disabled}
      isInvalid={!!errors.country}
      defaultValue={Country.USA}
    >
      {
        Object.values(Country).map((country) => (
          <option key={country} value={country}>
            {getCountryDisplayName(country)}
          </option>
        ))
      }
    </Form.Select>
    <Form.Control.Feedback type="invalid">
      {errors.country?.message}
    </Form.Control.Feedback>
  </>
);

export default CountryDropDown;
