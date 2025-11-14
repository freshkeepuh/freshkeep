'use client';

import ReportFilter from '@/components/ReportFilter';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const InventoryReport = () => {
  return <Container>
    <Row>
      <Col>
        <ReportFilter title="Inventory Report" onSearch={() => {}} />
      </Col>
    </Row>
    <Row>
      <Col>
        {/* Inventory report content goes here */}
      </Col>
    </Row>
  </Container>;
};

export default InventoryReport;