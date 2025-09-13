import { Col, Container, Row } from 'react-bootstrap';

/** The Home page. */
const Home = () => (
  <main>
    <Container id="landing-page" fluid className="py-3">
      <Row className="align-middle text-center">
        <Col xs={4}>
          Logo
        </Col>

        <Col xs={8} className="d-flex flex-column justify-content-center">
          <h1>Welcome!</h1>
          <p>This application helps you organize your food storage, </p>
          <p>discover recipes based on what you have, and plan your grocery trips efficiently.</p>
        </Col>
      </Row>
    </Container>
  </main>
);

export default Home;
