import { test, expect, BASE_URL } from './auth-utils';

test('test sign in page', async ({ page }) => {
  await page.goto(`${BASE_URL}/auth/signin`);
  await page.waitForLoadState('networkidle');

  const email = page.locator('input[name="email"], input[type="email"]').first();
  const password = page.locator('input[name="password"], input[type="password"]').first();

  // Expect the fields to be visible
  await expect(email).toBeVisible();
  await expect(password).toBeVisible();

  // Fill in credentials
  await email.fill('john@foo.com');
  await password.fill('changeme');

  // Expect the fields to have the correct values
  await expect(email).toHaveValue('john@foo.com');
  await expect(password).toHaveValue('changeme');

  // Submit the form
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Wait for navigation and check we're not on error page
  await page.waitForLoadState('networkidle');

  // Expect to be redirected to the homepage
  await expect(page).toHaveURL(`${BASE_URL}/`);
});

test('test sign in page with sign up option', async ({ page }) => {
  await page.goto(`${BASE_URL}/auth/signin`);

  // Click on the "Sign Up" link
  await page.getByRole('link', { name: 'Sign Up' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/auth/signup`);
});