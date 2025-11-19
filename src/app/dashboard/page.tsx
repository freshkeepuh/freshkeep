'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Row, Col, Container, Card, Button, ListGroup } from 'react-bootstrap';
import swal from 'sweetalert';
// components
import StorageList, { StorageType } from '@/components/dashboard/StorageList';
import AddStorageModal, { NewStorageData } from '@/components/dashboard/AddStorageModal';
import DashboardTileButton from '@/components/dashboard/DashboardTileButton';
import styles from '../../styles/dashboard.module.css';

const DashboardPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [storages, setStorages] = useState<StorageType[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [expiringSoon, setExpiringSoon] = useState(0);
  const [shoppingListCount, setShoppingListCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [storagesRes, locationsRes] = await Promise.all([
          fetch('/api/storages', { cache: 'no-store' }),
          fetch('/api/location', { cache: 'no-store' }),
        ]);
        if (storagesRes.ok) {
          const data: StorageType[] = await storagesRes.json();
          setStorages(data);
          setTotalItems(data.reduce((sum, s) => sum + (s.itemCount || 0), 0));
        } else {
          setStorages([]);
          setTotalItems(0);
        }
        if (locationsRes.ok) {
          const locs: { id: string; name: string }[] = await locationsRes.json();
          setLocations(locs.map(l => ({ id: l.id, name: l.name })));
        } else {
          setLocations([]);
        }
      } finally {
        setExpiringSoon(3);
        setShoppingListCount(5);
      }
    };
    load().catch(err => {
      console.error('Failed to load dashboard data', err);
    });
  }, []);

  const locationsById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const l of locations) map[l.id] = l.name;
    return map;
  }, [locations]);

  const handleAddStorage = async (newStorage: NewStorageData) => {
    try {
      const response = await fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStorage.name,
          type: newStorage.type,
          locId: null, // Default to no location
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add storage');
      }

      const createdStorage: StorageType = await response.json();
      setStorages((prev) => [...prev, createdStorage]);
      setTotalItems((prev) => prev + (createdStorage.itemCount || 0));
    } catch (error) {
      console.error('Error adding storage:', error);
      const message = error instanceof Error ? error.message : 'Failed to add storage';
      await swal('Error', message, 'error');
    }
  };

  return (
    <Container fluid className={styles.dashboardPage}>
      {/* Header */}
      <Card className={styles.dashboardHeader}>
        <Card.Body>
          <Card.Title as="h1">
            Welcome back,
            {' '}
            {session?.user?.email?.split('@')[0] || 'user'}
            !
          </Card.Title>
          <Card.Text>
            You have
            {' '}
            <span className={styles.greenText}>
              {totalItems}
              {' '}
              items
            </span>
            {' '}
            across your storage areas.
            {' '}
            <span className={styles.orangeText}>
              {expiringSoon}
              {' '}
              items
            </span>
            {' '}
            are expiring soon.
          </Card.Text>
        </Card.Body>
      </Card>

      <Row className="mt-4 g-5">
        <Col md={9}>
          {/* Dashboard Tile Cards */}
          <Row className="g-3">
            <Col md={4}>
              <DashboardTileButton
                icon="📦"
                title="Total Items"
                count={totalItems}
                onClick={() => router.push('/')}
                className={styles.totalItems}
              />
            </Col>
            <Col md={4}>
              <DashboardTileButton
                icon="⚠️"
                title="Expiring Soon"
                count={expiringSoon}
                onClick={() => router.push('/')}
                className={styles.expiringSoon}
              />
            </Col>
            <Col md={4}>
              <DashboardTileButton
                icon="🛒"
                title="Shopping List"
                count={shoppingListCount}
                onClick={() => router.push('/shoppingList')}
                className={styles.shoppingListCount}
              />
            </Col>
          </Row>

          {/* Storage Section */}
          <Card className={`${styles.storageSection} mt-4`}>
            <Card.Body>
              <div className={styles.storageHeader}>
                <h2>Your Storage Areas</h2>
                <Button
                  aria-label="Add Storage"
                  className={`ms-2 ${styles.btnGreen} ${styles.roundBtn}`}
                  onClick={() => setShowModal(true)}
                >
                  +
                </Button>
              </div>
              {/* Storage Areas */}
              <StorageList storages={storages} locationsById={locationsById} />
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col md={3}>
          <Card className={styles.expiringSoonBox}>
            <Card.Body>
              <Card.Title>Expiring Soon ⚠️</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>🥛 Milk - 2 days</ListGroup.Item>
                <ListGroup.Item>🥚 Eggs - 3 days</ListGroup.Item>
                <ListGroup.Item>🥣 Yogurt - 5 days</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className={`${styles.quickActions} mt-3`}>
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              <Button className={`w-100 mt-2 ${styles.actionBtn}`} onClick={() => router.push('/recipes')}>
                🍳 Find Recipes
              </Button>
              <Button className={`w-100 mt-2 ${styles.actionBtn}`} onClick={() => router.push('/shoppingList')}>
                🛒 View Shopping List
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Storage Modal */}
      <AddStorageModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddStorage}
      />
    </Container>
  );
};

export default DashboardPage;
