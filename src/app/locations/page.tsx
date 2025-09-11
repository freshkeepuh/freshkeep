import { Button, Col, Container, Form, Row } from 'react-bootstrap';

const LocationManagement = () => (
  <main style={{ background: '#f4f4f4', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
    <Container>
      {/* Title Row */}
      <Row className="mb-4 align-items-center" style={{ minHeight: '80px' }}>
          <Col>
            <h1 className="m-0">Location Management</h1>
          </Col>
      </Row>
      <Row>
        {/* Location List */}
        <Col
          md={4}
          className="d-flex flex-column"
          style={{
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            padding: '1.5rem',
            minHeight: '500px',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h4>Locations</h4>
            <ul>
              <li>Sample Location 1</li>
              <li>Sample Location 2</li>
              <li>Sample Location 3</li>
            </ul>
          </div>
          {/* Location Management Buttons */}
          <div className="mt-auto d-flex">
            <Button
              variant="success"
              className="me-2"
              size="sm"
              style={{ minWidth: '90px' }}
            >
              Add
            </Button>
            <Button
              variant="outline-dark"
              className="me-2"
              size="sm"
              style={{ minWidth: '90px' }}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              style={{ minWidth: '90px' }}
            >
              Delete
            </Button>
          </div>
        </Col>

        {/* Map Display & Search Bar */}
        <Col
          md={8}
          style={{
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {/* Search Bar */}
          <Form className="mb-4">
            <Form.Control
              type="text"
              placeholder="Search for a location or address..."
            />
          </Form>
          {/* Google Maps Placeholder */}
          <div className="mb-3 d-flex justify-content-center">
            <img
              src="https://developers.google.com/static/maps/images/landing/hero_geocoding_api.png"
              alt="Image not found"
              style={{
                width: '80%',
                height: 'auto',
                borderRadius: '8px',
              }}
            />
          </div>
        </Col>
      </Row>
    </Container>
  </main>
);

export default LocationManagement;
