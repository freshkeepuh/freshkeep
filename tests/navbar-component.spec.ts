import { test, expect, BASE_URL, SIGNIN_URL } from './auth-utils';
import * as config from '../config/settings.development.json';

test.slow();
test.use({ viewport: { width: 1280, height: 800 } });
test('test access to navigation bar (not signed in)', async ({ page }) => {
  // Navigate to the home page
  await page.goto(BASE_URL);
  await page.waitForLoadState('domcontentloaded');

  // Check that the FreshKeep Link is visible and works
  const freshKeepLink = page.getByTestId('navbar-brand');
  await expect(freshKeepLink).toBeVisible();
  await freshKeepLink.click();
  await page.waitForLoadState('domcontentloaded');

  // Check that the Sign In Link is visible and works
  const signinLink = page.getByTestId('navbar-sign-in-link');
  await expect(signinLink).toBeVisible();
  await signinLink.click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(SIGNIN_URL);
});

test('test access to navigation bar (signed in)', async ({ getUserPage }) => {
  for (const account of config.defaultAccounts) {
    // Call the getUserPage fixture with users signin info to get authenticated session for user
    const page = await getUserPage(account.email, account.password);
    await page.waitForLoadState('domcontentloaded');

    // Check that the FreshKeep Link is visible and works
    const freshKeepLink = page.getByTestId('navbar-brand');
    await expect(freshKeepLink).toBeVisible();
    await freshKeepLink.click();
    await page.waitForLoadState('domcontentloaded');

    // Check that the user's email is visible in the navbar
    const userMenu = page.getByTestId('navbar-dropdown-title');
    await expect(userMenu).toBeVisible();
    await expect(userMenu).toHaveText(account.email);

    // Open the user dropdown menu
    await userMenu.click();
    await page.waitForLoadState('domcontentloaded');

    // Check that the Sign Out link is visible and works
    const signOutLink = page.getByTestId('navbar-sign-out-link');
    await expect(signOutLink).toBeVisible();
    await signOutLink.click();
    await page.waitForLoadState('domcontentloaded');
    const signInLink = page.getByTestId('navbar-sign-in-link');
    await expect(signInLink).toBeVisible();
  }
});
