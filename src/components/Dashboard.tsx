'use client';

import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

interface DashboardProps {
  session: { user: { email?: string | null; name?: string | null; image?: string | null } };
}

const Dashboard: React.FC<DashboardProps> = () => (
  <Container id="dashboard-page" fluid className="py-3">
    <Row className="align-middle text-center">
      <Col xs={4}>
        <Image src="logo.svg" width="150px" alt="FreshKeep logo" />
      </Col>
      <Col xs={8} className="d-flex flex-column justify-content-center">
        <h1 data-testid="dashboard-header">
          Dashboard
        </h1>
        <p>
          This is where you can manage your food storage,
          <br />
          view recipes based on your items,
          <br />
          and plan your grocery trips efficiently.
        </p>
      </Col>
    </Row>
  </Container>
);

export default Dashboard;
