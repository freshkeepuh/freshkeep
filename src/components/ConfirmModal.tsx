'use client';

import { useEffect, useRef } from 'react';
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  // Focus trap + ESC handling
  useEffect(() => {
    if (!open) {
      return () => {};
    }

    const cancelBtn = cancelBtnRef.current;
    const confirmBtn = confirmBtnRef.current;

    const focusable: HTMLElement[] = [];
    if (cancelBtn) focusable.push(cancelBtn);
    if (confirmBtn) focusable.push(confirmBtn);

    // focus first button when modal opens
    focusable[0]?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        return;
      }

      if (e.key === 'Tab' && focusable.length > 0) {
        e.preventDefault();
        const current = document.activeElement as HTMLElement | null;
        const currentIndex = current ? focusable.indexOf(current) : 0;
        const nextIndex =
          (currentIndex + (e.shiftKey ? -1 : 1) + focusable.length) %
          focusable.length;
        focusable[nextIndex].focus();
      }
    };

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onCancel]);
  // Close if clicking outside the dialog box
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="presentation"
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        className={styles.box}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-message"
      >
        <p id="confirm-modal-message" style={{ marginBottom: 20 }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            ref={cancelBtnRef}
            type="button"
            className={styles.cancel}
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            ref={confirmBtnRef}
            type="button"
            className={styles.delete}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
