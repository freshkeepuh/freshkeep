'use client';

import { Col, Container, Row } from 'react-bootstrap';
import ReportFilter from '@/components/ReportFilter';

function InventoryReport() {
  return (
    <Container>
      <Row>
        <Col>
          <ReportFilter title="Inventory" onFilterChange={() => {}} />
        </Col>
      </Row>
      <Row>
        <Col>{/* Inventory report content goes here */}</Col>
      </Row>
    </Container>
  );
}

export default InventoryReport;
