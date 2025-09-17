import { test, expect } from './auth-utils';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.slow();
test('test sign in page', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/signin`);

  const email = page.locator('input[name="email"], input[type="email"], input#email').first();
  const password = page.locator('input[name="password"], input[type="password"], input#password').first();

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

  // Expect to be redirected to the homepage
  await page.goto(`${BASE_URL}/`);
});

test.slow();
test('test sign in page with Remember me option', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/signin`);

  const email = page.locator('input[name="email"], input[type="email"], input#email').first();
  const password = page.locator('input[name="password"], input[type="password"], input#password').first();

  // Expect the fields to be visible
  await expect(email).toBeVisible();
  await expect(password).toBeVisible();

  // Fill in credentials
  await email.fill('john@foo.com');
  await password.fill('changeme');

  // Check "Remember me option"
  await page.getByLabel('Remember me').check();

  // Expect the fields to have the correct values
  await expect(email).toHaveValue('john@foo.com');
  await expect(password).toHaveValue('changeme');
  await expect(page.getByLabel('Remember me')).toBeChecked();

  // Submit the form
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Expect to be redirected to the homepage
  await page.goto(`${BASE_URL}/`);
});

test.slow();
test('test sign in page with sign up option', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/signin`);

  // Click on the "Sign Up" link
  await page.getByRole('link', { name: 'Sign Up' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/auth/signup`);
});