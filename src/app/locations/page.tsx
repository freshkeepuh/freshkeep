'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import Image from 'next/image';
// import { Location } from '@prisma/client';
import LocationCard from '../../components/LocationCard';
import defaultLocations from '../../../config/settings.development.json';

/*
const initialLocations = [
  {
    id: '1',
    name: 'Kitchen Pantry',
    address: '123 Main St, Honolulu',
  },
  {
    id: '2',
    name: 'Home Pantry',
    address: '123 Main St, Honolulu',
  },
  {
    id: '3',
    name: 'Parent Pantry',
    address: '123 Main St, Honolulu',
  },
]; */

const LocationsPage = () => {
  const [locations, setLocations] = useState(defaultLocations);
  /*
  const handleEditLocation = (location: Location) => {
    setLocations((settings.defaultLocations) => settings.defaultLocations.map((loc: Location) => (
      loc.id === location.id
        ? { ...loc, name: location.name, address: location.address1 }
        : loc
    )));
  };

  const handleDeleteLocation = (id: string) => {
    setLocations((prevLocations) => prevLocations.filter((location: Location) => location.id !== id));
  };
  const handleAddLocation = () => {
    // TODO: add function
  };
*/
    <main style={{ background: '#f4f4f4', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Container>
        {/* Title */}
        <Row className="mb-4 align-items-center" style={{ minHeight: '80px' }}>
          <Col>
            <h1 className="m-0">Location Management</h1>
          </Col>
        </Row>
        <Row className="g-4">
          {/* Location List */}
          <Col md={4}>
            <div
              className="d-flex flex-column h-100"
              style={{
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                padding: '1.5rem',
                minHeight: '500px',
              }}
            >
              <div>
                <h4>Locations</h4>
                <ul className="list-unstyled">
                  {locations.size > 0 ? (
                    locations.map((location) => (
                      <LocationCard
                        key={location.id}
                        id={location.id}
                        name={location.name}
                        address1={location.address1}
                        onEdit={handleEditLocation}
                        onDelete={handleDeleteLocation}
                      />
                    ))
                  ) : (
                    <li className="text-muted text-center p-3">
                      No locations found.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </Col>

          {/* Map Display & Search Bar */}
          <Col md={8}>
            <div
              className="h-100"
              style={{
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                padding: '1.5rem',
                minHeight: '500px',
              }}
            >
              {/* Search Bar */}
              <Row className="mb-4 align-items-center">
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Search for a location or address..."
                  />
                </Col>
                {/* Add Location Button */}
                <Col xs="auto">
                  <Button
                    variant="success"
                    size="sm"
                    aria-label="Add Location"
                    onClick={handleAddLocation}
                    className="d-flex align-items-center"
                  >
                    <Plus className="me-1" />
                    Add
                  </Button>
                </Col>
              </Row>
              {/* Google Maps Placeholder */}
              <Row>
                <Col className="text-center">
                  <Image
                    src="/map-placeholder.png"
                    alt="not found"
                    width={625}
                    height={400}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </main>;
};
export default LocationsPage;
