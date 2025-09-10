import { Col, Container, Row } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3 bg-light border-top">
    <Container>
      <Row className="justify-content-center text-center">
        <Col md="auto">
          <strong>FreshKeep UH</strong>
          <br />
          <small className="text-muted">Where Organizing Meets Fresh</small>
          <br />
          <a href="https://docs.freshkeepuh.live/" target="_blank" rel="noopener noreferrer">
            About Us
          </a>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col className="text-center">
          <small className="text-muted">
            © FreshKeep UH. All rights reserved.
          </small>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
