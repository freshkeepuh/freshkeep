'use client';

import { Col, Container, Row } from 'react-bootstrap';
import ReportFilter from '@/components/ReportFilter';

const InventoryReport = () => (
  <Container>
    <Row>
      <Col>
        <ReportFilter title="Inventory" onSearch={() => {}} />
      </Col>
    </Row>
    <Row>
      <Col>
        {/* Inventory report content goes here */}
      </Col>
    </Row>
  </Container>
);

export default InventoryReport;
