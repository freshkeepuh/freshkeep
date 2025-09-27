import { test, expect, HOME_URL, SIGNUP_URL, SIGNIN_REGEX, SIGNIN_URL, SIGNUP_REGEX } from './auth-utils';

test('test sign in page', async ({ page }) => {
  await page.goto(`${SIGNIN_URL}`);
  await page.waitForLoadState('domcontentloaded');

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
  await page.getByRole('button', { name: SIGNIN_REGEX }).click();

  // Wait for navigation and check we're not on error page
  await page.waitForLoadState('domcontentloaded');

  // Expect to be redirected to the homepage
  await expect(page).toHaveURL(`${HOME_URL}`);
});

test('test sign in page with Remember me option', async ({ page }) => {
  await page.goto(`${SIGNIN_URL}`);
  await page.waitForLoadState('domcontentloaded');

  const email = page.locator('input[name="email"], input[type="email"]').first();
  const password = page.locator('input[name="password"], input[type="password"]').first();

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
  await page.getByRole('button', { name: SIGNIN_REGEX }).click();

  // Wait for navigation and check we're not on error page
  await page.waitForLoadState('domcontentloaded');

  // Expect to be redirected to the homepage
  await expect(page).toHaveURL(`${HOME_URL}`);
});

test('test sign in page goto sign up', async ({ page }) => {
  await page.goto(`${SIGNIN_URL}`);

  // Click on the "Sign Up" link
  await page.getByRole('link', { name: SIGNUP_REGEX }).click();
  await expect(page).toHaveURL(`${SIGNUP_URL}`);
});