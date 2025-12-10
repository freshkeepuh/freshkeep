'use client';

import { useState } from 'react';
import { X } from 'react-bootstrap-icons';
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

  const wrapperClass =
    variant === 'ondetail' ? styles.rpFavOnDetail : styles.rpFavOnCard;

  const handleDelete = async () => {
    const res = await fetch(`/api/recipes/${recipeId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      window.location.href = '/recipes';
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
    </>
  );
}
