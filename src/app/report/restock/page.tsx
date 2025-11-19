'use client';

import { Col, Container, Row } from 'react-bootstrap';
import ReportFilter from '@/components/ReportFilter';

const RestockReport = () => (
  <Container>
    <Row>
      <Col>
        <ReportFilter title="Restock" />
      </Col>
    </Row>
    <Row>
      <Col>
        {/* Restock report content goes here */}
      </Col>
    </Row>
  </Container>
);

export default RestockReport;
