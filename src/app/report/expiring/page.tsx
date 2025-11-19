'use client';

import { Col, Container, Row } from 'react-bootstrap';
import ReportFilter from '@/components/ReportFilter';

const ExpiringReport = () => (
  <Container>
    <Row>
      <Col>
        <ReportFilter title="Expiring" />
      </Col>
    </Row>
    <Row>
      <Col>
        {/* Expiring report content goes here */}
      </Col>
    </Row>
  </Container>
);

export default ExpiringReport;
