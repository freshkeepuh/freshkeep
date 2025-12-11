'use client';

import { useState } from 'react';
import { X } from 'react-bootstrap-icons';
import { useRouter } from 'next/navigation';
import styles from '@/app/recipes/page.module.css';
import ConfirmModal from './ConfirmModal';

interface DeleteRecipeButtonProps {
  recipeId: string;
  variant: 'ondetail' | 'oncard';
}

export default function DeleteRecipeButton({
  recipeId,
  variant = 'ondetail',
}: DeleteRecipeButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const wrapperClass =
    variant === 'ondetail' ? styles.rpFavOnDetail : styles.rpFavOnCard;

  const handleDelete = async () => {
    setError(null);

    try {
      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        // Error message
        const message = await res.text().catch(() => '');
        setError(message || 'Failed to delete recipe. Please try again.');
        return;
      }

      // Client-side navigation
      router.push('/recipes');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      // Close the modal regardless of success/failure
      setOpen(false);
    }
  };

  return (
    <>
      {/* Delete icon button */}
      <button
        type="button"
        className={`${styles.rpFavBtn} ${wrapperClass}`}
        onClick={() => setOpen(true)}
        data-tip="Delete"
        aria-label="Delete"
      >
        <X className={styles.rpFavIcon} style={{ color: '#b91c1c' }} />
      </button>

      {/* Simple modal */}
      <ConfirmModal
        open={open}
        message="Delete this recipe?"
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
      />

      {error && (
        <p
          style={{
            color: '#b91c1c',
            marginTop: 8,
            fontSize: 14,
          }}
        >
          {error}
        </p>
      )}
    </>
  );
}
