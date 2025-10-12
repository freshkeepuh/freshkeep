'use client';

import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
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
  initialAddress?: IAddressSubForm;
}

const AddressSubForm = ({ register, errors, initialAddress }: AddressSubFormProps) => {
  const address = {
    address1: initialAddress?.address1 ?? '',
    address2: initialAddress?.address2 ?? '',
    city: initialAddress?.city ?? '',
    state: initialAddress?.state ?? '',
    zipcode: initialAddress?.zipcode ?? '',
    country: initialAddress?.country ?? '',
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Container>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label aria-required="true">Address 1: *</Form.Label>
              <Form.Control
                id="address1"
                type="text"
                placeholder="Address 1"
                size="lg"
                isInvalid={!!errors.address1}
                {...register('address1')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address1?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-end mb-3">
            <span className="me-auto">
              <Button
                variant="success"
                size="sm"
                className="me-2 p-1"
                aria-label="Save Address"
                onClick={handleSaveClick}
              >
                <Check />
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="p-1"
                aria-label="Cancel editing"
                onClick={handleCancelClick}
              >
                <X />
              </Button>
            </span>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Address 2:</Form.Label>
              <Form.Control
                id="address2"
                type="text"
                placeholder="Address 2"
                size="lg"
                isInvalid={!!errors.address2}
                {...register('address2')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address2?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>City:</Form.Label>
              <Form.Control
                id="city"
                type="text"
                placeholder="City"
                size="lg"
                isInvalid={!!errors.city}
                {...register('city')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.city?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>State:</Form.Label>
              <Form.Control
                id="state"
                type="text"
                placeholder="State"
                size="lg"
                isInvalid={!!errors.state}
                {...register('state')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.state?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Zipcode:</Form.Label>
              <Form.Control
                id="zipcode"
                type="text"
                placeholder="Zipcode"
                size="lg"
                isInvalid={!!errors.zipcode}
                {...register('zipcode')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.zipcode?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <CountryDropDown
              register={{ ...register('country') } as unknown as UseFormRegister<ICountryField>}
            />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <p className="fw-bold mb-3">{address.address1 || 'No Address Provided'}</p>
          <p className="mb-3">{address.address2}</p>
          <p className="mb-3">
            {address.city}
            {address.state && ', '}
            {address.state}
            {address.zipcode && ' '}
            {address.zipcode}
          </p>
          <p className="mb-1">{address.country}</p>
        </Col>
        <Col>
          <Button
            variant="outline-dark"
            size="sm"
            className="me-2 p-1"
            aria-label="Edit Address"
            onClick={handleEditClick}
          >
            <Pencil />
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AddressSubForm;
