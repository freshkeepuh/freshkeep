'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Row, Col } from 'react-bootstrap';
import { Store } from '@prisma/client';
import LoadingSpinner from './LoadingSpinner';
import { useRouter } from 'next/router';

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
      try {
        setLoading(true);

        // Fetch the store associated with the current user
        const storeResponse = await fetch(`/api/store/${params.id}`);
        if (!storeResponse.ok) {
          const errorText = await storeResponse.text();
          throw new Error(`Failed to fetch store: ${storeResponse.status} - ${errorText}`);
        }
        const storeData = await storeResponse.json();
        setStore(storeData);

        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load store: ${errorMessage}`);
        setStore(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreAndProducts();
  }, [session, params.id]);

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
