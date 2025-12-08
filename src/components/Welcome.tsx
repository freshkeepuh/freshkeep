'use client';

import React from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import styles from '../styles/welcome.module.css';

function Welcome(): React.JSX.Element {
  return (
    <Container
      id="welcome-page"
      fluid
      className={`text-center py-5 ${styles.welcomeContainer}`}
    >
      <Row className="align-items-center justify-content-center fade-in px-md-5 px-3">
        {/* Welcome Message */}
        <Col xs={12} md={4} className="mb-5 mb-md-0">
          <Image
            src="logo.svg"
            width="50%"
            alt="FreshKeep Logo"
            className={`mb-3 ${styles.logoBounce}`}
          />
          <h1 className="fw-bold text-success">Welcome to FreshKeep!</h1>
          <h4 className="text-muted mb-4">
            Your personal food management assistant
          </h4>
        </Col>

        {/* Sample Dashboard Image */}
        <Col xs={12} md={6} className="text-center mt-5 mb-md-0">
          <Image
            src="images/home/app-demo-green-bg.png"
            alt="App demo"
            width="100%"
            className="rounded-4 shadow-sm"
          />
        </Col>
      </Row>

      <Row className="align-items-center justify-content-center fade-in px-md-5 px-3">
        {/* List of Features */}
        <Col
          xs={12}
          md={4}
          className="flex-column justify-content-center text-start"
        >
          <ul className={`${styles.homeBulletList} mt-4`}>
            <li>🥦 Organize your food storage with ease</li>
            <li>🍲 Discover recipes based on what you have</li>
            <li>🛒 Plan grocery trips efficiently</li>
            <li>💰 Minimize food waste and save money</li>
            <li>⏰ Track food expiration dates effortlessly</li>
            <li>🏠 Manage pantries across multiple locations</li>
          </ul>
        </Col>
        {/* Buttons */}
        <Col
          xs={12}
          md={6}
          className="d-flex flex-column justify-content-center text-start "
        >
          <div className="mt-4 d-flex flex-wrap gap-4 justify-content-center">
            <Button
              variant="success"
              href="/auth/signin"
              className={styles.welcomeBtn}
            >
              Sign In
            </Button>
            <Button
              variant="outline-success"
              href="/auth/signup"
              className={styles.welcomeBtnOutline}
            >
              Sign Up
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Welcome;
