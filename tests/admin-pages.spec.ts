import { test, expect } from './auth-utils';

test.slow();
test('test access to admin page', async ({ getUserPage }) => {
  // Call the getUserPage fixture with admin signin info to get authenticated session for admin
  const page = await getUserPage('admin@foo.com', 'changeme');

  // Navigate to the home page
  await page.waitForLoadState('domcontentloaded');
  const adminLink = page.getByTestId('navbar-dropdown-title');
  await expect(adminLink).toBeVisible();
});
