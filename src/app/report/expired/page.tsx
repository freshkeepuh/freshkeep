'use client';

import { Col, Container, Row } from 'react-bootstrap';
import ReportFilter from '@/components/ReportFilter';

const ExpiredReport = () => {
  return <Container>
    <Row>
      <Col>
        <ReportFilter title="Expired Report" onSearch={() => {}} />
      </Col>
    </Row>
    <Row>
      <Col>
        {/* Expired report content goes here */}
      </Col>
    </Row>
  </Container>;
};

export default ExpiredReport;