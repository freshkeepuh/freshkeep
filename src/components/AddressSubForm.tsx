'use client';

import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Check, Pencil, X } from 'react-bootstrap-icons';
import { UseFormRegister } from 'react-hook-form';
import CountryDropDown, { ICountryField } from '@/components/CountryDropDown';

export interface IAddressSubForm extends ICountryField {
  address1: string;
  address2?: string | undefined;
  city: string;
  state: string;
  zipcode: string;
  country?: any; // Country;
}

interface AddressSubFormProps {
  register: UseFormRegister<IAddressSubForm>;
  errors: { [key in keyof IAddressSubForm]?: { message?: string } };
  initialAddress: IAddressSubForm;
  showEdit: boolean;
  onSave?: (address: IAddressSubForm) => void;
  onCancel?: (address: IAddressSubForm) => void;
}

const AddressSubForm = ({ register, errors, initialAddress, showEdit, onSave, onCancel }: AddressSubFormProps) => {
  const [newAddress] = useState<IAddressSubForm>({ ...initialAddress });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [allowEdit] = useState(showEdit ?? false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    try {
      setIsSubmitting(true);
      if (onSave) {
        onSave(newAddress);
      }
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    try {
      if (onCancel) {
        onCancel(initialAddress);
      }
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <>
        <Form.Group>
          <Form.Label aria-required="true">Address 1: *</Form.Label>
          <Form.Control
            id="address1"
            type="text"
            placeholder="Address 1"
            size="lg"
            isInvalid={!!errors.address1}
            {...register('address1')}
            onChange={(e) => {
              newAddress.address1 = e.target.value;
            }}
          />
          <Form.Control.Feedback type="invalid">
            {errors.address1?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Address 2:</Form.Label>
          <Form.Control
            id="address2"
            type="text"
            placeholder="Address 2"
            size="lg"
            isInvalid={!!errors.address2}
            {...register('address2')}
            onChange={(e) => {
              newAddress.address2 = e.target.value;
            }}
          />
          <Form.Control.Feedback type="invalid">
            {errors.address2?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>City:</Form.Label>
          <Form.Control
            id="city"
            type="text"
            placeholder="City"
            size="lg"
            isInvalid={!!errors.city}
            {...register('city')}
            onChange={(e) => {
              newAddress.city = e.target.value;
            }}
          />
          <Form.Control.Feedback type="invalid">
            {errors.city?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>State:</Form.Label>
          <Form.Control
            id="state"
            type="text"
            placeholder="State"
            size="lg"
            isInvalid={!!errors.state}
            {...register('state')}
            onChange={(e) => {
              newAddress.state = e.target.value;
            }}
          />
          <Form.Control.Feedback type="invalid">
            {errors.state?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Zipcode:</Form.Label>
          <Form.Control
            id="zipcode"
            type="text"
            placeholder="Zipcode"
            size="lg"
            isInvalid={!!errors.zipcode}
            {...register('zipcode')}
            onChange={(e) => {
              newAddress.zipcode = e.target.value;
            }}
          />
          <Form.Control.Feedback type="invalid">
            {errors.zipcode?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <CountryDropDown
          register={register as unknown as UseFormRegister<ICountryField>}
        />
        <span className="me-auto">
          <Button
            variant="success"
            size="sm"
            className="me-2 p-1"
            aria-label="Save Address"
            onClick={handleSaveClick}
            disabled={isSubmitting}
          >
            <Check />
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="p-1"
            aria-label="Cancel editing"
            onClick={handleCancelClick}
            disabled={isSubmitting}
          >
            <X />
          </Button>
        </span>
      </>
    );
  }

  return (
    <>
      <span className="fw-bold mb-3">{initialAddress.address1 || 'No Address Provided'}</span>
      {allowEdit && (
        <Button
          variant="outline-dark"
          type="button"
          size="sm"
          className="me-2 p-1"
          aria-label="Edit Address"
          onClick={handleEditClick}
        >
          <Pencil />
        </Button>
      )}
      {initialAddress.address1 && (
        <>
          <br />
          {initialAddress.address2 && (
            <>
              <span className="mb-3">{initialAddress.address2}</span>
              <br />
            </>
          )}
          <span className="mb-3">
            {initialAddress.city}
            {initialAddress.state && ', '}
            {initialAddress.state}
            {initialAddress.zipcode && ' '}
            {initialAddress.zipcode}
          </span>
          <br />
          <span className="mb-1">{initialAddress.country}</span>
        </>
      )}
    </>
  );
};

export default AddressSubForm;
