import { Container, Row, Col, Image } from 'react-bootstrap';

const Dashboard: React.FC = () => (
  <Container id="dashboard-page" fluid className="py-3">
    <Row className="align-middle text-center">
      <Col xs={4}>
        <Image src="logo.svg" width="150px" alt="" />
      </Col>
      <Col xs={8} className="d-flex flex-column justify-content-center">
        <h1>Dashboard</h1>
        <p>This is where you can manage your food storage, </p>
        <p>view recipes based on your items, and plan your grocery trips efficiently.</p>
      </Col>
    </Row>
  </Container>
);

export default Dashboard;
