'use client';

import { useCallback } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

type Props = {
  expiresAt: string | undefined;
  setExpiresAt: (v: string | undefined) => void;
  picture: string | undefined;
  setPicture: (v: string | undefined) => void;
};

export default function ExpirySection({ expiresAt, setExpiresAt, picture, setPicture }: Props) {
  const onDate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value;
    setExpiresAt(v || undefined);
  }, [setExpiresAt]);

  const onPic = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value.trim();
    setPicture(v || undefined);
  }, [setPicture]);

  return (
    <Row className="g-3">
      <Col md={6}>
        <Form.Group controlId="expiresAt">
          <Form.Label>Best by (optional)</Form.Label>
          <Form.Control type="date" value={expiresAt ?? ''} onChange={onDate} />
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group controlId="picture">
          <Form.Label>Picture URL (optional)</Form.Label>
          <Form.Control type="url" placeholder="https://..." value={picture ?? ''} onChange={onPic} />
        </Form.Group>
      </Col>
    </Row>
  );
}
