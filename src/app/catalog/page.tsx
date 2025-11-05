'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CatalogItemCard from '../../components/CatalogItemCard';

// Update the interface to match the actual API response
interface CatalogItem {
  id: string;
  name: string;
  storeName: string;
  stores: string[];
  category: string;
  userId: string;
  picture: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

const CatalogPage = () => {
  const { data: session, status } = useSession();
  const [CatalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current user ID from session
  const currentUserId = session?.user?.id;

  useEffect(() => {
    const fetchCatalogItems = async () => {
      if (!currentUserId) return;

      try {
        setLoading(true);
        console.log('Fetching catalog items for user:', currentUserId);

        const response = await fetch(`/api/catalog/${currentUserId}`);
        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          throw new Error(`Failed to fetch catalog items: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        setCatalogItems(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching catalog items:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load catalog items: ${errorMessage}`);
        setCatalogItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'loading') return;
    fetchCatalogItems();
  }, [currentUserId, status]);

  const mapCatalogItemToCardProps = (CatalogItem: CatalogItem) => ({
    catalogItemImage: CatalogItem.picture || 'http://bit.ly/4q71ybS',
    catalogItemTitle: CatalogItem.name,
    storeName: CatalogItem.storeName || 'Unknown Store',
    storageType: 'Pantry',
    catalogItemType: CatalogItem.category,
    inList: false, // Since isNeeded is not in the flattened structure
  });

  // Show loading while session is loading
  if (status === 'loading') {
    return (
      <Container fluid className="p-5">
        <h1>Catalog</h1>
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading...</p>
        </div>
      </Container>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!session) {
    return (
      <Container fluid className="p-5">
        <h1>Catalog</h1>
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-person-circle" style={{ fontSize: '4rem', color: '#6c757d' }} />
          </div>
          <h3 className="text-muted">Please sign in to view your products</h3>
          <p className="text-muted mb-4">You need to be logged in to access your personal catalog.</p>
          <Button variant="success" href="/api/auth/signin" size="lg">
            <i className="bi bi-box-arrow-in-right me-2" />
            Sign In
          </Button>
        </div>
      </Container>
    );
  }

  // Show loading while fetching data
  if (loading) {
    return (
      <Container fluid className="p-5">
        <h1>Catalog</h1>
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your items...</p>
        </div>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container fluid className="p-5">
        <h1>Catalog</h1>
        <div className="text-center py-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Oops! Something went wrong</h4>
            <p>{error}</p>
            <hr />
            <Button variant="outline-danger" onClick={() => window.location.reload()} type="button">
              Try Again
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-5">
      <h1>Catalog</h1>
      <div
        style={{
          width: '800px',
          height: '75px',
          margin: '0 auto',
        }}
        className="d-flex justify-content-center bg-success p-1 rounded mb-4 "
      >
        <Row className=" align-items-center justify-content-center py-3" style={{ height: '50px' }}>
          <Col xs="auto" className="px-1">
            <Form.Control type="search" placeholder="Search catalogItems..." style={{ width: '400px' }} />
          </Col>
          <Col xs="auto" className="ps-1">
            <Button variant="light">Filters</Button>
          </Col>
          <Col xs="auto" className="ps-1">
            <Button variant="light" href="/shoppingList">
              Shopping List
            </Button>
          </Col>
          <Col xs="auto" className="ps-1">
            <Button variant="light" href="/createCatalogItem">
              Add to Catalog
            </Button>
          </Col>
        </Row>
      </div>

      {CatalogItems.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-basket" style={{ fontSize: '4rem', color: '#6c757d' }} />
          </div>
          <h3 className="text-muted">No items found</h3>
          <p className="text-muted mb-4">You haven&apos;t added any products yet.</p>
          <Button variant="success" href="/createCatalogItem" size="lg">
            <i className="bi bi-plus-circle me-2" />
            Add Your First Product
          </Button>
        </div>
      ) : (
        <Row>
          {CatalogItems.map((CatalogItem) => {
            const cardProps = mapCatalogItemToCardProps(CatalogItem);
            return (
              <Col key={CatalogItem.id} lg={3} md={4} sm={6} className="mb-4">
                <CatalogItemCard
                  picture={cardProps.catalogItemImage}
                  catalogItemTitle={cardProps.catalogItemTitle}
                  storeName={cardProps.storeName}
                  storageType={cardProps.storageType}
                  catalogItemType={cardProps.catalogItemType}
                  inList={cardProps.inList}
                />
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default CatalogPage;
