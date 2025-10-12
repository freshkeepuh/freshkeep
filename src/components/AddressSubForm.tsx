'use client';

import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { UseFormRegister } from 'react-hook-form';
import CountryDropDown, { ICountryField } from '@/components/CountryDropDown';
import { Check, Pencil, X } from 'react-bootstrap-icons';

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
  onSave: (data: IAddressSubForm) => void;
  address: IAddressSubForm;
}

const AddressSubForm = ({ register, errors, onSave, address }: AddressSubFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editAddress, setEditAddress] = useState<IAddressSubForm>(address);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditAddress(address);
  };

  const handleSaveClick = () => {
    onSave(editAddress);
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
          <Form.Group>
            <Form.Label aria-required="true">Address 1: *</Form.Label>
            <Form.Control
              id="address1"
              type="text"
              placeholder="Address 1"
              size="lg"
              isInvalid={!!errors.address1}
              {...register('address1')}
              defaultValue={address.address1}
              value={editAddress.address1}
              onChange={(e) => setEditAddress({ ...editAddress, address1: e.target.value })}
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
              defaultValue={address.address2}
              value={editAddress.address2}
              onChange={(e) => setEditAddress({ ...editAddress, address2: e.target.value })}
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
              defaultValue={address.city}
              value={editAddress.city}
              onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })}
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
              defaultValue={address.state}
              value={editAddress.state}
              onChange={(e) => setEditAddress({ ...editAddress, state: e.target.value })}
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
              defaultValue={address.zipcode}
              value={editAddress.zipcode}
              onChange={(e) => setEditAddress({ ...editAddress, zipcode: e.target.value })}
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
            register={register('country') as unknown as UseFormRegister<ICountryField>}
            errors={{ country: errors.country }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AddressSubForm;
