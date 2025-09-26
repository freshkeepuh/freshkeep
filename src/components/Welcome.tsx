import { Container, Row, Col, Image } from 'react-bootstrap';

const Welcome: React.FC = () => (
  <Container id="welcome-page" fluid className="py-3">
    <Row className="align-middle text-center">
      <Col xs={4}>
        <Image src="logo.svg" width="150px" alt="FreshKeep logo" />
      </Col>
      <Col xs={8} className="d-flex flex-column justify-content-center">
        <>
          <h1>Welcome!</h1>
          <p>This application helps you organize your food storage, </p>
          <p>discover recipes based on what you have, and plan your grocery trips efficiently.</p>
        </>
      </Col>
    </Row>
  </Container>
);

export default Welcome;
