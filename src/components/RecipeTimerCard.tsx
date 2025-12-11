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
  // Simple input error message
  const [inputError, setInputError] = useState<string | null>(null);

  // Countdown
  useEffect(() => {
    if (!running) {
      return () => {};
    }

    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // stop at 0
          clearInterval(id);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [running]);

  // Format MM:SS
  const m = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0');
  const s = (secondsLeft % 60).toString().padStart(2, '0');

  // Handle minutes input + basic validation
  const handleMinutesChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setMinutesInput(value);

    const mins = Number(value);
    if (value === '') {
      setInputError('Please enter minutes.');
    } else if (!Number.isFinite(mins) || mins < 1) {
      setInputError('Minutes must be at least 1.');
    } else {
      setInputError(null);
    }
  };

  // Set new minutes
  const applyMinutes = () => {
    const mins = Number(minutesInput);
    if (!Number.isFinite(mins) || mins < 1) {
      return;
    }
    setRunning(false);
    setSecondsLeft(mins * 60);
  };

  // Reset timer
  const reset = () => {
    const parsed = Number(minutesInput);
    const mins =
      !Number.isFinite(parsed) || parsed < 1 ? defaultMinutes : parsed;

    setRunning(false);
    setSecondsLeft(mins * 60);
    setMinutesInput(String(mins));
    setInputError(null);
  };

  // For warning / done
  let extraClass = '';
  if (secondsLeft === 0) {
    extraClass = styles.rpTimerDone; // Red + Animation
  } else if (secondsLeft < 10) {
    // "fewer than 10 seconds remaining"
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
      <div
        className={styles.rpRow}
        style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <input
            type="number"
            min="1"
            value={minutesInput}
            onChange={handleMinutesChange}
            className={styles.rpTimerInput}
          />
          <button
            type="button"
            className={styles.rpBtnSecondary}
            onClick={applyMinutes}
            disabled={!!inputError}
          >
            Set
          </button>
        </div>
        {inputError && (
          <p style={{ color: 'red', fontSize: 14, marginTop: 4 }}>
            {inputError}
          </p>
        )}
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
