'use client';

import React, { useMemo } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import styles from '../../styles/dashboard.module.css';

export interface StorageType {
  id: string;
  locId?: string;
  name: string;
  type: 'Fridge' | 'Freezer' | 'Pantry' | 'Spice Rack' | 'Other';
  itemCount?: number;
}

interface StorageListProps {
  storages: StorageType[];
  // onRemove: (id: string, count: number) => void;
  locationsById?: Record<string, string>;
}

export default function StorageList({ storages, locationsById = {} }: StorageListProps) {
  const router = useRouter();
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

  const grouped = useMemo(() => {
    const byLoc: Record<string, StorageType[]> = {};
    for (const s of storages) {
      const key = s.locId || 'unassigned';
      if (!byLoc[key]) byLoc[key] = [];
      byLoc[key].push(s);
    }
    return byLoc;
  }, [storages]);

  const locationKeys = Object.keys(grouped);

  return (
    <div className={styles.locationWrap}>
      {locationKeys.map((locKey) => (
        <div key={locKey} className={styles.locationGroup}>
          <div className={styles.locationHeader}>
            {locationsById[locKey] || (locKey === 'unassigned' ? 'Unassigned' : 'Unknown Location')}
          </div>
          <Row className={`g-3 mt-2 ${styles.storageGrid}`}>
            {grouped[locKey].map((storage) => (
              <Col key={storage.id} xs="auto" className={styles.storageCol}>
                <Card
                  className={styles.storageCard}
                  role="button"
                  onClick={() => router.push(`/storage/${storage.id}`)}
                >
                  <Card.Body className="text-center">
                    <div className={styles.storageIcon}>{getIcon(storage.type)}</div>
                    <Card.Title className={styles.storageTitle}>{storage.name}</Card.Title>
                    <Card.Text>
                      {storage.itemCount || 0}
                      items
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
  );
}
