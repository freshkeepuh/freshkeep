'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Store } from '@prisma/client';

import { loggedInProtectedPage } from '@/lib/page-protection';
import LoadingSpinner from './LoadingSpinner';

const StoresForm = () => {
  const { data: session } = useSession();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);

        await loggedInProtectedPage(session);

        const response = await fetch('/api/stores');

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
    <Container className="my-4">
      <Row>
        <Col>
          <h1>Stores</h1>
          {stores.length === 0 ? (
            <p>No stores found. Please add a store.</p>
          ) : (
            stores.map((store) => (
              <div key={store.id} className="mb-3 p-3 border rounded">
                <h5>{store.name}</h5>
                <p>{store.address1}</p>
                {store.address2 && <p>{store.address2}</p>}
                <p>
                  {store.city},
                  {store.state}
                  {store.zipcode}
                </p>
                <p>
                  Phone:
                  {store.phone}
                </p>
                <p>
                  Website:
                  {store.website}
                </p>
                <Button variant="primary" href={`/store/${store.id}`}>
                  View Details
                </Button>
              </div>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StoresForm;
