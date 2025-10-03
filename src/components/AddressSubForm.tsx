'use client';

import { Country } from '@prisma/client';
import React from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { UseFormRegister } from 'react-hook-form';
import CountryDropDown, { ICountryField } from '@/components/CountryDropDown';

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
}

const AddressSubForm = ({ register, errors }: AddressSubFormProps) => (
  <Container>
    <Row>
      <Col md={6}>
        <Form.Group controlId="address1">
          <Form.Label aria-required="true">Address 1: *</Form.Label>
          <Form.Control
            id="address1"
            type="text"
            placeholder={'Address 1'}
            size="lg"
            isInvalid={!!errors.address1}
            {...register('address1')}
          />
          <Form.Control.Feedback type="invalid">
            {errors.address1?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </Row>
    <Row>
      <Col md={6}>
        <Form.Group controlId="address2">
          <Form.Label>Address 2:</Form.Label>
          <Form.Control
            id="address2"
            type="text"
            placeholder={'Address 2'}
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
            placeholder={'City'}
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
            placeholder={'State'}
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
            placeholder={'Zipcode'}
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
          register={register('country') as unknown as UseFormRegister<ICountryField>}
          errors={errors as unknown as { [key in keyof ICountryField]?: { message?: string } }}
        />
      </Col>
    </Row>
  </Container>
);

export default AddressSubForm;
