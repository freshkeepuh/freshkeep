import { Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';


/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="bg-success text-white py-2">
    <Container
      className="d-flex flex-column gap-2"
    >
      <Row>
        <Col className="d-flex justify-content-start align-items-center opacity-75 fw-semibold">
          Copyright &copy; {new Date().getFullYear()} FreshKeep UH. All rights reserved.
        </Col>
        <Col className="d-flex justify-content-center align-items-center">
          <strong>FreshKeep UH</strong>
          <span className="opacity-50 mx-2">|</span>
          <small className="opacity-75">Where Organizing Meets Fresh</small>
        </Col>
        <Col className="d-flex justify-content-end align-items-center opacity-75 fw-semibold">
          <Link
            href="https://docs.freshkeepuh.live"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-decoration-none"
          >
            About
          </Link>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
