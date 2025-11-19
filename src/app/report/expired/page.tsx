'use client';

import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import ReportFilter from '@/components/ReportFilter';

const ExpiredReport = () => (
  <Container>
    <Row>
      <Col>
        <ReportFilter title="Expired" onFilterChange={(
          location,
          storageType,
          storageArea,
          productCategory,
          product,
        ) => {
          // Handle filter changes here
        }} />
      </Col>
    </Row>
    <Row>
      <Col>
        {/* Expired report content goes here */}
      </Col>
    </Row>
  </Container>
);

export default ExpiredReport;
