'use client';

import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { Plus, Search, GeoAlt } from 'react-bootstrap-icons';
import { Country } from '@prisma/client';
import LocationCard from '../../components/location/LocationCard';
import MapComponent from '../../components/MapDisplay';
import styles from './page.module.css';

interface Location {
  id: string;
  name: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zipcode: string;
  country: Country;
  picture?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const LocationsPage = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  // Initial load from API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/location', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as Location[];
        if (!cancelled) {
          setLocations(data ?? []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Initialize selection when locations load
  useEffect(() => {
    if (!selectedId && locations && locations.length > 0) {
      setSelectedId(locations[0].id);
    }
  }, [locations, selectedId]);

  // Re-sync helper function
  const reloadLocations = async () => {
    const res = await fetch('/api/location', { cache: 'no-store' });
    if (!res.ok) return;
    const data = (await res.json()) as Location[];
    setLocations(data ?? []);
    // If nothing is selected, auto-select the first location
    if (!selectedId && data && data.length > 0) {
      setSelectedId(data[0].id);
    }
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
    try {
      setAdding(true);
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
    } finally {
      setAdding(false);
    }
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
        address={l.address1} /*
        address2={l.address2 ?? null}
        city={l.city}
        state={l.state}
        zipcode={l.zipcode}
        country={l.country as Country} */
        /* picture={l.picture ?? null}
        createdAt={l.createdAt}
        updatedAt={l.updatedAt} */
        onEdit={handleEditLocation}
        onDelete={handleDeleteLocation}
        selected={l.id === selectedId}
        onSelect={(id) => setSelectedId(id)}
      />
    ));
  } else {
    locationsList = <li className="text-muted text-center p-3">No locations found.</li>;
  }

  const selectedForMap = (() => {
    if (locations.length === 0) return undefined;
    const sel = selectedId ? locations.find(l => l.id === selectedId) : undefined;
    const target = sel || locations[0];
    return { id: target.id, name: target.name, address: target.address1 };
  })();

  return (
    <main className={styles.main}>
      <Container>
        {/* Title */}
        <Row className={`mb-4 align-items-center ${styles.titleRow}`}>
          <Col>
            <div className={styles.titleBar}>
              <GeoAlt className="text-success" size={24} />
              <h1 className={`m-0 ${styles.titleText}`}>Locations</h1>
            </div>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Location List */}
          <Col md={4}>
            <div className={`d-flex flex-column h-100 ${styles.panel}`}>
              <div className={styles.listSection}>
                <Row className="align-items-center mb-2">
                  <Col>
                    <h4 className="mb-2">Your Locations</h4>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="success"
                      size="sm"
                      aria-label="Add Location"
                      onClick={handleAddLocation}
                      className={`d-flex align-items-center ${styles.btnCompact}`}
                      disabled={adding}
                    >
                      {adding ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-1" />
                          Adding…
                        </>
                      ) : (
                        <>
                          <Plus className="me-1" size={22} />
                          Add Location
                        </>
                      )}
                    </Button>
                  </Col>
                </Row>
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
                {/* Search Button */}
                <Col xs="auto">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    aria-label="Search locations"
                    className="d-flex align-items-center"
                  >
                    <Search className="me-1" />
                    Search
                  </Button>
                </Col>
              </Row>

              {/* Google Maps */}
              <Row>
                <Col className="text-center">
                  <MapComponent location={selectedForMap} />
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
