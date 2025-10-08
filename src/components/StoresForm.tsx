'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Store } from '@prisma/client';

import LoadingSpinner from './LoadingSpinner';
import StoreCard from './StoreCard';

const StoresForm = () => {
  const { data: session } = useSession();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/store');

        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        setStores(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [session]);

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
    <Container className="d-flex flex-row my-4">
      <Row>
        <Col>
          <h1>Stores</h1>
          {stores.length === 0 ? (
            <p>No stores found. Please add a store.</p>
          ) : (
            <ListGroup horizontal>
              {stores.map((store) => (
                <ListGroup.Item key={store.id} className="m-2">
                  <StoreCard
                    key={store.id}
                    store={store}
                    onSave={async (updatedStore) => {
                      const response = await fetch('/api/store', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedStore),
                      });
                      if (response.ok) {
                        const updated = await response.json();
                        setStores((prevStores) => prevStores.map((s) => (s.id === updated.id ? updated : s)));
                      } else {
                        setError('Failed to update store');
                      }
                    }}
                    onDelete={async (id) => {
                      const response = await fetch(`/api/store/${id}`, {
                        method: 'DELETE',
                      });
                      if (response.ok) {
                        setStores((prevStores) => prevStores.filter((s) => s.id !== id));
                      } else {
                        setError('Failed to delete store');
                      }
                    }}
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StoresForm;
