'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Row, Col } from 'react-bootstrap';
import { Store } from '@prisma/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import StoreCard from '@/components/StoreCard';

const StoresForm = () => {
  const { data: session } = useSession();
  const [stores, setStores] = useState<any[]>([]);
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
    <Container className="d-flex flex-column my-4 justify-content-center align-items-center">
      <Row className="mb-4">
        <Col md={{ span: 8, offset: 2 }}>
          <h1>Stores</h1>
        </Col>
      </Row>

      {stores.length === 0 ? (
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <p>No stores found. Please add a store.</p>
          </Col>
        </Row>
      ) : (
        <Row className="g-3 w-100">
          {stores.map((store) => (
            <Col key={store.id} xs={12} sm={6} md={4} lg={3}>
              <div style={{ background: '#c2edcb', padding: '18px', borderRadius: '5px' }}>
                <StoreCard
                  key={store.id}
                  store={store}
                  onUpdate={async (updatedStore: Store) => {
                    try {
                      setStores((prevStores) => prevStores.map((s) => (s.id === updatedStore.id ? updatedStore : s)));
                    } catch (err) {
                      console.error('Failed to update store:', err);
                    }
                  }}
                  onDelete={async (id) => {
                    try {
                      setStores((prevStores) => prevStores.filter((s) => s.id !== id));
                    } catch (err) {
                      console.error('Failed to delete store:', err);
                    }
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default StoresForm;
