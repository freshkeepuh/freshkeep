'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Form, Image, Card, Modal } from 'react-bootstrap';
import { Pencil, Trash, Check, X, GeoAlt } from 'react-bootstrap-icons';
import { Store, Country } from '@prisma/client';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AddressSubForm, { IAddressSubForm } from '@/components/AddressSubForm';
import { storeValidation } from '@/lib/validationSchemas';
import MapComponent from '@/components/MapDisplay';
import RequiredLabel from './RequiredLabel';

interface IStoreForm extends IAddressSubForm {
  id?: string | undefined;
  name: string;
  address1: string;
  address2?: string | undefined;
  city: string;
  state: string;
  zipcode: string;
  country: Country;
  phone?: string | undefined;
  website?: string | undefined;
  picture?: string | undefined;
}

interface StoreCardProps {
  store: any;
  onUpdate: (updatedStore: any) => void;
  onDelete: (id: string) => void;
}

const StoreCard = ({ store, onUpdate, onDelete }: StoreCardProps) => {
  const methods = useForm<IStoreForm>({
    resolver: yupResolver<IStoreForm>(storeValidation),
    defaultValues: { ...store },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleEditClick = () => {
    try {
      setIsSubmitting(true);
      methods.clearErrors();
      setIsEditing(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async () => {
    try {
      setIsSubmitting(true);
      methods.clearErrors();
      const response = await fetch(`/api/store/${store.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onDelete(store.id);
        setIsEditing(false);
      } else {
        methods.setError('name', { type: 'manual', message: 'Failed to delete store' });
      }
    } catch (error) {
      methods.setError('name', { type: 'manual', message: 'Failed to delete store. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveClick = async () => {
    try {
      setIsSubmitting(true);
      const body = JSON.stringify({ ...methods.getValues() });
      const response = await fetch('/api/store', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      if (response.ok) {
        const updated: Store = await response.json();
        onUpdate(updated);
        setIsEditing(false);
      } else {
        methods.setError('name', { type: 'manual', message: 'Failed to update store' });
      }
    } catch (error) {
      methods.setError('name', { type: 'manual', message: 'Failed to save changes. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    try {
      setIsSubmitting(true);
      methods.clearErrors();
      methods.reset({ ...store }); // Reset form to store values when cancelling
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <FormProvider {...methods}>
        <Modal show={isEditing} onHide={handleCancelClick} size="lg" centered>
          <Form onSubmit={methods.handleSubmit(handleSaveClick)}>
            <Card>
              <Card.Body>
                <Form.Group className="mb-3">
                  <RequiredLabel aria-required="true">Store Name:</RequiredLabel>
                  <Form.Control
                    id="name"
                    type="text"
                    placeholder="Store Name"
                    size="lg"
                    {...methods.register('name')}
                    isInvalid={!!methods.formState.errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {methods.formState.errors.name && methods.formState.errors.name.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <AddressSubForm
                  address={store}
                  isEditing={isEditing}
                />
                <Form.Group className="mb-3">
                  <Form.Label>Phone:</Form.Label>
                  <Form.Control
                    id="phone"
                    type="text"
                    placeholder="Phone"
                    size="lg"
                    {...methods.register('phone')}
                    isInvalid={!!methods.formState.errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {methods.formState.errors.phone && methods.formState.errors.phone.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Website:</Form.Label>
                  <Form.Control
                    id="website"
                    type="text"
                    placeholder="Website"
                    size="lg"
                    {...methods.register('website')}
                    isInvalid={!!methods.formState.errors.website}
                  />
                  <Form.Control.Feedback type="invalid">
                    {methods.formState.errors.website && methods.formState.errors.website.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Picture URL:</Form.Label>
                  <Form.Control
                    id="picture"
                    type="text"
                    placeholder="Picture URL"
                    size="lg"
                    {...methods.register('picture')}
                    isInvalid={!!methods.formState.errors.picture}
                  />
                  <Form.Control.Feedback type="invalid">
                    {methods.formState.errors.picture && methods.formState.errors.picture.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-end">
                <Button
                  variant="outline-secondary"
                  type="button"
                  className="me-2"
                  onClick={handleCancelClick}
                  disabled={isSubmitting}
                >
                  <X className="mb-1" />
                </Button>
                <Button
                  variant="success"
                  type="submit"
                  className="me-2"
                  disabled={isSubmitting}
                >
                  <Check className="mb-1" />
                </Button>
              </Card.Footer>
            </Card>
          </Form>
        </Modal>
      </FormProvider>
    );
  }

  return (
    <Card>
      <Card.Header as="h5" className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <Link
            href={store.website ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            <Image
              src={store.picture ?? `${store.website ?? ''}/favicon.ico`}
              alt={store.name}
              width={32}
              height={32}
              className="me-2"
            />
          </Link>
          <Link
            href={`/store/${store.id}`}
            aria-label={`View details for ${store.name}`}
            className="text-decoration-none"
          >
            {store.name}
          </Link>
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Text className="mb-6">
          <AddressSubForm
            address={store}
            isEditing={isEditing}
          />
        </Card.Text>
        <Card.Text className="text-muted small mb-6">
          <strong>Phone: </strong>
          {store.phone}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex align-items-center flex-wrap gap-2">
        <div>
          <Button
            variant="outline-success"
            size="sm"
            className="d-inline-flex align-items-center me-2"
            onClick={() => setShowMap(true)}
          >
            <GeoAlt className="me-1" />
            Map
          </Button>
        </div>
        <div className="ms-sm-auto">
          <Button
            variant="outline-dark"
            size="sm"
            className="me-2 p-1"
            aria-label={`Edit ${store.name}`}
            onClick={handleEditClick}
          >
            <Pencil />
          </Button>
          {(store.products?.length === 0 && store.shoppingLists?.length === 0) && (
            <Button
              variant="outline-danger"
              size="sm"
              className="p-1"
              aria-label={`Delete ${store.name}`}
              onClick={handleDeleteClick}
              disabled={isSubmitting}
            >
              <Trash />
            </Button>
          )}
        </div>
      </Card.Footer>

      {/* Map Modal */}
      <Modal show={showMap} onHide={() => setShowMap(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{`${store.name} Map`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MapComponent
            location={{
              id: store.id,
              name: store.name,
              address: store.address1,
            }}
          />
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default StoreCard;
