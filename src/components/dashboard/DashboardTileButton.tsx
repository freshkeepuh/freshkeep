'use client';

import React from 'react';
import { Card } from 'react-bootstrap';
import styles from '../../styles/dashboard.module.css';

interface DashboardTileButtonProps {
  icon: string;
  title: string;
  count: number;
  // eslint-disable-next-line react/require-default-props
  onClick?: () => void;
  // eslint-disable-next-line react/require-default-props
  className?: string;
}

// eslint-disable-next-line react/function-component-definition
const DashboardTileButton: React.FC<DashboardTileButtonProps> = ({
  icon,
  title,
  count,
  onClick,
  className,
}) => (
  <Card className={`${styles.card} ${className}`} onClick={onClick}>
    <div className={styles.cardIcon}>{icon}</div>
    <Card.Title>{title}</Card.Title>
    <Card.Text>{count}</Card.Text>
  </Card>
);

export default DashboardTileButton;
