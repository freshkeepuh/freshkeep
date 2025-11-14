'use client';

import { Col, Container, Row } from 'react-bootstrap';
import ReportFilter from '@/components/ReportFilter';

const ExpiringReport = () => {
  return <Container>
    <Row>
      <Col>
        <ReportFilter title="Expiring Report" onSearch={() => {}} />
      </Col>
    </Row>
    <Row>
      <Col>
        {/* Expiring report content goes here */}
      </Col>
    </Row>
  </Container>;
};

export default ExpiringReport;