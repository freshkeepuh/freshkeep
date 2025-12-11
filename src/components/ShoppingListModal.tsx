'use client';

import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import styles from './ShoppingListModal.module.css';

interface GroceryItem {
  id: string;
  groceryItemImage: string;
  groceryItemTitle: string;
  store: string;
  storageType: string;
  groceryItemType: string;
  inList: boolean;
}

interface ShoppingListModalProps {
  show: boolean;
  onHide: () => void;
  listTitle: string;
  items: GroceryItem[];
}

function ShoppingListModal({
  show,
  onHide,
  listTitle,
  items,
}: ShoppingListModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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
      <Modal.Body>
        <div style={{ padding: '1rem 1.5rem' }}>
          <Form.Control
            type="search"
            placeholder="Search items..."
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
                gridTemplateColumns: '40px 80px 1fr 100px 100px 100px 90px',
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
              <div>Item Name</div>
              <div>Type</div>
              <div>Storage</div>
              <div>Store</div>
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
                          '40px 80px 1fr 100px 100px 100px 90px',
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
                          src={item.groceryItemImage}
                          alt={item.groceryItemTitle}
                          width={60}
                          height={60}
                          style={{
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: '1px solid #e9ecef',
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
                        <Badge
                          bg="secondary"
                          className="px-2 py-1"
                          style={{ fontSize: '11px' }}
                        >
                          {item.storageType}
                        </Badge>
                      </div>

                      <div>
                        <Badge
                          bg="secondary"
                          className="px-2 py-1"
                          style={{ fontSize: '11px' }}
                        >
                          {item.store}
                        </Badge>
                      </div>

                      <div className="text-center">
                        <Button
                          variant={item.inList ? 'outline-danger' : 'success'}
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
