'use client';

import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import GroceryItemCard from '../../components/GroceryItemCard';

const ShoppingListPage = () => {
  // Sample groceryItem data
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

  return (
    <Container fluid className="p-5">
      <h1>Shopping List</h1>
      <div
        style={{
          width: '650px',
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
            <Button variant="light" href="/store">
              Add To List
            </Button>
          </Col>
        </Row>
      </div>

      <Row>
        {samplegroceryItems.map((groceryItem) => (
          <Col key={groceryItem.id} lg={3} md={4} sm={6} className="mb-4">
            <GroceryItemCard
              groceryItemImage={groceryItem.groceryItemImage}
              groceryItemTitle={groceryItem.groceryItemTitle}
              store={groceryItem.store}
              storageType={groceryItem.storageType}
              groceryItemType={groceryItem.groceryItemType}
              inList={groceryItem.inList}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ShoppingListPage;
