'use client';

import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';

const ShoppingListPage = () => {
  const samplegroceryItems = [
    {
      id: 'groceryItem-1',
      groceryItemImage: 'https://images.cdn.shop.foodland.com/detail/4011.jpg',
      groceryItemTitle: 'Bananas',
      store: 'Foodland',
      storageType: 'Counter',
      groceryItemType: 'Fruit',
      inList: true,
    },
    {
      id: 'groceryItem-2',
      groceryItemImage: 'https://bit.ly/464OM4c',
      groceryItemTitle: 'Greek Yogurt',
      store: 'Walmart',
      storageType: 'Refrigerator',
      groceryItemType: 'Dairy',
      inList: true,
    },
    {
      id: 'groceryItem-3',
      groceryItemImage:
        'https://target.scene7.com/is/image/Target/GUEST_ed5b1220-2654-467f-bb70-0a4ad8fe9c13?wid=750&qlt=80',
      groceryItemTitle: 'Whole Wheat Bread',
      store: 'Target',
      storageType: 'Pantry',
      groceryItemType: 'Bakery',
      inList: true,
    },
    {
      id: 'groceryItem-5',
      groceryItemImage: 'https://bit.ly/4npYvJI',
      groceryItemTitle: 'Garlic Powder',
      store: 'Walmart',
      storageType: 'Spice Rack',
      groceryItemType: 'Spices',
      inList: true,
    },
    {
      id: 'groceryItem-6',
      groceryItemImage:
        'https://target.scene7.com/is/image/Target/GUEST_ea9257fa-2303-4444-b10f-57e2937a1b4e?wid=750&qlt=80',
      groceryItemTitle: 'Chicken Breast',
      store: 'Foodland',
      storageType: 'Refrigerator',
      groceryItemType: 'Meat',
      inList: true,
    },
    {
      id: 'groceryItem-7',
      groceryItemImage:
        'https://target.scene7.com/is/image/Target/GUEST_5ae5aa78-6d3d-4691-add6-e74acd3c45d4?wid=750&qlt=80',
      groceryItemTitle: 'Pasta',
      store: 'Target',
      storageType: 'Pantry',
      groceryItemType: 'Grain',
      inList: true,
    },
    {
      id: 'groceryItem-8',
      groceryItemImage: 'https://target.scene7.com/is/image/Target/GUEST_8cc36efc-6e13-4cd6-aac4-dc0d79de2851',
      groceryItemTitle: 'Oreos',
      store: 'Walmart',
      storageType: 'Pantry',
      groceryItemType: 'Snacks',
      inList: true,
    },
  ];

  const handleButtonClick = (itemTitle: string, inList: boolean) => {
    console.log(`${inList ? 'Removing' : 'Adding'} ${itemTitle} ${inList ? 'from' : 'to'} list`);
  };

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
          <Col xs="auto" className="px-1">
            <Form.Control type="search" placeholder="Search Grocery Item" style={{ width: '400px' }} />
          </Col>
          <Col xs="auto" className="ps-1">
            <Button variant="light">Filters</Button>
          </Col>
          <Col xs="auto" className="ps-1">
            <Button variant="light" href="/catalog">
              Add To List
            </Button>
          </Col>
        </Row>
      </div>

      <div
        className="bg-success bg-opacity-10 border-bottom border-success border-2 py-3 px-4 mb-3"
        style={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr 140px 140px 140px 120px',
          gap: '20px',
          fontWeight: '600',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: '#198754',
        }}
      >
        <div>Image</div>
        <div>Item Name</div>
        <div>Type</div>
        <div>Storage</div>
        <div>Store</div>
        <div className="text-center">Actions</div>
      </div>

      {/* Table Rows */}
      <div>
        {samplegroceryItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded mb-2 py-3 px-4"
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr 140px 140px 140px 120px',
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
        ))}
      </div>
    </Container>
  );
};

export default ShoppingListPage;
