'use client';

import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
  open: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  open,
  message,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <p style={{ marginBottom: 20 }}>{message}</p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>

          <button type="button" className={styles.delete} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
