import { Col, Container, Row, Spinner } from 'react-bootstrap';

function LoadingSpinner() {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <Spinner animation="border" />
        </Col>
      </Row>
      <Row className="justify-content-md-center mt-2">
        <Col md="auto">Getting data</Col>
      </Row>
    </Container>
  );
}

export default LoadingSpinner;
