import { Product } from '@prisma/client';
import React from 'react';
import ProductCard from '@/components/ProductCard';
import { Col, Container, Row } from 'react-bootstrap';

type StoreProductsProps = {
  products: Product[] | undefined;
};

export default function StoreProducts({ products }: StoreProductsProps) {
  if (!products) {
    return <div>Please provide Products.</div>;
  }

  if (!products || products.length === 0) {
    return <div>No Products found for this Store.</div>;
  }

  return (
    <div>
      <h3>Products</h3>
      <Container fluid>
        <Row className="g-4">
          {products.sort((a, b) => a.category.localeCompare(b.category)).map(product => (
            <Col key={product.id} xs={6} md={4} lg={3}>
              <ProductCard key={product.id} product={product} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
