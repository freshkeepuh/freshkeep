'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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

  const handleCreateList = async () => {
    if (!newListName.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/shoppingList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName.trim() }),
      });

      if (response.ok) {
        const newList = await response.json();
        // Ensure items array exists (API doesn't return items for new lists)
        const listWithItems = { ...newList, items: newList.items || [] };
        setShoppingLists([...shoppingLists, listWithItems]);
        setNewListName('');
        setShowCreateModal(false);
        // Open the new list in edit mode with catalog tab
        setSelectedList(listWithItems);
        setShowModal(true);
      } else {
        console.error('Failed to create shopping list');
      }
    } catch (err) {
      console.error('Error creating shopping list:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!confirm('Are you sure you want to delete this shopping list?')) return;

    setIsDeleting(listId);
    try {
      const response = await fetch(`/api/shoppingList/${listId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShoppingLists(shoppingLists.filter((list) => list.id !== listId));
      } else {
        console.error('Failed to delete shopping list');
      }
    } catch (err) {
      console.error('Error deleting shopping list:', err);
    } finally {
      setIsDeleting(null);
    }
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
            <Button variant="light" onClick={() => setShowCreateModal(true)}>
              + Create Shopping List
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
                onDelete={() => handleDeleteList(list.id)}
                isDeleting={isDeleting === list.id}
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

      {/* Create Shopping List Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Create Shopping List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>List Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter list name (e.g., Weekly Groceries)"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateList();
                }
              }}
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleCreateList} disabled={isCreating || !newListName.trim()}>
            {isCreating ? <Spinner animation="border" size="sm" /> : 'Create List'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Shopping List Modal */}
      {selectedList && (
        <ShoppingListModal
          show={showModal}
          onHide={() => setShowModal(false)}
          listTitle={selectedList.name}
          listId={selectedList.id}
          items={selectedList.items.map(convertToGroceryItem)}
          onItemAdded={handleItemAdded}
          defaultTab={selectedList.items.length === 0 ? 'catalog' : 'list'}
        />
      )}
    </Container>
  );
}

export default ShoppingListPage;
