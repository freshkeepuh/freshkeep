import { test, expect, BASE_URL, HOME_URL, SIGNIN_REGEX, SIGNIN_URL } from './auth-utils';

test.slow();
test.use({ viewport: { width: 1280, height: 800 } });
test('test access to navigation bar (not signed in)', async ({ page }) => {
  // Navigate to the home page
  await page.goto(`${BASE_URL}`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(`${HOME_URL}`);

  // Check that the FreshKeep Link is visible and works
  const freshKeepLink = await page.getByRole('link', { name: 'FreshKeep' });
  await expect(freshKeepLink).toBeVisible();
  await freshKeepLink.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(`${HOME_URL}`);

  // Check that the Login Link is visible and works
  const loginLink = await page.getByRole('link', { name: SIGNIN_REGEX });
  await expect(loginLink).toBeVisible();
  await loginLink.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(`${SIGNIN_URL}`);
});

test('test access to navigation bar (signed in)', async ({ getUserPage }) => {
  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const page = await getUserPage('john@foo.com', 'changeme');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(`${HOME_URL}`);

  // Check that the FreshKeep Link is visible and works
  const freshKeepLink = await page.getByRole('link', { name: 'FreshKeep' });
  await expect(freshKeepLink).toBeVisible();
  await freshKeepLink.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(`${HOME_URL}`);

  // Check that the user's email is visible in the navbar
  await expect(page.getByRole('button', { name: 'john@foo.com' })).toBeVisible();
});