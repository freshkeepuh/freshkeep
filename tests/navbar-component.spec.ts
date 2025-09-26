import { test, expect, BASE_URL } from './auth-utils';

test.slow();
test.use({ viewport: { width: 1280, height: 800 } });
test('test access to navigation bar (not signed in)', async ({ page }) => {
  // Navigate to the home page
  await page.goto(`${BASE_URL}`);
  await page.waitForLoadState('networkidle');

  // Check that the FreshKeep Link is visible and works
  const freshKeepLink = await page.getByRole('link', { name: 'FreshKeep' });
  await expect(freshKeepLink).toBeVisible();
  await freshKeepLink.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(`${BASE_URL}/`);

  // Check that the Login Link is visible and works
  const loginLink = await page.getByRole('link', { name: /sign[ -]?in/i });
  await expect(loginLink).toBeVisible();
  await loginLink.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(`${BASE_URL}/auth/signin`);
});
test('test access to navigation bar (signed in)', async ({ getUserPage }) => {
  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const customUserPage = await getUserPage('john@foo.com', 'changeme');
  await customUserPage.waitForLoadState('networkidle');

  // Check that the FreshKeep Link is visible and works
  const freshKeepLink = await customUserPage.getByRole('link', { name: 'FreshKeep' });
  await expect(freshKeepLink).toBeVisible();
  await freshKeepLink.click();
  await customUserPage.waitForLoadState('networkidle');
  await expect(customUserPage).toHaveURL(`${BASE_URL}/`);

  // Check that the user's email is visible in the navbar
  await expect(customUserPage.getByRole('button', { name: 'john@foo.com' })).toBeVisible();
});