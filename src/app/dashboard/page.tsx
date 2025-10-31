'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Row, Col, Container, Card, Button, ListGroup } from 'react-bootstrap';
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
  const [expiringSoon, setExpiringSoon] = useState(0);
  const [shoppingListCount, setShoppingListCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadStorages = async () => {
      try {
        const res = await fetch('/api/storages', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to load storages: ${res.status}`);
        const data: StorageType[] = await res.json();
        setStorages(data);
        setTotalItems(data.reduce((sum, s) => sum + (s.itemCount || 0), 0));
      } catch (e) {
        // Leave list empty on error
        setStorages([]);
        setTotalItems(0);
      } finally {
        // TODO: wire real values later
        setExpiringSoon(3);
        setShoppingListCount(5);
      }
    };
    loadStorages();
  }, []);

  const handleAddStorage = (newStorage: NewStorageData) => {
    const newEntry: StorageType = {
      id: String(Date.now()),
      ...newStorage,
      itemCount: Number(newStorage.itemCount) || 0,
    };
    setStorages((prev) => [...prev, newEntry]);
    setTotalItems((prev) => prev + (newEntry.itemCount || 0));
  };

  const handleRemoveStorage = (id: string, count: number) => {
    setStorages((prev) => prev.filter((s) => s.id !== id));
    setTotalItems((prev) => prev - count);
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
            across your storage units.
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
                <h2>Your Storage Units</h2>
                <Button
                  className={`ms-2 ${styles.btnGreen}`}
                  onClick={() => router.push('/locations')}
                >
                  + Add Item
                </Button>
              </div>

              <div className="mt-3 d-flex gap-2 flex-wrap">
                <Button className={styles.btnBlue} onClick={() => setShowModal(true)}>
                  + Add Storage
                </Button>
              </div>

              {/* Storage Units */}
              <StorageList storages={storages} onRemove={handleRemoveStorage} />
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
