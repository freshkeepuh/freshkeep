import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Plus, Pencil, Trash } from 'react-bootstrap-icons';
import Image from 'next/image';

const sampleLocations = [
  'Sample Location 1',
  'Sample Location 2',
  'Sample Location 3',
];

const LocationsPage = () => (
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
            <ul className="list-unstyled">
              {sampleLocations.map((loc) => (
                <li
                  key={loc}
                  className="d-flex align-items-center justify-content-between mb-3 p-2"
                  style={{
                    background: '#f8f9fa',
                    borderRadius: '6px',
                  }}
                >
                  <span>{loc}</span>
                  <span>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      className="me-2 p-1"
                      aria-label={`Edit ${loc}`}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="p-1"
                      aria-label={`Delete ${loc}`}
                    >
                      <Trash />
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Add Location Button */}
          <div className="mt-auto d-flex justify-content-end">
            <Button
              variant="success"
              size="sm"
              aria-label="Add Location"
            >
              <Plus />
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
            <Image
              src="/map-placeholder.png"
              alt="not found"
              width={625}
              height={400}
            />
          </div>
        </Col>
      </Row>
    </Container>
  </main>
);

export default LocationsPage;
