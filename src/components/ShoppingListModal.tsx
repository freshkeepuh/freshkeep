'use client';

import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';

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

const ShoppingListModal = ({ show, onHide, listTitle, items }: ShoppingListModalProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleButtonClick = (itemTitle: string, inList: boolean) => {
    console.log(`${inList ? 'Removing' : 'Adding'} ${itemTitle} ${inList ? 'from' : 'to'} list`);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map((item) => item.id));
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

  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < items.length;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>{listTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <div className="mb-3 text-muted" style={{ fontSize: '14px' }}>
          Showing {items.length} items
        </div>

        <div
          className="bg-success bg-opacity-10 border-bottom border-success border-2 py-3 px-4 mb-3"
          style={{
            display: 'grid',
            gridTemplateColumns: '50px 100px 1fr 140px 140px 140px 120px',
            gap: '20px',
            fontWeight: '600',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#198754',
          }}
        >
          <div className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) {
                  // eslint-disable-next-line no-param-reassign
                  input.indeterminate = someSelected;
                }
              }}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </div>
          <div>Image</div>
          <div>Item Name</div>
          <div>Type</div>
          <div>Storage</div>
          <div>Store</div>
          <div className="text-center">Actions</div>
        </div>

        <div>
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded mb-2 py-3 px-4"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '50px 100px 1fr 140px 140px 140px 120px',
                  gap: '20px',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(25, 135, 84, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                }}
              >
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                  />
                </div>

                <div>
                  <Image
                    src={item.groceryItemImage}
                    alt={item.groceryItemTitle}
                    width={80}
                    height={80}
                    style={{
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef',
                    }}
                  />
                </div>

                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#212529' }}>{item.groceryItemTitle}</div>
                </div>

                <div>
                  <Badge bg="success" className="px-3 py-2">
                    {item.groceryItemType}
                  </Badge>
                </div>

                <div>
                  <Badge bg="secondary" className="px-3 py-2">
                    {item.storageType}
                  </Badge>
                </div>

                <div>
                  <Badge bg="secondary" className="px-3 py-2">
                    {item.store}
                  </Badge>
                </div>

                <div className="text-center">
                  <Button
                    variant={item.inList ? 'outline-danger' : 'success'}
                    size="sm"
                    onClick={() => handleButtonClick(item.groceryItemTitle, item.inList)}
                    style={{ width: '100px' }}
                  >
                    {item.inList ? 'Remove' : 'Add'}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-muted">
              <h5>No items in this list</h5>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShoppingListModal;
