'use client';

import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import styles from '../../styles/dashboard.module.css';

export interface StorageType {
  id: number;
  name: string;
  location?: string;
  type: 'Fridge' | 'Freezer' | 'Pantry' | 'Spice Rack' | 'Other';
  itemCount?: number;
}

interface StorageListProps {
  storages: StorageType[];
  onRemove: (id: number, count: number) => void;
}

export default function StorageList({ storages, onRemove }: StorageListProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Fridge':
        return '🧊';
      case 'Freezer':
        return '❄️';
      case 'Pantry':
        return '🥫';
      case 'Spice Rack':
        return '🌶️';
      default:
        return '📦';
    }
  };

  return (
    <Row xs={1} md={2} className={`g-3 mt-3 ${styles.storageGrid}`}>
      {storages.map((storage) => (
        <Col key={storage.id}>
          <Card className={styles.storageCard}>
            <Card.Body className="text-center">
              <div className={styles.storageIcon}>{getIcon(storage.type)}</div>
              <Card.Title>{storage.name}</Card.Title>
              <Card.Subtitle>{storage.type}</Card.Subtitle>
              <Card.Text>
                {storage.itemCount || 0}
                {' '}
                items
              </Card.Text>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => onRemove(storage.id, storage.itemCount || 0)}
              >
                Remove
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
