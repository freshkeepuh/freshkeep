/* eslint-disable react/prop-types */

'use client';

import { Card } from 'react-bootstrap';
import styles from '../../styles/dashboard.module.css';

interface DashboardTileButtonProps {
  icon: string;
  title: string;
  count: number;
  onClick?: () => void;
  className?: string;
}

const DashboardTileButton: React.FC<DashboardTileButtonProps> = ({ icon, title, count, onClick, className }) => (
  <Card className={`${styles.card} ${className}`} onClick={onClick}>
    <div className={styles.cardIcon}>{icon}</div>
    <Card.Title>{title}</Card.Title>
    <Card.Text>{count}</Card.Text>
  </Card>
);

export default DashboardTileButton;
