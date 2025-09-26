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
}

const EmailAddressField = ({ register, errors }: EmailAddressFieldProps) => (
  <>
    <Form.Control
      type="email"
      placeholder="📧 Email"
      size="lg"
      isInvalid={!!errors.email}
      {...register('email')}
    />
    <Form.Control.Feedback type="invalid">
      {errors.email?.message}
    </Form.Control.Feedback>
  </>
);

export default EmailAddressField;
