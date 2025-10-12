'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Store } from '@prisma/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import StoreCard from '@/components/StoreCard';

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
                    onUpdate={async (updatedStore: Store) => {
                      try {
                        setStores((prevStores) => prevStores.map((s) => (s.id === updatedStore.id ? updatedStore : s)));
                      } catch (error) {
                        console.error('Failed to update store:', error);
                      }
                    }}
                    onDelete={async (id) => {
                      try {
                        setStores((prevStores) => prevStores.filter((s) => s.id !== id));
                      } catch (error) {
                        console.error('Failed to delete store:', error);
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
