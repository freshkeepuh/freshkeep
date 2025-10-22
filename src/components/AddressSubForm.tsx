'use client';

import React from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import CountryDropDown, { ICountryField } from '@/components/CountryDropDown';
import { Country } from '@prisma/client';

export interface IAddressSubForm extends ICountryField {
  address1: string;
  address2?: string | undefined;
  city: string;
  state: string;
  zipcode: string;
  country: Country; // Country;
}

interface AddressSubFormProps {
  address: IAddressSubForm;
  isEditing: boolean;
}

const AddressSubForm = ({ address, isEditing }: AddressSubFormProps) => {
  const context = useFormContext();
  if (isEditing) {
    if (!context) {
      throw new Error('AddressSubForm must be used within a FormProvider');
    }
    const {
      register,
      formState: { errors },
    } = context;
    return (
      <>
        <Form.Group>
          <Form.Label aria-required="true">Address 1: *</Form.Label>
          <Form.Control
            id="address1"
            type="text"
            placeholder="Address 1"
            size="lg"
            {...register('address1')}
            isInvalid={!!errors.address1}
          />
          <Form.Control.Feedback type="invalid">
            {errors.address1 && errors.address1.message?.toString()}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Address 2:</Form.Label>
          <Form.Control
            id="address2"
            type="text"
            placeholder="Address 2"
            size="lg"
            {...register('address2')}
            isInvalid={!!errors.address2}
          />
          <Form.Control.Feedback type="invalid">
            {errors.address2 && errors.address2.message?.toString()}
          </Form.Control.Feedback>
        </Form.Group>
        <Container>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>City:</Form.Label>
                <Form.Control
                  id="city"
                  type="text"
                  placeholder="City"
                  size="lg"
                  {...register('city')}
                  isInvalid={!!errors.city}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.city && errors.city.message?.toString()}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>State:</Form.Label>
                <Form.Control
                  id="state"
                  type="text"
                  placeholder="State"
                  size="lg"
                  {...register('state')}
                  isInvalid={!!errors.state}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.state && errors.state.message?.toString()}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Zipcode:</Form.Label>
                <Form.Control
                  id="zipcode"
                  type="text"
                  placeholder="Zipcode"
                  size="lg"
                  {...register('zipcode')}
                  isInvalid={!!errors.zipcode}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.zipcode && errors.zipcode.message?.toString()}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Container>
        <Form.Group>
          <Form.Label>Country:</Form.Label>
          <CountryDropDown />
          <Form.Control.Feedback type="invalid">
            {errors.country && errors.country.message?.toString()}
          </Form.Control.Feedback>
        </Form.Group>
      </>
    );
  }

  return (
    <>
      <span className="fw-bold mb-3">{address.address1 || 'No Address Provided'}</span>
      {address.address1 && (
        <>
          <br />
          {address.address2 && (
            <>
              <span className="mb-3">{address.address2}</span>
              <br />
            </>
          )}
          <span className="mb-3">
            {address.city}
            {address.state && ', '}
            {address.state}
            {address.zipcode && ' '}
            {address.zipcode}
          </span>
          <br />
          <span className="mb-1">{address.country}</span>
        </>
      )}
    </>
  );
};

export default AddressSubForm;
