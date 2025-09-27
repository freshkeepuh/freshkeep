import { test, expect, BASE_URL } from './auth-utils';

test.slow();
test('test access to admin page', async ({ getUserPage }) => {
  // Call the getUserPage fixture with admin signin info to get authenticated session for admin
  const adminPage = await getUserPage('admin@foo.com', 'changeme');

  // Navigate to the home adminPage
  await adminPage.waitForLoadState('domcontentloaded');
  await expect(adminPage.getByRole('button', { name: 'admin@foo.com' })).toBeVisible();
});
