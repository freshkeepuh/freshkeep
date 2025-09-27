import { Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer data-testid="footer" className="mt-auto py-3 bg-success">
    <Container>
      <Row className="justify-content-center text-center">
        <Col md="4" className="mb-2 mb-md-0 text-md-start">
          <strong data-testid="footer-brand">FreshKeep UH</strong>
        </Col>
        <Col md="4" className="mb-2 mb-md-0 text-md-center">
          <small data-testid="footer-slogan" className="text-muted">Where Organizing Meets Fresh</small>
        </Col>
        <Col md="4" className="mb-2 mb-md-0 text-md-end">
          <Link data-testid="footer-about-link" href="https://docs.freshkeepuh.live" className="link-light">About</Link>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col md="auto" className="text-center">
          <small data-testid="footer-copyright" className="text-muted">
            © FreshKeep UH. All rights reserved.
          </small>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
