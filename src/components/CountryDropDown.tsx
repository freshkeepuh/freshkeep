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
  displayNames[country] ?? country
);

export interface ICountryField {
  country?: any;
}

export interface CountryDropDownProps {
  register: UseFormRegister<ICountryField>;
}

/**
 * CountryDropDown component.
 *
 * Note: The default value for the country field should be set via useForm initialization,
 * not via a prop or defaultValue on the select element. Example:
 *   useForm({ defaultValues: { country: Country.USA } })
 */
const CountryDropDown: React.FC<CountryDropDownProps> = ({ register }) => (
  <>
    {/* defaultValue removed; set default in useForm initialization */}
    <Form.Select
      id="country"
      size="lg"
      aria-label="Country"
      {...register('country')}
    >
      {
        // If Country is a TypeScript enum, filter out numeric keys
        Object.values(Country)
          .filter((country) => typeof country === 'string')
          .map((country) => (
            <option key={country} value={country}>
              {getCountryDisplayName(country as Country)}
            </option>
          ))
      }
    </Form.Select>
  </>
);

export default CountryDropDown;
