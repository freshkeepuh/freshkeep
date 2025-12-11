'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ShoppingListCard from '@/components/ShoppingListCard';
import ShoppingListModal from '@/components/ShoppingListModal';

interface ShoppingListItem {
  id: string;
  listId: string;
  name: string;
  image: string | null;
  category: string | null;
  quantity: number;
  isPurchased: boolean;
}

interface ShoppingList {
  id: string;
  name: string;
  isDefault: boolean;
  items: ShoppingListItem[];
}

const DEFAULT_FALLBACK_IMAGE =
  'https://sites.duke.edu/dek23/wp-content/themes/koji/assets/images/default-fallback-image.png';

// Convert ShoppingListItem to the format expected by ShoppingListModal
function convertToGroceryItem(item: ShoppingListItem) {
  return {
    id: item.id,
    groceryItemImage: item.image || DEFAULT_FALLBACK_IMAGE,
    groceryItemTitle: item.name,
    store: '',
    storageType: '',
    groceryItemType: item.category || 'Other',
    inList: true,
    quantity: item.quantity,
  };
}

function ShoppingListPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch shopping lists from API
  const fetchShoppingLists = useCallback(async () => {
    try {
      const response = await fetch('/api/shoppingList');
      if (!response.ok) {
        throw new Error('Failed to fetch shopping lists');
      }
      const data = await response.json();
      setShoppingLists(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching shopping lists:', err);
      setError('Failed to load shopping lists');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShoppingLists();
  }, [fetchShoppingLists]);

  const handleEditList = (list: ShoppingList) => {
    setSelectedList(list);
    setShowModal(true);
  };

  const handleItemAdded = () => {
    // Refresh the list data after adding an item
    fetchShoppingLists();
  };

  if (isLoading) {
    return (
      <Container fluid className="p-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading shopping lists...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="p-5 text-center">
        <h3 className="text-danger">{error}</h3>
        <Button variant="success" onClick={fetchShoppingLists}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="p-5">
      <h1>Shopping List</h1>
      <div
        style={{
          width: '650px',
          height: '75px',
          margin: '0 auto',
        }}
        className="d-flex justify-content-center bg-success p-1 rounded mb-4"
      >
        <Row className="align-items-center justify-content-center py-3" style={{ height: '50px' }}>
          <Col xs="auto" className="ps-1">
            <Button variant="light" href="/catalog">
              Add To List
            </Button>
          </Col>
        </Row>
      </div>

      {/* Shopping List Cards */}
      <Row className="mb-5">
        {shoppingLists.length > 0 ? (
          shoppingLists.map((list) => (
            <Col key={list.id} lg={3} md={6} sm={12} className="mb-4">
              <ShoppingListCard
                listTitle={list.name}
                items={list.items.map((item) => item.name)}
                onEdit={() => handleEditList(list)}
              />
            </Col>
          ))
        ) : (
          <Col className="text-center py-5">
            <h4 className="text-muted">No shopping lists found</h4>
            <p>Create a new shopping list to get started</p>
          </Col>
        )}
      </Row>

      {/* Shopping List Modal */}
      {selectedList && (
        <ShoppingListModal
          show={showModal}
          onHide={() => setShowModal(false)}
          listTitle={selectedList.name}
          listId={selectedList.id}
          items={selectedList.items.map(convertToGroceryItem)}
          onItemAdded={handleItemAdded}
        />
      )}
    </Container>
  );
}

export default ShoppingListPage;
