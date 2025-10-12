'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Row, Col } from 'react-bootstrap';
import { Store } from '@prisma/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import StoreCard from '@/components/StoreCard';
import { useRouter } from 'next/navigation';

type StoreFormProps = {
  id: string | null;
};

const StoreForm = ({ id }: StoreFormProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreAndProducts = async () => {
      if (id) {
        const response = await fetch(`/api/store/${id}`, {
          method: 'GET',
        });
        if (response.ok) {
          setStore(await response.json());
        } else {
          setError('Failed to fetch store');
        }
      }
      setLoading(false);
    };
    fetchStoreAndProducts();
  }, [session, id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-danger">
        Error:
        {error}
      </div>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <h1>Store</h1>
          {store ? (
            <StoreCard
              key={store.id}
              store={store}
              onUpdate={async (updatedStore: Store) => {
                const response = await fetch('/api/store', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(updatedStore),
                });
                if (response.ok) {
                  const updated = await response.json();
                  setStore((prevStore) => (prevStore?.id === updated.id ? updated : prevStore));
                } else {
                  setError('Failed to update store');
                }
              }}
              onDelete={async (storeId) => {
                const response = await fetch(`/api/store/${storeId}`, {
                  method: 'DELETE',
                });
                if (response.ok) {
                  router.push('/stores');
                } else {
                  setError('Failed to delete store');
                }
              }}
            />
          ) : (
            <p>No store found.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StoreForm;
