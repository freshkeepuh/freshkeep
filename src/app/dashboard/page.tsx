'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Row, Col, Container, Card, Button, ListGroup } from 'react-bootstrap';
import StorageList, { StorageType } from '@/components/dashboard/StorageList';
import AddStorageModal, { NewStorageData } from '@/components/dashboard/AddStorageModal';
import styles from '../../styles/dashboard.module.css';

interface DashboardProps {
  session: { user: { email?: string | null; name?: string | null; image?: string | null } };
}

export default function Dashboard({ session }: DashboardProps) {
  const router = useRouter();

  const [storages, setStorages] = useState<StorageType[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [expiringSoon, setExpiringSoon] = useState(0);
  const [shoppingListCount, setShoppingListCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Mock data
    const mockData: StorageType[] = [
      { id: 1, name: 'Kitchen Fridge', type: 'Fridge', itemCount: 5 },
      { id: 2, name: 'Garage Freezer', type: 'Freezer', itemCount: 8 },
      { id: 3, name: 'House Pantry', type: 'Pantry', itemCount: 10 },
    ];
    setStorages(mockData);
    setTotalItems(mockData.reduce((sum, s) => sum + (s.itemCount || 0), 0));
    setExpiringSoon(3);
    setShoppingListCount(5);
  }, []);

  const handleAddStorage = (newStorage: NewStorageData) => {
    const newEntry: StorageType = {
      id: Date.now(),
      ...newStorage,
    };
    setStorages((prev) => [...prev, newEntry]);
    setTotalItems((prev) => prev + (newEntry.itemCount || 0));
  };

  const handleRemoveStorage = (id: number, count: number) => {
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
            {session.user.name || session.user.email}
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
            across your
            storage units.
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
          {/* Summary Cards */}
          <Row className="g-3">
            <Col md={4}>
              <Card className={`${styles.card} ${styles.totalItems}`}>
                <div className={styles.cardIcon}>📦</div>
                <Card.Title>Total Items</Card.Title>
                <Card.Text>{totalItems}</Card.Text>
              </Card>
            </Col>
            <Col md={4}>
              <Card className={`${styles.card} ${styles.expiringSoon}`}>
                <div className={styles.cardIcon}>⚠️</div>
                <Card.Title>Expiring Soon</Card.Title>
                <Card.Text>{expiringSoon}</Card.Text>
              </Card>
            </Col>
            <Col md={4}>
              <Card className={`${styles.card} ${styles.shoppingListCount}`}>
                <div className={styles.cardIcon}>🛒</div>
                <Card.Title>Shopping List</Card.Title>
                <Card.Text>{shoppingListCount}</Card.Text>
              </Card>
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
}
