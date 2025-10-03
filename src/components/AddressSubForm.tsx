'use client';

import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { UseFormRegister } from 'react-hook-form';
import CountryDropDown, { ICountryField } from '@/components/CountryDropDown';
import { Check, Pencil, X } from 'react-bootstrap-icons';
import { Country } from '@prisma/client';

export interface IAddressSubForm extends ICountryField {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipcode: string;
}

interface AddressSubFormProps {
  register: UseFormRegister<IAddressSubForm>;
  errors: { [key in keyof IAddressSubForm]?: { message?: string } };
  onEdit: (data: IAddressSubForm) => void;
  address: IAddressSubForm;
}

const AddressSubForm = ({ register, errors, onEdit, address }: AddressSubFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editAddress, setEditAddress] = useState<IAddressSubForm>(address);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditAddress(address);
  };

  const handleSaveClick = () => {
    onEdit(editAddress);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditAddress(address);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Container>
        <Row className="mb-3">
          <Col>
            <p className="fw-bold">{address.address1 || 'No Address Provided'}</p>
            <p className="mb-1">{address.address2}</p>
            <p className="mb-1">
              {address.city}
              {', '}
              {address.state}
              {' '}
              {address.zipcode}
            </p>
            <p className="mb-0">{address.country}</p>
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
  }
  return (
    <Container>
      <Row>
        <Col md={6}>
          <Form.Group controlId="address1">
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
          <Form.Group controlId="address2">
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
          <Form.Group controlId="city">
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
          <Form.Group controlId="state">
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
          <Form.Group controlId="zipcode">
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
            register={register('country')}
            errors={{ country: errors.country }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AddressSubForm;
