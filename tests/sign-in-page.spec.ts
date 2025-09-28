import { test, expect, HOME_URL, SIGNUP_URL, SIGNIN_URL } from './auth-utils';

test.slow();
test.use({ viewport: { width: 1280, height: 800 } });
test('test sign in page', async ({ page }) => {
  // DEBUG: Listen for all console logs
  page.on('console', msg => console.log(msg.text()));

  await page.goto(HOME_URL);
  await page.waitForLoadState('domcontentloaded');
  const signInLink = page.getByTestId('navbar-sign-in-link');
  await expect(signInLink).toBeVisible();
  await signInLink.click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(SIGNIN_URL);

  const email = page.locator('input[name="email"]').first();
  const password = page.locator('input[name="password"]').first();
  const submit = page.getByTestId('sign-in-form-submit-button');

  // Expect the fields to be visible
  await expect(email).toBeVisible();
  await expect(password).toBeVisible();
  await expect(submit).toBeVisible();

  // Fill in credentials
  await email.fill('john@foo.com');
  await password.fill('changeme');

  // Expect the fields to have the correct values
  await expect(email).toHaveValue('john@foo.com');
  await expect(password).toHaveValue('changeme');

  // Submit the form
  await submit.click();

  // Wait for navigation and check we're not on error page
  await page.waitForLoadState('domcontentloaded');

  const userMenu = page.getByTestId('navbar-dropdown-title');
  await expect(userMenu).toBeVisible();
});

test('test sign in page goto sign up', async ({ page }) => {
  await page.goto(SIGNIN_URL);
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(SIGNIN_URL);

  // Click on the "Sign Up" link
  const signUpLink = page.getByTestId('sign-in-form-sign-up-link');
  await expect(signUpLink).toBeVisible();
  await signUpLink.click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(SIGNUP_URL);
});
