'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { Store } from '@prisma/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import StoreCard from '@/components/StoreCard';
import StoreShoppingLists from '@/components/StoreShoppingLists';

const StoreForm = ({ params }: { params: { id: string } }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [store, setStore] = useState<any | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreAndProducts = async () => {
      try {
        setLoading(true);
        const storeResponse = await fetch(`/api/store/${params.id}`);
        if (!storeResponse.ok) {
          throw new Error(storeResponse.status.toString());
        }
        const storeData = await storeResponse.json();
        setStore(storeData);

        setError(null);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(` Failed to load store: ${errorMessage}`);
        } else {
          setError(null);
        }
        setStore(undefined);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreAndProducts();
  }, [session, params.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="my-4">
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <h1>Store</h1>
          {store ? (
            <>
              {error && <p className="text-danger">{error}</p>}
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
                    const response2 = await fetch(`/api/store/${updatedStore.id}`);
                    if (!response2.ok) {
                      setError('Failed to fetch updated store');
                      return;
                    }
                    const updated = await response2.json();
                    setStore(updated);
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
            </>
          ) : (
            <>
              {error && <p className="text-danger">{error}</p>}
              <p>No store found.</p>
            </>
          )}
        </Col>
        <Col>
          <StoreShoppingLists shoppingLists={store?.shoppingLists} />
        </Col>
      </Row>
    </Container>
  );
};

export default StoreForm;
