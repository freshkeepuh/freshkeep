'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Col, Container, Form, Row, Image, Card } from 'react-bootstrap';
import { Pencil, Trash, Check, X } from 'react-bootstrap-icons';
import { Store, Country } from '@prisma/client';
import { useForm, UseFormRegister } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AddressSubForm, { IAddressSubForm } from '@/components/AddressSubForm';
import { storeValidation } from '@/lib/validationSchemas';

interface IStoreForm extends IAddressSubForm {
  id?: string | undefined;
  name: string;
  address1: string;
  address2?: string | undefined;
  city: string;
  state: string;
  zipcode: string;
  country?: Country;
  phone?: string | undefined;
  website?: string | undefined;
  picture?: string | undefined;
}

const mapStoreToForm = (s: Store): IStoreForm => ({
  id: s.id,
  name: s.name ?? '',
  address1: s.address1 ?? '',
  address2: s.address2 ?? '',
  city: s.city ?? '',
  state: s.state ?? '',
  zipcode: s.zipcode ?? '',
  country: s.country ?? '',
  phone: s.phone ?? '',
  website: s.website ?? '',
  picture: s.picture ?? '',
});

interface StoreCardProps {
  store: Store;
  onUpdate: (updatedStore: Store) => void;
  onDelete: (id: string) => void;
}

const StoreCard = ({ store, onUpdate, onDelete }: StoreCardProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<IStoreForm>({
    resolver: yupResolver(storeValidation),
    defaultValues: mapStoreToForm(store),
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    clearErrors();
    reset(mapStoreToForm(store)); // Reset form to store values when entering edit mode
    setIsEditing(true);
  };

  const handleDeleteClick = async () => {
    try {
      clearErrors();
      const response = await fetch(`/api/store/${store.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onDelete(store.id);
      } else {
        setError('name', { type: 'manual', message: 'Failed to delete store' });
      }
    } catch (error) {
      setError('name', { type: 'manual', message: 'Failed to delete store. Please try again.' });
    }
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch('/api/store', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(store),
      });
      if (response.ok) {
        const updated : Store = await response.json();
        onUpdate(updated);
        setIsEditing(false);
      } else {
        setError('name', { type: 'manual', message: 'Failed to update store' });
      }
    } catch (error) {
      setError('name', { type: 'manual', message: 'Failed to save changes. Please try again.' });
    }
  };

  const handleCancelClick = () => {
    clearErrors();
    reset(mapStoreToForm(store)); // Reset form to store values when cancelling
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Container>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Text className="mb-2">
                  <Form onSubmit={handleSubmit(handleSaveClick)}>
                    <Form.Group className="mb-3">
                      <Form.Label aria-required="true">Store Name: *</Form.Label>
                      <Form.Control
                        id="name"
                        type="text"
                        placeholder="Store Name"
                        size="lg"
                        {...register('name')}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name && errors.name.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <AddressSubForm
                      register={register as unknown as UseFormRegister<IAddressSubForm>}
                      errors={errors}
                    />
                    <Form.Group className="mb-3">
                      <Form.Label>Phone:</Form.Label>
                      <Form.Control
                        id="phone"
                        type="text"
                        placeholder="Phone"
                        size="lg"
                        {...register('phone')}
                        isInvalid={!!errors.phone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone && errors.phone.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Website:</Form.Label>
                      <Form.Control
                        id="website"
                        type="text"
                        placeholder="Website"
                        size="lg"
                        {...register('website')}
                        isInvalid={!!errors.website}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.website && errors.website.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Picture URL:</Form.Label>
                      <Form.Control
                        id="picture"
                        type="text"
                        placeholder="Picture URL"
                        size="lg"
                        {...register('picture')}
                        isInvalid={!!errors.picture}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.picture && errors.picture.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form>
                </Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-end">
                <Button
                  variant="outline-secondary"
                  className="me-2"
                  onClick={handleCancelClick}
                  disabled={isSubmitting}
                >
                  <X className="mb-1" />
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit(handleSaveClick)}
                  disabled={isSubmitting}
                >
                  <Check className="mb-1" />
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Header as="h5" className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <Image
                  src={store.picture ?? `${store.website ?? ''}/favicon.ico`}
                  alt={store.name}
                  width={32}
                  height={32}
                  className="me-2"
                />
                <Link
                  href={store.website ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  {store.name}
                </Link>
              </div>
              <div>
                <Button
                  variant="outline-dark"
                  size="sm"
                  className="me-2 p-1"
                  aria-label={`Edit ${store.name}`}
                  onClick={handleEditClick}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="p-1"
                  aria-label={`Delete ${store.name}`}
                  onClick={handleDeleteClick}
                >
                  <Trash />
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Text className="mb-2">
                <AddressSubForm
                  register={register as unknown as UseFormRegister<IAddressSubForm>}
                  errors={errors}
                />
              </Card.Text>
              <Card.Text className="text-muted small mb-1">
                <strong>Phone: </strong>
                {store.phone}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StoreCard;
