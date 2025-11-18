"use client";

import { useState, useTransition, FormEvent } from "react";
import Link from "next/link";

import { DIFFICULTY_OPTIONS, DIET_OPTIONS } from "@/lib/recipeUI";
import styles from "./recipesPage.module.css";

type AddRecipeFormProps = {
  action: (formData: FormData) => Promise<void>;
};

// Red asterisk that fades in when the field is invalid
const RequiredStar = ({ active }: { active: boolean }) => (
  <span
    style={{
      color: "#d93025",
      marginLeft: 4,
      opacity: active ? 1 : 0,
      transition: "opacity 0.25s ease",
    }}
  >
    *
  </span>
);

export default function AddRecipeForm({ action }: AddRecipeFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const validate = (formData: FormData) => {
    const errors: Record<string, string> = {};

    // Title
    if (!formData.get("title")?.toString().trim()) {
      errors.title = "Title is required.";
    }

    // Ingredients
    const ingredients = formData.get("ingredients")?.toString().trim();
    if (!ingredients) {
      errors.ingredients = "At least one ingredient is required.";
    }

    // Instructions
    const instructions = formData.get("instructions")?.toString().trim();
    if (!instructions) {
      errors.instructions = "Instructions are required.";
    }

    // Cook time – required and must be > 0
    const cookTimeRaw = formData.get("cookTime")?.toString().trim();
    const cookTimeNum = Number(cookTimeRaw);

    if (!cookTimeRaw) {
      errors.cookTime = "Cook time is required.";
    } else if (Number.isNaN(cookTimeNum) || cookTimeNum <= 0) {
      errors.cookTime = "Cook time must be greater than zero.";
    }

    return errors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const foundErrors = validate(formData);
    setFieldErrors(foundErrors);

    if (Object.keys(foundErrors).length > 0) {
      setError("Please fix the highlighted fields.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await action(formData);
      } catch (err: any) {
        setError(
          err?.message ?? "Something went wrong while creating the recipe."
        );
      }
    });
  };

  const errorClass = (field: string) =>
    fieldErrors[field] ? "form-control is-invalid" : "form-control";

  return (
    <form
      onSubmit={handleSubmit}
      className="row g-3"
      encType="multipart/form-data"
    >
      {/* Top-level error */}
      {error && (
        <div className="col-12">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      )}

      {/* Title */}
      <div className="col-12">
        <label htmlFor="title" className="form-label fw-semibold">
          Title <RequiredStar active={!!fieldErrors.title} />
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={errorClass("title")}
          placeholder="Furikake Salmon Bowl"
        />
        {fieldErrors.title && (
          <div className="invalid-feedback">{fieldErrors.title}</div>
        )}
      </div>

      {/* Cook Time */}
      <div className="col-12" style={{ maxWidth: "250px" }}>
        <label htmlFor="cookTime" className="form-label fw-semibold">
          Cook Time (minutes) <RequiredStar active={!!fieldErrors.cookTime} />
        </label>
        <input
          id="cookTime"
          name="cookTime"
          type="number"
          min={1}
          className={errorClass("cookTime")}
          placeholder="30"
        />
        {fieldErrors.cookTime && (
          <div className="invalid-feedback">{fieldErrors.cookTime}</div>
        )}
      </div>

      {/* Difficulty + Diet + Image */}
      <div className="col-12">
        <div className={styles.rpGrid3}>
          {/* Difficulty */}
          <div>
            <label htmlFor="difficulty" className="form-label fw-semibold">
              Difficulty <RequiredStar active={false} />
            </label>
            <select
              id="difficulty"
              name="difficulty"
              className={styles.rpSelect}
              defaultValue="ANY"
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Diet */}
          <div>
            <label htmlFor="diet" className="form-label fw-semibold">
              Diet <RequiredStar active={false} />
            </label>
            <select
              id="diet"
              name="diet"
              className={styles.rpSelect}
              defaultValue="ANY"
            >
              {DIET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="form-label fw-semibold">
              Recipe Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="form-control"
            />
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="col-12">
        <label htmlFor="ingredients" className="form-label fw-semibold">
          Ingredients (one per line)
          <RequiredStar active={!!fieldErrors.ingredients} />
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          className={errorClass("ingredients")}
          rows={6}
          placeholder={`Salmon fillet\nFurikake\nRice\nSoy sauce\nGreen onions`}
        />
        {fieldErrors.ingredients && (
          <div className="invalid-feedback">{fieldErrors.ingredients}</div>
        )}
      </div>

      {/* Instructions */}
      <div className="col-12">
        <label htmlFor="instructions" className="form-label fw-semibold">
          Instructions (each step on a new line)
          <RequiredStar active={!!fieldErrors.instructions} />
        </label>
        <textarea
          id="instructions"
          name="instructions"
          className={errorClass("instructions")}
          rows={8}
          placeholder={`Preheat oven to 400°F (200°C)\nSeason salmon with salt and pepper\nSpread mayo on top, sprinkle furikake\nBake 12–15 minutes until cooked through`}
        />
        {fieldErrors.instructions && (
          <div className="invalid-feedback">{fieldErrors.instructions}</div>
        )}
      </div>

      {/* Buttons */}
      <div className="col-12 d-flex gap-2 mt-3">
        <button
          type="submit"
          className={styles.rpBtnDark}
          disabled={isPending}
        >
          {isPending ? "Saving…" : "Save Recipe"}
        </button>

        <Link href="/recipes" className={styles.rpBtnSecondary}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
