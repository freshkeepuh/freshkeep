'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Store, Product } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import LoadingSpinner from './LoadingSpinner';
import { useSearchParams } from 'next/navigation';
  
type StoreFormProps = {
  id: string | null;
};

const StoreForm = ({ id }: StoreFormProps) => {
  const { data: session } = useSession();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreAndProducts = async () => {
      try {
        setLoading(true);

        await loggedInProtectedPage(session);

        const searchParams = useSearchParams();
        if (!searchParams.get('id')) {
          throw new Error('Missing required parameter: id');
        }
        // Fetch the store associated with the current user
        const storeResponse = await fetch(`/api/store?id=${id}`);
        if (!storeResponse.ok) {
          const errorText = await storeResponse.text();
          throw new Error(`Failed to fetch store: ${storeResponse.status} - ${errorText}`);
        }
        const storeData = await storeResponse.json();
        setStore(storeData);

        if (storeData && storeData.id) {
          // Fetch products for the retrieved store
          const productsResponse = await fetch(`/api/products?storeId=${storeData.id}`);
          if (!productsResponse.ok) {
            const errorText = await productsResponse.text();
            throw new Error(`Failed to fetch products: ${productsResponse.status} - ${errorText}`);
          }
          const productsData = await productsResponse.json();
          setProducts(productsData);
        } else {
          setProducts([]);
        }

        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load store or products: ${errorMessage}`);
        setStore(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAndProducts();
  }, [session]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-danger">Error: {error}</div>;
  }

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <h1>Your Store</h1>
          {store ? (
            <div>
              <h2>{store.name}</h2>
              <h3>Products</h3>
              {products.length === 0 ? (
                <p>No products found for this store.</p>
              ) : (
                <ul>
                  {products.map((product) => (
                    <li key={product.id}>
                      {product.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p>No store found for your account.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StoreForm;
