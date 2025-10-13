'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Form, Image, Card } from 'react-bootstrap';
import { Pencil, Trash, Check, X } from 'react-bootstrap-icons';
import { Store, Country } from '@prisma/client';
import { useForm, UseFormRegister } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AddressSubForm, { IAddressSubForm } from '@/components/AddressSubForm';
import { storeValidation } from '@/lib/validationSchemas';

// Helper to extract address fields from a Store object
const getStoreAddress = (store: Store): IAddressSubForm => ({
  address1: store.address1 ?? '',
  address2: store.address2 ?? '',
  city: store.city ?? '',
  state: store.state ?? '',
  zipcode: store.zipcode ?? '',
  country: store.country ?? undefined,
});

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

interface StoreCardProps {
  store: any;
  onUpdate: (updatedStore: any) => void;
  onDelete: (id: string) => void;
}

const StoreCard = ({ store, onUpdate, onDelete }: StoreCardProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IStoreForm>({
    resolver: yupResolver(storeValidation),
    defaultValues: { ...store },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    try {
      setIsSubmitting(true);
      clearErrors();
      setIsEditing(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async () => {
    try {
      setIsSubmitting(true);
      clearErrors();
      const response = await fetch(`/api/store/${store.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onDelete(store.id);
        setIsEditing(false);
      } else {
        setError('name', { type: 'manual', message: 'Failed to delete store' });
      }
    } catch (error) {
      setError('name', { type: 'manual', message: 'Failed to delete store. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveClick = async () => {
    try {
      setIsSubmitting(true);
      const body = JSON.stringify({ ...register });
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
        setError('name', { type: 'manual', message: 'Failed to update store' });
      }
    } catch (error) {
      setError('name', { type: 'manual', message: 'Failed to save changes. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    try {
      setIsSubmitting(true);
      clearErrors();
      reset({ ...store }); // Reset form to store values when cancelling
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <Form onSubmit={handleSubmit(handleSaveClick)}>
        <Card>
          <Card.Body>
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
              initialAddress={getStoreAddress(store)}
              showEdit={isEditing}
              onSave={() => { }}
              onCancel={(storeAddress) => {
                reset({ ...storeAddress });
              }}
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
            register={register as unknown as UseFormRegister<IAddressSubForm>}
            errors={errors}
            initialAddress={getStoreAddress(store)}
            showEdit={isEditing}
          />
        </Card.Text>
        <Card.Text className="text-muted small mb-6">
          <strong>Phone: </strong>
          {store.phone}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end">
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
    </Card>
  );
};

export default StoreCard;
