import { test, expect, BASE_URL } from './auth-utils';

test.slow();
test.use({ viewport: { width: 1280, height: 800 } });
test('test access to welcome page (not signed in)', async ({ page }) => {
  // Navigate to the home page
  await page.goto(`${BASE_URL}`);

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(`${BASE_URL}/`);
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
});

/* heading removed 'Dashboard', need to re-add with proper test
test('test access to dashboard page (sign in)', async ({ getUserPage }) => {
  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const page = await getUserPage('john@foo.com', 'changeme');

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(`${BASE_URL}/`);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
 */
