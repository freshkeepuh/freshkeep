'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Row, Col, Container, Card, Button, ListGroup } from 'react-bootstrap';
import styles from '../styles/dashboard.module.css';

interface DashboardProps {
  session: { user: { email?: string | null; name?: string | null; image?: string | null } };
}

interface StorageType {
  id: number;
  name: string;
  type: 'Fridge' | 'Freezer' | 'Pantry' | 'Spice Rack' | 'Other';
  itemCount?: number;
}

export default function Dashboard({ session }: DashboardProps) {
  const [storageTypes, setStorageTypes] = useState<StorageType[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [expiringSoon, setExpiringSoon] = useState(0);
  const [shoppingListCount, setShoppingListCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // temp mock data
    const mockStorageTypes: StorageType[] = [
      { id: 1, name: 'Kitchen Fridge', type: 'Fridge', itemCount: 5 },
      { id: 2, name: 'Garage Freezer', type: 'Freezer', itemCount: 8 },
      { id: 3, name: 'House Pantry', type: 'Pantry', itemCount: 10 },
    ];
    setStorageTypes(mockStorageTypes);
    setTotalItems(mockStorageTypes.reduce((sum, storage) => sum + (storage.itemCount || 0), 0));
    setExpiringSoon(3); // mock value
    setShoppingListCount(5); // mock value
  }, []);

  return (
    <Container fluid className={styles.dashboardPage}>
      {/* Header */}
      <Card className={styles.dashboardHeader}>
        <Card.Body>
          <Card.Title as="h1">
            Welcome back,
            {' '}
            {session.user.name || session.user.email?.split('@')[0]}
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
            <span className={styles.orangeText}>
              {' '}
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
        {/* Main Content */}
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

          {/* Storage Units Section */}
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
                {/* TODO Make a modal for adding new storage with form inputs for name
                and item count. Consider adding edit button on each storage card */}
                <Button
                  className={styles.btnBlue}
                  onClick={() => setStorageTypes((
                    prev,
                  ) => [...prev, { id: Date.now(), type: 'Fridge', name: 'New Fridge', itemCount: 0 }])}
                >
                  + Add Fridge
                </Button>
                <Button
                  className={styles.btnBlue}
                  onClick={() => setStorageTypes((
                    prev,
                  ) => [...prev, { id: Date.now(), type: 'Freezer', name: 'New Freezer', itemCount: 0 }])}
                >
                  + Add Freezer
                </Button>
                <Button
                  className={styles.btnBlue}
                  onClick={() => setStorageTypes((
                    prev,
                  ) => [...prev, { id: Date.now(), type: 'Pantry', name: 'New Pantry', itemCount: 0 }])}
                >
                  + Add Pantry
                </Button>
              </div>

              <Row xs={1} md={2} className={`g-3 mt-3 ${styles.storageGrid}`}>
                {storageTypes.map((storage) => (
                  <Col key={storage.id}>
                    <Card className={styles.storageCard}>
                      <Card.Body className="text-center">
                        <div className={styles.storageIcon}>
                          {storage.type === 'Fridge' && '🧊'}
                          {storage.type === 'Freezer' && '❄️'}
                          {storage.type === 'Pantry' && '🥫'}
                          {storage.type === 'Spice Rack' && '🌶️'}
                          {storage.type === 'Other' && '📦'}
                        </div>
                        <Card.Title>{storage.name}</Card.Title>
                        <Card.Text>
                          {storage.itemCount || 0}
                          {' '}
                          items
                        </Card.Text>
                        <Button
                          variant="outline-none"
                          size="sm"
                          className={`me-2 ${styles.removeBtn}`}
                          onClick={() => {
                            // Handle remove storage unit
                            setStorageTypes((prev) => prev.filter((s) => s.id !== storage.id));
                            setTotalItems((prev) => prev - (storage.itemCount || 0));
                          }}
                        >
                          Remove
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
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
              <Button
                className={`w-100 mt-2 ${styles.actionBtn}`}
                onClick={() => router.push('/recipes')}
              >
                🍳 Find Recipes
              </Button>
              <Button
                className={`w-100 mt-2 ${styles.actionBtn}`}
                onClick={() => router.push('/shoppingList')}
              >
                🛒 View Shopping List
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
