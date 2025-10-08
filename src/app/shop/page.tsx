'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import GroceryItemCard from '../../components/GroceryItemCard';

// Define the type for your shop model data
interface ShopItem {
  id: string;
  name: string;
  soldAt: string;
  category: string;
  userId: string;
}

const ShopPage = () => {
  const { data: session, status } = useSession();
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current user email from session (use email as identifier)
  const currentUserId = session?.user?.id;

  useEffect(() => {
    const fetchShopItems = async () => {
      if (!currentUserId) return; // Don't fetch if no user

      try {
        setLoading(true);
        console.log('Fetching shop items for user:', currentUserId);

        const response = await fetch(`/api/shop/${currentUserId}`);
        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          throw new Error(`Failed to fetch shop items: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        setShopItems(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching shop items:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load shop items: ${errorMessage}`);
        setShopItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'loading') return; // Still loading session
    fetchShopItems();
  }, [currentUserId, status]);

  // Map shop model data to GroceryItemCard props
  const mapShopItemToCardProps = (shopItem: ShopItem) => ({
    groceryItemImage: 'https://images.cdn.shop.foodland.com/detail/4011.jpg', // Hardcoded placeholder
    groceryItemTitle: shopItem.name,
    store: shopItem.soldAt,
    storageType: 'Pantry', // Hardcoded
    groceryItemType: shopItem.category,
    inList: false, // Hardcoded
  });

  // Show loading while session is loading
  if (status === 'loading') {
    return (
      <Container fluid className="p-5">
        <h1>Shop</h1>
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
        <h1>Shop</h1>
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-person-circle" style={{ fontSize: '4rem', color: '#6c757d' }} />
          </div>
          <h3 className="text-muted">Please sign in to view your grocery items</h3>
          <p className="text-muted mb-4">You need to be logged in to access your personal shop.</p>
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
        <h1>Shop</h1>
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
        <h1>Shop</h1>
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
      <h1>Shop</h1>
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
            <Form.Control type="search" placeholder="Search groceryItems..." style={{ width: '400px' }} />
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
            <Button variant="light" href="/createGroceryItem">
              Add to Shop
            </Button>
          </Col>
        </Row>
      </div>

      {shopItems.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-basket" style={{ fontSize: '4rem', color: '#6c757d' }} />
          </div>
          <h3 className="text-muted">No items found</h3>
          <p className="text-muted mb-4">You haven&apos;t added any grocery items yet.</p>
          <Button variant="success" href="/createGroceryItem" size="lg">
            <i className="bi bi-plus-circle me-2" />
            Add Your First Item
          </Button>
        </div>
      ) : (
        <Row>
          {shopItems.map((shopItem) => {
            const cardProps = mapShopItemToCardProps(shopItem);
            return (
              <Col key={shopItem.id} lg={3} md={4} sm={6} className="mb-4">
                <GroceryItemCard
                  groceryItemImage={cardProps.groceryItemImage}
                  groceryItemTitle={cardProps.groceryItemTitle}
                  store={cardProps.store}
                  storageType={cardProps.storageType}
                  groceryItemType={cardProps.groceryItemType}
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

export default ShopPage;
