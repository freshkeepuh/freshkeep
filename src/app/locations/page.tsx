'use client';

import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import LocationCard from '../../components/location/LocationCard';
import MapComponent from '../../components/MapDisplay';
import styles from './page.module.css';

interface Location {
  id: string;
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  picture?: string;
}

const LocationsPage = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial load from API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
  const res = await fetch('/api/location', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as Location[];
        if (!cancelled) setLocations(data ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Re-sync helper function
  const reloadLocations = async () => {
  const res = await fetch('/api/location', { cache: 'no-store' });
    if (!res.ok) return;
    const data = (await res.json()) as Location[];
    setLocations(data ?? []);
  };

  // Inline edit: only name and address1
  const handleEditLocation = async (id: string, name: string, address: string) => {
    await fetch(`/api/location/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address1: address }),
    });
    await reloadLocations();
  };

  // Delete location
  const handleDeleteLocation = async (id: string) => {
    await fetch(`/api/location/${encodeURIComponent(id)}`, { method: 'DELETE' });
    await reloadLocations();
  };

  // Compute next "New location N" number based on current list
  const getNextAutoNumber = () => {
    const base = 'new location';
    const nums = locations
      .map(l => l.name || '')
      .filter(n => n.toLowerCase().startsWith(base))
      .map(n => parseInt(n.slice(base.length).trim(), 10))
      .filter(n => Number.isFinite(n));
    return nums.length ? Math.max(...nums) + 1 : 1;
  };

  // Add location: create a new DB record with auto-incremented default name, then re-sync
  const handleAddLocation = async () => {
    const num = getNextAutoNumber();
    const name = `New location ${num}`;

    await fetch('/api/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        address1: '2500 Campus Rd',
        city: 'Honolulu',
        state: 'HI',
        zipcode: '96822',
        country: 'USA',
      }),
    });

    await reloadLocations();
  };

  // Locations list
  let locationsList: React.ReactNode;
  if (loading) {
    locationsList = <li className="text-muted text-center p-3">Loading...</li>;
  } else if (locations.length > 0) {
    locationsList = locations.map(l => (
      <LocationCard
        key={l.id}
        id={l.id}
        name={l.name}
        address={l.address1}
        onEdit={handleEditLocation}
        onDelete={handleDeleteLocation}
      />
    ));
  } else {
    locationsList = <li className="text-muted text-center p-3">No locations found.</li>;
  }

  const firstLocationForMap = locations.length > 0
    ? { id: locations[0].id, name: locations[0].name, address: locations[0].address1 }
    : undefined;

  return (
    <main className={styles.main}>
      <Container>
        {/* Title */}
        <Row className={`mb-4 align-items-center ${styles.titleRow}`}>
          <Col>
            <h1 className="m-0">Locations</h1>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Location List */}
          <Col md={4}>
            <div className={`d-flex flex-column h-100 ${styles.panel}`}>
              <div className={styles.listSection}>
                <h4>Your Locations</h4>
                <div className={styles.listScroll}>
                  <ul className="list-unstyled mb-0">{locationsList}</ul>
                </div>
              </div>
            </div>
          </Col>

          {/* Map Display & Search Bar */}
          <Col md={8}>
            <div className={`${styles.panel} h-100`}>
              {/* Search Bar */}
              <Row className="mb-4 align-items-center">
                <Col>
                  <Form.Control type="text" placeholder="Search for a location or address..." />
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

              {/* Google Maps */}
              <Row>
                <Col className="text-center">
                  <MapComponent firstLocation={firstLocationForMap} />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default LocationsPage;
