'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Row, Col } from 'react-bootstrap';
import { Store } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import LoadingSpinner from './LoadingSpinner';

type StoreFormProps = {
  id: string | null;
};

const StoreForm = ({ id }: StoreFormProps) => {
  const { data: session } = useSession();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreAndProducts = async () => {
      try {
        setLoading(true);

        await loggedInProtectedPage(session);

        // Fetch the store associated with the current user
        const storeResponse = await fetch(`/api/store?id=${id}`);
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
          <h1>Your Store</h1>
          {store ? (
            <div>
              <h2>{store.name}</h2>
            </div>
          ) : (
            <p>No store found.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StoreForm;
