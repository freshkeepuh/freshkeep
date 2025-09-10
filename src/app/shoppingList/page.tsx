'use client';

import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ProductCard from '../../components/ProductCard';

const ShoppingListPage = () => {
  // Sample product data
  const sampleProducts = [
    {
      id: 'product-1',
      productImage: 'https://images.cdn.shop.foodland.com/detail/4011.jpg',
      productTitle: 'Bananas',
      store: 'Foodland',
      storageType: 'Counter',
      productType: 'Fruit',
      inList: false,
    },
    {
      id: 'product-2',
      productImage: 'https://bit.ly/464OM4c',
      productTitle: 'Greek Yogurt',
      store: 'Walmart',
      storageType: 'Refrigerator',
      productType: 'Dairy',
      inList: true,
    },
    {
      id: 'product-3',
      productImage:
        'https://target.scene7.com/is/image/Target/GUEST_ed5b1220-2654-467f-bb70-0a4ad8fe9c13?wid=750&qlt=80',
      productTitle: 'Whole Wheat Bread',
      store: 'Target',
      storageType: 'Pantry',
      productType: 'Bakery',
      inList: false,
    },
    {
      id: 'product-4',
      productImage:
        'https://www.instacart.com/assets/domains/product-image/file/large_3e047fa4-5235-4235-a5b8-a2a758ac0322.jpeg',
      productTitle: 'Salmon',
      store: 'Costco',
      storageType: 'Freezer',
      productType: 'Seafood',
      inList: true,
    },
    {
      id: 'product-5',
      productImage: 'https://bit.ly/4npYvJI',
      productTitle: 'Garlic Powder',
      store: 'Walmart',
      storageType: 'Spice Rack',
      productType: 'Spices',
      inList: false,
    },
    {
      id: 'product-6',
      productImage:
        'https://target.scene7.com/is/image/Target/GUEST_ea9257fa-2303-4444-b10f-57e2937a1b4e?wid=750&qlt=80',
      productTitle: 'Chicken Breast',
      store: 'Foodland',
      storageType: 'Refrigerator',
      productType: 'Meat',
      inList: false,
    },
    {
      id: 'product-7',
      productImage:
        'https://target.scene7.com/is/image/Target/GUEST_5ae5aa78-6d3d-4691-add6-e74acd3c45d4?wid=750&qlt=80',
      productTitle: 'Pasta',
      store: 'Target',
      storageType: 'Pantry',
      productType: 'Grain',
      inList: true,
    },
    {
      id: 'product-8',
      productImage: 'https://target.scene7.com/is/image/Target/GUEST_8cc36efc-6e13-4cd6-aac4-dc0d79de2851',
      productTitle: 'Oreos',
      store: 'Walmart',
      storageType: 'Pantry',
      productType: 'Snacks',
      inList: false,
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
            <Form.Control type="search" placeholder="Search products..." style={{ width: '400px' }} />
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
        {sampleProducts.map((product) => (
          <Col key={product.id} lg={3} md={4} sm={6} className="mb-4">
            <ProductCard
              productImage={product.productImage}
              productTitle={product.productTitle}
              store={product.store}
              storageType={product.storageType}
              productType={product.productType}
              inList={product.inList}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ShoppingListPage;
