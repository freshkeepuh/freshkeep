'use client';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import styles from '../../styles/dashboard.module.css';

interface StorageInstance {
  id: string;
  name: string;
  [key: string]: any; // Add more fields as needed
}
interface Storage {
  id: string;
  name: string;
  instances: StorageInstance[];
  createdAt?: string | null;
  updatedAt?: string | null;
  expiresAt?: string | null;
  [key: string]: any; // Add more fields as needed
}
type StorageDetailProps = {
  storage: Storage | any;
};

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return '—';
  }
}

function daysUntil(dateStr?: string | null) {
  if (!dateStr) return null;
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function getExpiryBadge(dte: number | null) {
  if (dte === null) {
    return <Badge bg="secondary">No date</Badge>;
  }

  if (dte < 0) {
    return (
      <Badge bg="danger">
        <div>Expired</div>
        <div>
          {Math.abs(dte)}
          d
        </div>
      </Badge>
    );
  }

  if (dte === 0) {
    return (
      <Badge bg="warning" text="dark">
        Expires today
      </Badge>
    );
  }

  if (dte <= 3) {
    return (
      <Badge bg="warning" text="dark">
        <div>
          {dte}
          d left
        </div>
      </Badge>
    );
  }

  return (
    <Badge bg="success">
      <div>
        {dte}
        d left
      </div>
    </Badge>
  );
}

export default function StorageDetail({ storage }: StorageDetailProps) {
  if (!storage) {
    return (
      <Container className="py-4">
        <div className="text-center py-5">
          <h3>Storage not found</h3>
        </div>
      </Container>
    );
  }

  const itemCount = Array.isArray(storage.instances) ? storage.instances.length : 0;

  return (
    <Container className="py-4">
      <div className={styles.mobileFixed}>
        <Card className="mb-4">
          <Card.Body>
            <Row className="align-items-center">
              <Col>
                <Card.Title className="mb-1">{storage.name}</Card.Title>
                {storage.location?.name ? (
                  <Card.Subtitle className="text-muted">{storage.location.name}</Card.Subtitle>
                ) : null}
              </Col>
              <Col xs="auto" className="text-end">
                <Badge bg="light" text="dark" className="me-2">
                  {itemCount}
                  {' '}
                  items
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        {
        itemCount ? (
          <Card>
            <Card.Body>
              <Card.Title className="mb-3">Items</Card.Title>
              <ListGroup variant="flush">
                {storage.instances && storage.instances.length > 0 ? (
                  storage.instances.map((inst: any) => {
                    const dte = daysUntil(inst.expiresAt);
                    const expiryBadge = getExpiryBadge(dte);
                    return (
                      <ListGroup.Item key={inst.id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <div>
                            <strong>
                              { inst.product?.name || 'Unknown product'}
                            </strong>
                            {inst.product?.brand ? ` · ${inst.product.brand}` : ''}
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                            {inst.product?.category || ''}
                            {inst.expiresAt ? ` · Exp: ${formatDate(inst.expiresAt)}` : ''}
                          </div>
                        </div>
                        <div className="text-end">
                          <div>
                            {inst.quantity}
                            {
                              inst.unit?.abbr || inst.unit?.name || ''
                            }
                          </div>
                          <div className="mt-1">
                            {expiryBadge}
                          </div>
                        </div>
                      </ListGroup.Item>
                    );
                  })
                ) : (
                  <ListGroup.Item>No items in this storage.</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        ) : ('')
      }
      </div>
    </Container>
  );
}
