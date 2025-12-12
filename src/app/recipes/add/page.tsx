import path from 'node:path';
import fs from 'node:fs/promises';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import type { RecipeDifficulty, RecipeDiet } from '@prisma/client';
import AddRecipeForm from '@/components/AddRecipeForm';
import styles from './recipesPage.module.css';

export const runtime = 'nodejs'; // ensure we can use the filesystem

// "Furikake Salmon Bowl" -> "furikake-salmon-bowl"
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Save uploaded image into /public/uploads and return its URL
async function saveImageFile(file: File, slug: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const originalName = file.name || 'image';
  const ext = path.extname(originalName) || '.png';
  const fileName = `${slug}-${Date.now()}${ext}`;

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}

function resolveDifficulty(raw: string): RecipeDifficulty {
  const allowed: RecipeDifficulty[] = ['EASY', 'NORMAL', 'HARD'];

  if (raw === 'ANY') {
    return 'EASY';
  }

  if (allowed.includes(raw as RecipeDifficulty)) {
    return raw as RecipeDifficulty;
  }

  return 'EASY';
}

function resolveDiet(raw: string): RecipeDiet {
  const allowed: RecipeDiet[] = ['VEGAN', 'VEGETARIAN', 'PESCETARIAN'];

  if (raw === 'ANY') {
    return 'VEGETARIAN';
  }

  if (allowed.includes(raw as RecipeDiet)) {
    return raw as RecipeDiet;
  }

  return 'VEGETARIAN';
}

async function createRecipe(formData: FormData) {
  'use server';

  const title = (formData.get('title') ?? '').toString().trim();
  if (!title) {
    throw new Error('Please enter a title for your recipe.');
  }

  const slug = slugify(title);

  const cookTimeStr = (formData.get('cookTime') ?? '').toString().trim();
  const cookTime = Number(cookTimeStr || '0');
  if (Number.isNaN(cookTime) || cookTime <= 0) {
    throw new Error('Cook time must be a positive number of minutes.');
  }

  const difficultyRaw = (formData.get('difficulty') ?? 'ANY').toString();
  const difficulty = resolveDifficulty(difficultyRaw);

  const dietRaw = (formData.get('diet') ?? 'ANY').toString();
  const diet = resolveDiet(dietRaw);

  const ingredientsRaw = (formData.get('ingredients') ?? '').toString();
  const ingredients = ingredientsRaw
    .split('\n')
    .map((i) => i.trim())
    .filter(Boolean);

  const instructionsRaw = (formData.get('instructions') ?? '').toString();
  const instructions = instructionsRaw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  // Optional image
  let image: string | null = null;
  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    try {
      image = await saveImageFile(imageFile, slug || 'recipe');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error uploading image:', err);
      image = null; // Proceed without image
    }
  }

  try {
    await prisma.recipe.create({
      data: {
        title,
        slug,
        cookTime,
        difficulty,
        diet,
        ingredients,
        instructions,
        image,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error creating recipe:', err);
    throw new Error(
      'We couldn’t save this recipe. Please double-check the fields and try again.',
    );
  }

  redirect('/recipes');
}

export default function Page() {
  return (
    <div className={styles.rpPage}>
      <main className={styles.rpMain}>
        <div className={styles.rpMainInner}>
          {/* Back button */}
          <Link href="/recipes" className={styles.rpBackBtn}>
            <span className={styles.rpBackIcon}>←</span>
            Back to Recipes
          </Link>

          {/* Card container for the form */}
          <section className={styles.rpCard}>
            <div className={styles.rpBlock}>
              <h1 className={styles.rpH1}>Add a New Recipe</h1>
              <p className={styles.rpText}>
                Upload a photo, set the cook time and difficulty, and add
                ingredients and step-by-step instructions.
              </p>
            </div>

            <AddRecipeForm action={createRecipe} />
          </section>
        </div>
      </main>
    </div>
  );
}
