import { test, expect, BASE_URL } from './auth-utils';

test.slow();
test('test access to user page', async ({ getUserPage }) => {
  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const customUserPage = await getUserPage('john@foo.com', 'changeme');

  // Navigate to the home customUserPage
  await customUserPage.goto(`${BASE_URL}`);
  await customUserPage.waitForLoadState('networkidle');
  await expect(customUserPage.getByRole('button', { name: 'john@foo.com' })).toBeVisible();
});
