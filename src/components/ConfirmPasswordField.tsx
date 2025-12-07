'use client';

import React from 'react';
import { Form } from 'react-bootstrap';
import { UseFormRegister } from 'react-hook-form';

export interface IConfirmPasswordField {
  confirmPassword: string;
}

export interface ConfirmPasswordFieldProps {
  register: UseFormRegister<IConfirmPasswordField>;
  errors: { confirmPassword?: { message?: string } };
  placeholder?: string;
}

const ConfirmPasswordField = ({
  register,
  errors,
  placeholder,
}: ConfirmPasswordFieldProps) => (
  <>
    <Form.Control
      id="confirmPassword"
      type="password"
      placeholder={placeholder || '🔒 Confirm Password'}
      size="lg"
      isInvalid={!!errors.confirmPassword}
      {...register('confirmPassword')}
    />
    <Form.Control.Feedback type="invalid">
      {errors.confirmPassword?.message}
    </Form.Control.Feedback>
  </>
);

export default ConfirmPasswordField;
