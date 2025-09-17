// tests/sign-up-page.spec.ts
import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';
const SIGNUP_URL = `${BASE}/auth/signup`;

test('Sign Up renders and fields work', async ({ page }) => {
  await page.goto(SIGNUP_URL);

  // Page/heading present
  await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();

  // Robust selectors (works even if labels/placeholders aren’t associated)
  const email = page.locator('input[name="email"], input[type="email"], input#email').first();
  const password = page.locator('input[name="password"], input#password, input[type="password"]').first();
  const confirm = page
    .locator(
      'input[name="confirmPassword"], input#confirmPassword, input[aria-label*="confirm" i], input[placeholder*="confirm" i]',
    )
    .first();

  // Ensure inputs exist
  await expect(email).toBeVisible();
  await expect(password).toBeVisible();
  await expect(confirm).toBeVisible();

  // Fill + verify
  await email.fill('john@foo.com');
  await password.fill('changeme');
  await confirm.fill('changeme');
  await expect(email).toHaveValue('john@foo.com');
  await expect(password).toHaveValue('changeme');
  await expect(confirm).toHaveValue('changeme');

  // Reset clears
  await page.getByRole('button', { name: /reset/i }).click();
  await expect(email).toHaveValue('');
  await expect(password).toHaveValue('');
  await expect(confirm).toHaveValue('');

  // Register button visible
  await expect(page.getByRole('button', { name: /register/i })).toBeVisible();

  // (Optional) sign-in link exists
  await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
});
