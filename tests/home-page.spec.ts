import { test, expect, BASE_URL, HOME_URL } from './auth-utils';

test.slow();
test.use({ viewport: { width: 1280, height: 800 } });
test('test access to welcome page (not signed in)', async ({ page }) => {
  // Navigate to the home page
  await page.goto(`${BASE_URL}`);
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(`${HOME_URL}`);
  const welcomeHeading = page.getByRole('heading', { name: /welcome/i });
  await expect(welcomeHeading).toBeVisible();
});

test('test access to dashboard page (signed in)', async ({ getUserPage }) => {
  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const page = await getUserPage('john@foo.com', 'changeme');
  await page.waitForLoadState('domcontentloaded');
  await page.goto(`${BASE_URL}`);
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(`${HOME_URL}`);
  const dashboardHeading = page.getByRole('heading', { name: /dashboard/i });
  await expect(dashboardHeading).toBeVisible();
});
