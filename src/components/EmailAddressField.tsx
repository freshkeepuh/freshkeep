'use client';

import React from 'react';
import { Form } from 'react-bootstrap';
import { UseFormRegister } from 'react-hook-form';

export interface IEmailAddressField {
  email: string;
}

export interface EmailAddressFieldProps {
  register: UseFormRegister<IEmailAddressField>;
  errors: { email?: { message?: string } };
  placeholder: string;
  disabled: boolean;
}

function EmailAddressField({
  register,
  errors,
  placeholder,
  disabled,
}: EmailAddressFieldProps) {
  return (
    <>
      <Form.Control
        id="email"
        type="email"
        placeholder={placeholder || '📧 Email'}
        disabled={disabled}
        size="lg"
        autoFocus
        isInvalid={!!errors.email}
        {...register('email')}
      />
      <Form.Control.Feedback type="invalid">
        {errors.email?.message}
      </Form.Control.Feedback>
    </>
  );
}

export default EmailAddressField;
