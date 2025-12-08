'use client';

import { Col, Container, Row } from 'react-bootstrap';
import ReportFilter from '@/components/ReportFilter';

function RestockReport() {
  return (
    <Container>
      <Row>
        <Col>
          <ReportFilter title="Restock" onFilterChange={() => {}} />
        </Col>

        <Col>{/* Restock report content goes here */}</Col>
      </Row>
    </Container>
  );
}

export default RestockReport;
