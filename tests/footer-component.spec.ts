import { test, expect, BASE_URL } from './auth-utils';

test.slow();
test.use({ viewport: { width: 1280, height: 800 } });
test('test access to footer (not signed in)', async ({ page }) => {
  // Navigate to the home page
  await page.goto(`${BASE_URL}`);
  await page.waitForLoadState('networkidle');

  // Check that the About Link is visible and works
  const aboutLink = await page.getByRole('link', { name: 'About' });
  await expect(aboutLink).toBeVisible();
  await aboutLink.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL('https://docs.freshkeepuh.live/');
});

test('test access to footer (signed in)', async ({ getUserPage }) => {
  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const customUserPage = await getUserPage('john@foo.com', 'changeme');

  // Check that the About Link is visible and works
  const aboutLink = await customUserPage.getByRole('link', { name: 'About' });
  await expect(aboutLink).toBeVisible();
  await aboutLink.click();
  await customUserPage.waitForLoadState('networkidle');
  await expect(customUserPage).toHaveURL('https://docs.freshkeepuh.live/');
});