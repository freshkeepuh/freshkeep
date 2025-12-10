'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/recipes/page.module.css';

interface RecipeTimerCardProps {
  defaultMinutes: number;
}

export default function RecipeTimerCard({
  defaultMinutes = 1,
}: RecipeTimerCardProps) {
  // User's minute input
  const [minutesInput, setMinutesInput] = useState(String(defaultMinutes));
  // Total seconds on the timer
  const [secondsLeft, setSecondsLeft] = useState(defaultMinutes * 60);
  // Whether the timer is running
  const [running, setRunning] = useState(false);

  // Countdown
  useEffect(() => {
    let id: ReturnType<typeof setInterval> | null = null;

    if (running) {
      id = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            // stop at 0
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [running]);

  // Format MM:SS
  const m = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0');
  const s = (secondsLeft % 60).toString().padStart(2, '0');

  // Set new minutes
  const applyMinutes = () => {
    const mins = Number(minutesInput);
    if (!mins || mins <= 0) return;
    setRunning(false);
    setSecondsLeft(mins * 60);
  };

  // Reset timer
  const reset = () => {
    const mins = Number(minutesInput) || defaultMinutes;
    setRunning(false);
    setSecondsLeft(mins * 60);
  };

  // Extra class for warning / done (no nested ternary)
  let extraClass = '';
  if (secondsLeft === 0) {
    extraClass = styles.rpTimerDone; // Red + Animation
  } else if (secondsLeft <= 10) {
    extraClass = styles.rpTimerWarn; // Orange
  }

  return (
    <div className={styles.rpCard}>
      {/* Header */}
      <div
        className={styles.rpRow}
        style={{ alignItems: 'center', marginBottom: 10 }}
      >
        <span style={{ fontSize: 25 }}>⏱️</span>
        <h2 className={styles.rpH1}>Timer</h2>
      </div>

      {/* Minutes input */}
      <div className={styles.rpRow} style={{ marginBottom: 12 }}>
        <input
          type="number"
          min="1"
          value={minutesInput}
          onChange={(e) => setMinutesInput(e.target.value)}
          className={styles.rpTimerInput}
        />
        <button
          type="button"
          className={styles.rpBtnSecondary}
          onClick={applyMinutes}
        >
          Set
        </button>
      </div>

      {/* Timer display with warning color + time-up animation */}
      <div className={`${styles.rpTimerDisplay} ${extraClass}`}>
        {m}:{s}
      </div>

      <div className={styles.rpRow}>
        <button
          type="button"
          className={styles.rpBtnDark}
          onClick={() => setRunning(true)}
          disabled={running || secondsLeft === 0}
        >
          Start
        </button>

        <button
          type="button"
          className={styles.rpBtnSecondary}
          onClick={() => setRunning(false)}
          disabled={!running}
        >
          Pause
        </button>

        <button type="button" className={styles.rpBtnSecondary} onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
