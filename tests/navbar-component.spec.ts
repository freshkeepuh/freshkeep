import { TIMEOUT } from 'dns';
import { test, expect, BASE_URL } from './auth-utils';

test.slow();
test.use({ viewport: { width: 1280, height: 800 } });
/* test('test access to navigation bar (not signed in)', async ({ page }) => {
  // Navigate to the home page
  await page.goto(`${BASE_URL}`);
  await page.waitForLoadState('networkidle');

  // Check that the FreshKeep Link is visible and works
  const freshKeepLink = await page.getByTestId('navbar-brand');
  await expect(freshKeepLink).toBeVisible();
  await freshKeepLink.click();
  await page.waitForLoadState();
  await expect(page).toHaveURL(`${BASE_URL}/`);

  // Check that the Login Link is visible and works
  const loginLink = await page.getByTestId('navbar-link-signin');
  await expect(loginLink).toBeVisible();
});
*/
test('test access to navigation bar (signed in)', async ({ getUserPage }) => {
  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const page = await getUserPage('john@foo.com', 'changeme');
  await page.waitForLoadState();

  // Check that the FreshKeep Link is visible and works
  const freshKeepLink = await page.getByTestId('navbar-brand');
  await expect(freshKeepLink).toBeVisible();

  await freshKeepLink.click();
  await page.waitForLoadState();
  await expect(page).toHaveURL(`${BASE_URL}/`);
/*
  // Check that the user's email is visible in the navbar
  const accountLink = await page.getByTestId('navbar-dropdown-account');
  await expect(accountLink).toBeVisible(); */
});
