'use client';

import styles from './add.module.css';

const TIPS: string[] = [
  'Check expiry dates on packaging for accuracy',
  'Store similar items together for better organization',
  'Use “First In, First Out” principle for freshness',
];

export default function TipsPanel() {
  return (
    <section className={styles.panel}>
      <h3 className={styles.panelTitle}>💡 Smart Tips</h3>
      <ul style={{ margin: 0, paddingLeft: 18, color: '#6b7280', lineHeight: 1.6 }}>
        {TIPS.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  );
}
