import { test, expect } from './auth-utils';

test.slow();
test('test access to user page', async ({ getUserPage }) => {
  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const page = await getUserPage('john@foo.com', 'changeme');

  // Navigate to the home page
  await page.waitForLoadState('domcontentloaded');
  await expect(page.getByTestId('navbar-dropdown-title')).toBeVisible();
});
