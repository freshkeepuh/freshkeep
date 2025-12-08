'use client';

import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import ReportFilter from '@/components/ReportFilter';

function ExpiredReport() {
  return (
    <Container>
      <Row>
        <Col>
          <ReportFilter title="Expired" />
        </Col>
      </Row>
      <Row>
        <Col>{/* Expired report content goes here */}</Col>
      </Row>
    </Container>
  );
}

export default ExpiredReport;
