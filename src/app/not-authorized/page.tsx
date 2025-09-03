import { Col, Container, Row } from 'react-bootstrap';

/** Render a Not Authorized page if the user enters a URL that they don't have authorization for. */
const NotAuthorized = () => (
  <main>
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={4} className="text-center">
          <h2>
            <p>Not Authorized</p>
          </h2>
        </Col>
      </Row>
    </Container>
  </main>
);

export default NotAuthorized;
