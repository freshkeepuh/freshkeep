import React from 'react';
import { Form } from 'react-bootstrap';
import { Unit } from '@prisma/client';
import { UseFormRegister } from 'react-hook-form';

export interface IUnitField {
  unit: Unit;
}

interface UnitDropDownProps {
  register: UseFormRegister<IUnitField>;
  errors: { unit?: { message?: string } };
  disabled?: boolean;
  units: Unit[];
}

export const UnitDropDown: React.FC<UnitDropDownProps> = ({
  register,
  errors,
  disabled = false,
  units,
}) => (
  <>
    <Form.Select
      id="unit"
      size="lg"
      as="select"
      aria-label="Unit of Measurement Dropdown"
      {...register('unit')}
      disabled={disabled}
      isInvalid={!!errors.unit}
      defaultValue={units.length > 0 ? units[0].id : ''}
    >
      {
        units.map(unit => (
          <option key={unit.id} value={unit.id}>
            {unit.abbr}
          </option>
        ))
      }
    </Form.Select>
    <Form.Control.Feedback type="invalid">
      {errors.unit?.message}
    </Form.Control.Feedback>
  </>
);
