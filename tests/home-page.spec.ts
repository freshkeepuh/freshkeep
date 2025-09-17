import { test, expect, BASE_URL } from './auth-utils';
import { Page } from '@playwright/test';

test.slow();
test.use({ viewport: { width: 1280, height: 800 } });
test('test access to home page (not signed in)', async ({ page }) => {
  // Navigate to the home page
  await page.goto(`${BASE_URL}/`);

  // Check that the FreshKeep Link is visible and works
  const freshKeepLink = await page.getByRole('link', { name: 'FreshKeep' });
  await expect(freshKeepLink).toBeVisible();
  await freshKeepLink.click();
  await expect(page).toHaveURL(`${BASE_URL}/`);

  // Check that the Login Link is visible and works
  const loginLink = await page.getByRole('link', { name: 'Login' });
  await expect(loginLink).toBeVisible();
  await loginLink.click();
  await expect(page).toHaveURL(`${BASE_URL}/auth/signin`);

  // Navigate back to home page
  await page.goto(`${BASE_URL}/`);
  await expect(page).toHaveURL(`${BASE_URL}/`);

  // Check that the About Link is visible and works
  const aboutLink = await page.getByRole('link', { name: 'About' });
  await expect(aboutLink).toBeVisible();
  await aboutLink.click();
  await expect(page).toHaveURL('https://docs.freshkeepuh.live/');
});

// test('dashboard is accessible after sign-in (simple)', async ({ page }) => {
//   const email = process.env.TEST_USER_EMAIL ?? 'john@foo.com';
//   const password = process.env.TEST_USER_PASSWORD ?? 'changeme';

//   // Go to sign-in and authenticate
//   await page.goto(`${BASE_URL}/auth/signin`);
//   await page.fill('input[name="email"]', email);
//   await page.fill('input[name="password"]', password);
//   await page.getByRole('button', { name: /sign in/i }).click();

//   // After login, navigate directly to the protected route
//   await page.waitForLoadState('networkidle');
//   await page.goto(`${BASE_URL}/dashboard`);
//   await expect(page).toHaveURL(new RegExp(`^${BASE_URL}/dashboard/?$`));
// });

test('dashboard is accessible after sign-in (simple)', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL ?? 'john@foo.com';
  const password = process.env.TEST_USER_PASSWORD ?? 'changeme';

  // Go to sign-in and authenticate
  await page.goto(`${BASE_URL}/auth/signin`);

  // Wait for the page to fully load
  await page.waitForLoadState('networkidle');

  // Fill in credentials
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  // Click sign in and wait for navigation
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.getByRole('button', { name: /sign in/i }).click(),
  ]);

  // Check if we were redirected to an error page
  const currentUrl = page.url();
  if (currentUrl.includes('/api/auth/error') || currentUrl.includes('/error')) {
    throw new Error(`Authentication failed - redirected to: ${currentUrl}`);
  }

  // Verify we're authenticated by checking for user indicators
  await expect(async () => {
    const isAuthenticated = await Promise.race([
      page.getByText(email).isVisible(),
      page.getByText('Sign out').isVisible(),
      page.getByRole('button', { name: 'Sign out' }).isVisible(),
      page.locator('[data-testid="user-menu"]').isVisible(),
      // Add a timeout
      new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 3000)),
    ]);
    expect(isAuthenticated).toBeTruthy();
  }).toPass({ timeout: 10000 });

  // Now try to access the dashboard
  await page.goto(`${BASE_URL}/dashboard`);

  // Wait for the page to load and check we're not redirected to error
  await page.waitForLoadState('networkidle');

  const finalUrl = page.url();
  if (finalUrl.includes('/api/auth/error') || finalUrl.includes('/error')) {
    throw new Error(`Dashboard access failed - redirected to: ${finalUrl}`);
  }

  await expect(page).toHaveURL(new RegExp(`^${BASE_URL}/dashboard/?$`));
});
