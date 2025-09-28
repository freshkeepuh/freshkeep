'use client';

import React from 'react';
import { Form } from 'react-bootstrap';
import { UseFormRegister } from 'react-hook-form';

export interface IPasswordField {
  password: string;
}

export interface PasswordFieldProps {
  register: UseFormRegister<IPasswordField>;
  errors: { password?: { message?: string } };
  placeholder?: string;
}

const PasswordField = ({ register, errors, placeholder }: PasswordFieldProps) => (
  <>
    <Form.Control
      id="password"
      type="password"
      placeholder={ placeholder || "🔒 Password" }
      size="lg"
      isInvalid={!!errors.password}
      {...register('password')}
    />
    <Form.Control.Feedback type="invalid">
      {errors.password?.message}
    </Form.Control.Feedback>
  </>
);

export default PasswordField;
