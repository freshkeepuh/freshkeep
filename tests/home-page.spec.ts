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

test('dashboard is accessible after sign-in (simple)', async ({ page }) => {
  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const customUserPage = await getUserPage('john@foo.com', 'changeme');

  // Navigate to the home customUserPage
  await customUserPage.goto(`${BASE_URL}/dashboard`);
  await expect(customUserPage.getByRole('button', { name: 'john@foo.com' })).toBeVisible();
});
