'use client';

import { Col, Container, Row } from 'react-bootstrap';
import ReportFilter from '@/components/ReportFilter';

const RestockReport = () => {
  return <Container>
    <Row>
      <Col>
        <ReportFilter title="Restock Report" onSearch={() => {}} />
      </Col>
    </Row>
    <Row>
      <Col>
        {/* Restock report content goes here */}
      </Col>
    </Row>
  </Container>;
};

export default RestockReport;