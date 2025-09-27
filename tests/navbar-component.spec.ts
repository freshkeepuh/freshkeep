import { test, expect, BASE_URL, HOME_URL, SIGNIN_URL } from './auth-utils';

test.slow();
test.use({ viewport: { width: 1280, height: 800 } });
test('test access to navigation bar (not signed in)', async ({ page }) => {
  // Navigate to the home page
  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(HOME_URL);

  // Check that the FreshKeep Link is visible and works
  const freshKeepLink = await page.getByTestId('navbar-brand');
  await expect(freshKeepLink).toBeVisible();
  await freshKeepLink.click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(HOME_URL);

  // Check that the Sign In Link is visible and works
  const signinLink = await page.getByTestId('navbar-link-sign-in');
  await expect(signinLink).toBeVisible();
  await signinLink.click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(SIGNIN_URL);
});

test('test access to navigation bar (signed in)', async ({ getUserPage }) => {
  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const page = await getUserPage('john@foo.com', 'changeme');
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(HOME_URL);

  // Check that the FreshKeep Link is visible and works
  const freshKeepLink = await page.getByTestId('navbar-brand');
  await expect(freshKeepLink).toBeVisible();
  await freshKeepLink.click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(HOME_URL);

  // Check that the user's email is visible in the navbar
  await expect(page.getByTestId('navbar-dropdown-title')).toBeVisible();
});