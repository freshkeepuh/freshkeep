'use client';

import { useState, useEffect, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Spinner from 'react-bootstrap/Spinner';
import styles from './ShoppingListModal.module.css';

const DEFAULT_FALLBACK_IMAGE =
  'https://sites.duke.edu/dek23/wp-content/themes/koji/assets/images/default-fallback-image.png';

interface GroceryItem {
  id: string;
  groceryItemImage: string;
  groceryItemTitle: string;
  store: string;
  storageType: string;
  groceryItemType: string;
  inList: boolean;
  quantity?: number;
}

interface CatalogItem {
  id: string;
  name: string;
  image: string;
  category: string;
  brand: string;
}

// Quick category buttons for browsing
const categoryButtons = [
  { label: '🥛 Dairy', query: 'milk cheese yogurt' },
  { label: '🍞 Bread', query: 'bread' },
  { label: '🥚 Eggs', query: 'eggs' },
  { label: '🍎 Fruits', query: 'apple orange banana' },
  { label: '🥬 Vegetables', query: 'lettuce tomato carrot' },
  { label: '🥩 Meat', query: 'chicken beef pork' },
  { label: '🥣 Cereal', query: 'cereal oatmeal' },
  { label: '🥤 Beverages', query: 'juice soda water' },
  { label: '🍝 Pasta', query: 'pasta spaghetti' },
  { label: '🍪 Snacks', query: 'chips cookies crackers' },
];

interface ShoppingListModalProps {
  show: boolean;
  onHide: () => void;
  listTitle: string;
  listId: string;
  items: GroceryItem[];
  onItemAdded?: () => void;
  defaultTab?: 'list' | 'catalog';
}

function ShoppingListModal({
  show,
  onHide,
  listTitle,
  listId,
  items,
  onItemAdded = undefined,
  defaultTab = 'list',
}: ShoppingListModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [catalogSearchTerm, setCatalogSearchTerm] = useState('');
  const [addedToList, setAddedToList] = useState<string[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>(
    {},
  );
  const [isAdding, setIsAdding] = useState<string | null>(null);

  // Reset active tab when modal opens with different default
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab, show]);

  // Initialize quantities from passed items
  useEffect(() => {
    const initialQuantities: Record<string, number> = {};
    items.forEach((item) => {
      if (item.quantity) {
        initialQuantities[item.id] = item.quantity;
      }
    });
    setItemQuantities((prev) => ({ ...initialQuantities, ...prev }));
  }, [items]);

  // Get quantity for an item (default to 1)
  const getQuantity = (itemId: string) => itemQuantities[itemId] || 1;

  // Update quantity for an item
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItemQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));
  };

  // Add item to shopping list via API
  const addItemToList = async (item: CatalogItem) => {
    setIsAdding(item.id);
    try {
      const response = await fetch('/api/shoppingList/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listId,
          name: item.name,
          image: item.image,
          category: item.category,
          quantity: getQuantity(item.id),
        }),
      });

      if (response.ok) {
        setAddedToList([...addedToList, item.id]);
        onItemAdded?.();
      } else if (response.status === 409) {
        // Item already exists, still mark as added
        setAddedToList([...addedToList, item.id]);
      } else {
        console.error('Failed to add item to list');
      }
    } catch (error) {
      console.error('Error adding item to list:', error);
    } finally {
      setIsAdding(null);
    }
  };

  // Debounced search function
  const searchProducts = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setCatalogItems([]);
      setHasSearched(false);
      setSearchError(null);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setSearchError(null);
    try {
      const response = await fetch(
        `/api/products/search?q=${encodeURIComponent(query)}`,
      );
      if (response.ok) {
        const data = await response.json();
        setCatalogItems(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSearchError(errorData.error || 'Search failed. Please try again.');
        setCatalogItems([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchError(
        'Network error. Please check your connection and try again.',
      );
      setCatalogItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle search button click
  const handleSearch = () => {
    if (catalogSearchTerm.trim().length >= 2) {
      searchProducts(catalogSearchTerm);
    }
  };

  const handleButtonClick = (itemTitle: string, inList: boolean) => {
    console.log(
      `${inList ? 'Removing' : 'Adding'} ${itemTitle} ${inList ? 'from' : 'to'} list`,
    );
  };

  const filteredItems = items.filter((item) =>
    item.groceryItemTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const allSelected =
    filteredItems.length > 0 && selectedItems.length === filteredItems.length;
  const someSelected =
    selectedItems.length > 0 && selectedItems.length < filteredItems.length;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      dialogClassName={styles.modal80w}
    >
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>{listTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: 0 }}>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab((k as 'list' | 'catalog') || 'list')}
          className="mb-0"
          style={{
            padding: '0 1rem',
            paddingTop: '0.5rem',
            backgroundColor: '#f8f9fa',
          }}
        >
          <Tab eventKey="list" title="📋 My List">
            <div style={{ padding: '1rem 1.5rem' }}>
              <Form.Control
                type="search"
                placeholder="Search items in list..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
              <div className="mt-2 text-muted" style={{ fontSize: '14px' }}>
                Showing {filteredItems.length} of {items.length} items
              </div>
            </div>

            <div className="card mx-3 mb-3">
              <div className="card-body p-0">
                <div
                  className="bg-success bg-opacity-10 border-bottom border-success border-2 py-2"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 80px 1fr 120px 100px 90px',
                    gap: '12px',
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    fontWeight: '600',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#198754',
                    backgroundColor: 'rgba(209, 231, 221, 0.95)',
                  }}
                >
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      checked={allSelected}
                      ref={(input: HTMLInputElement | null) => {
                        if (input) {
                          // eslint-disable-next-line no-param-reassign
                          input.indeterminate = someSelected;
                        }
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      aria-label="Select all items"
                    />
                  </div>
                  <div>Image</div>
                  <div>Product Name</div>
                  <div>Category</div>
                  <div>Quantity</div>
                  <div className="text-center">Actions</div>
                </div>

                <div style={{ height: '45vh', overflowY: 'auto' }}>
                  <div className="px-3 py-2">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white border rounded mb-2 py-2 px-3"
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              '40px 80px 1fr 120px 100px 90px',
                            gap: '12px',
                            alignItems: 'center',
                            transition: 'all 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                            e.currentTarget.style.boxShadow =
                              '0 2px 8px rgba(25, 135, 84, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.boxShadow =
                              '0 1px 3px rgba(0,0,0,0.05)';
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <Form.Check
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={(e) =>
                                handleSelectItem(item.id, e.target.checked)
                              }
                              aria-label={`Select ${item.groceryItemTitle}`}
                            />
                          </div>

                          <div>
                            <Image
                              src={
                                item.groceryItemImage || DEFAULT_FALLBACK_IMAGE
                              }
                              alt={item.groceryItemTitle}
                              width={60}
                              height={60}
                              style={{
                                objectFit: 'cover',
                                borderRadius: '6px',
                                border: '1px solid #e9ecef',
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  DEFAULT_FALLBACK_IMAGE;
                              }}
                            />
                          </div>

                          <div>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#212529',
                              }}
                            >
                              {item.groceryItemTitle}
                            </div>
                          </div>

                          <div>
                            <Badge
                              bg="success"
                              className="px-2 py-1"
                              style={{ fontSize: '11px' }}
                            >
                              {item.groceryItemType}
                            </Badge>
                          </div>

                          <div>
                            <div
                              className="d-flex align-items-center rounded-pill overflow-hidden"
                              style={{
                                border: '1px solid #dee2e6',
                                width: 'fit-content',
                              }}
                            >
                              <Button
                                variant="light"
                                size="sm"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    getQuantity(item.id) - 1,
                                  )
                                }
                                className="border-0 px-2 py-1 rounded-0"
                                style={{
                                  fontSize: '14px',
                                  color: 'var(--bs-danger)',
                                }}
                                disabled={getQuantity(item.id) <= 1}
                              >
                                −
                              </Button>
                              <span
                                className="px-2 fw-bold text-center"
                                style={{ fontSize: '13px', minWidth: '30px' }}
                              >
                                {getQuantity(item.id)}
                              </span>
                              <Button
                                variant="light"
                                size="sm"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    getQuantity(item.id) + 1,
                                  )
                                }
                                className="border-0 px-2 py-1 rounded-0"
                                style={{
                                  fontSize: '14px',
                                  color: 'var(--bs-success)',
                                }}
                              >
                                +
                              </Button>
                            </div>
                          </div>

                          <div className="text-center">
                            <Button
                              variant={
                                item.inList ? 'outline-danger' : 'success'
                              }
                              size="sm"
                              onClick={() =>
                                handleButtonClick(
                                  item.groceryItemTitle,
                                  item.inList,
                                )
                              }
                              style={{
                                width: '80px',
                                fontSize: '12px',
                                padding: '4px 8px',
                              }}
                            >
                              {item.inList ? 'Remove' : 'Add'}
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-5 text-muted">
                        <h5>No items found</h5>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Tab>

          <Tab eventKey="catalog" title="🛒 Catalog">
            <div style={{ padding: '1rem 1.5rem' }}>
              <div className="d-flex gap-2" style={{ maxWidth: '500px' }}>
                <Form.Control
                  type="text"
                  placeholder="Search products (e.g., milk, bread, eggs)..."
                  value={catalogSearchTerm}
                  onChange={(e) => setCatalogSearchTerm(e.target.value)}
                  style={{ flex: 1 }}
                />
                <Button
                  variant="success"
                  onClick={handleSearch}
                  disabled={isLoading || catalogSearchTerm.trim().length < 2}
                >
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
              <div className="mt-2 d-flex flex-wrap gap-1">
                {categoryButtons.map((cat) => (
                  <Button
                    key={cat.label}
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      setCatalogSearchTerm(cat.query);
                      searchProducts(cat.query);
                    }}
                    style={{ fontSize: '12px' }}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
              <div className="mt-2 text-muted" style={{ fontSize: '14px' }}>
                {/* eslint-disable-next-line no-nested-ternary */}
                {isLoading
                  ? 'Searching catalog... (this may take up to 30 seconds)'
                  : catalogItems.length > 0
                    ? `Showing ${catalogItems.length} products`
                    : 'Search for products to add to your list'}
              </div>
            </div>

            <div className="card mx-3 mb-3">
              <div className="card-body p-0">
                <div
                  className="bg-primary bg-opacity-10 border-bottom border-primary border-2 py-2"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 120px 100px',
                    gap: '12px',
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    fontWeight: '600',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#0d6efd',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                  }}
                >
                  <div>Image</div>
                  <div>Product Name</div>
                  <div>Category</div>
                  <div className="text-center">Actions</div>
                </div>

                <div style={{ height: '40vh', overflowY: 'auto' }}>
                  {/* eslint-disable no-nested-ternary */}
                  <div className="px-3 py-2">
                    {isLoading ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Searching products...</p>
                      </div>
                    ) : catalogItems.length > 0 ? (
                      catalogItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white border rounded mb-2 py-2 px-3"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '80px 1fr 120px 100px',
                            gap: '12px',
                            alignItems: 'center',
                            transition: 'all 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                            e.currentTarget.style.boxShadow =
                              '0 2px 8px rgba(13, 110, 253, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.boxShadow =
                              '0 1px 3px rgba(0,0,0,0.05)';
                          }}
                        >
                          <div>
                            <Image
                              src={item.image || DEFAULT_FALLBACK_IMAGE}
                              alt={item.name}
                              width={60}
                              height={60}
                              style={{
                                objectFit: 'cover',
                                borderRadius: '6px',
                                border: '1px solid #e9ecef',
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  DEFAULT_FALLBACK_IMAGE;
                              }}
                            />
                          </div>

                          <div>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#212529',
                              }}
                            >
                              {item.name}
                            </div>
                          </div>

                          <div>
                            <Badge
                              bg="info"
                              className="px-2 py-1"
                              style={{ fontSize: '11px' }}
                            >
                              {item.category}
                            </Badge>
                          </div>

                          <div className="text-center">
                            <Button
                              variant={
                                addedToList.includes(item.id)
                                  ? 'outline-success'
                                  : 'success'
                              }
                              size="sm"
                              disabled={
                                addedToList.includes(item.id) ||
                                isAdding === item.id
                              }
                              onClick={() => addItemToList(item)}
                              style={{
                                width: '80px',
                                fontSize: '12px',
                                padding: '4px 8px',
                              }}
                            >
                              {isAdding === item.id ? (
                                <Spinner animation="border" size="sm" />
                              ) : addedToList.includes(item.id) ? (
                                '✓ Added'
                              ) : (
                                'Add'
                              )}
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : hasSearched ? (
                      searchError ? (
                        <div className="text-center py-5 text-danger">
                          <h5>Search Error</h5>
                          <p>{searchError}</p>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => searchProducts(catalogSearchTerm)}
                          >
                            Try Again
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-5 text-muted">
                          <h5>No products found</h5>
                          <p>Try a different search term</p>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-5 text-muted">
                        <h5>Search for products</h5>
                        <p>Type in the search bar or click a category above</p>
                      </div>
                    )}
                  </div>
                  {/* eslint-enable no-nested-ternary */}
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ShoppingListModal;
