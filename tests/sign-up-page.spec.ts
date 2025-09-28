import { deleteUser } from '@/lib/dbUserActions';
import { test, expect, SIGNUP_URL, SIGNIN_URL, HOME_URL } from './auth-utils';

const generateRandomEmail = () => {
  const rand = Math.floor((Math.random() * 10000) + 1);
  return `user${rand}@example.com`;
};

const generateRandomPassword = (length: number) => {
  return Array.from({ length }, () =>
    Math.random().toString(36).charAt(2)
  ).join('');
};

test.slow();
test.use({ viewport: { width: 1280, height: 800 } });
test('test sign up page with reset', async ({ page }) => {
  await page.goto(SIGNUP_URL);
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(`${SIGNUP_URL}`);

  const email = page.locator('input[name="email"]');
  const password = page.locator('input[name="password"]');
  const confirm = page.locator('input[name="confirmPassword"]');
  const resetButton = page.getByTestId('sign-up-form-reset-button');

  // Expect the fields to be visible
  await expect(email).toBeVisible();
  await expect(password).toBeVisible();
  await expect(confirm).toBeVisible();
  await expect(resetButton).toBeVisible();

  // Fill in credentials
  await email.fill('john@foo.com');
  await password.fill('changeme');
  await confirm.fill('changeme');

  // Expect the fields to have the correct values
  await expect(email).toHaveValue('john@foo.com');
  await expect(password).toHaveValue('changeme');
  await expect(confirm).toHaveValue('changeme');

  // Reset the form
  await resetButton.click();
  await page.waitForLoadState('domcontentloaded');

  // Expect the fields to be cleared
  await expect(email).toHaveValue('');
  await expect(password).toHaveValue('');
  await expect(confirm).toHaveValue('');
});

test('test sign up page with create', async ({ page }) => {
  await page.goto(SIGNUP_URL);
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(`${SIGNUP_URL}`);

  const email = page.locator('input[name="email"]').first();
  const password = page.locator('input[name="password"]').first();
  const confirm = page.locator('input[name="confirmPassword"]').first();
  const submitButton = page.getByTestId('sign-up-form-submit-button');

  // Expect the fields to be visible
  await expect(email).toBeVisible();
  await expect(password).toBeVisible();
  await expect(confirm).toBeVisible();
  await expect(submitButton).toBeVisible();

  // Generate random email and password
  const emailAddress = generateRandomEmail();
  const passwordText = generateRandomPassword(8);

  // Fill in credentials
  await email.fill(emailAddress);
  await password.fill(passwordText);
  await confirm.fill(passwordText);

  // Expect the fields to have the correct values
  await expect(email).toHaveValue(emailAddress);
  await expect(password).toHaveValue(passwordText);
  await expect(confirm).toHaveValue(passwordText);
  
  try {
    // Submit the form
    await submitButton.click();
    await page.waitForLoadState('domcontentloaded');

    const userMenu = page.getByTestId('navbar-dropdown-title');
    await expect(userMenu).toBeVisible();
  } catch (error) {
    throw error;
  } finally {
    // Clean up - delete the user we just created
    await deleteUser({ email: emailAddress });
  }
});

test('test sign up page goto sign in', async ({ page }) => {
  await page.goto(SIGNUP_URL);
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(SIGNUP_URL);

  // Click on the "Sign In" link
  const signInLink = page.getByTestId('sign-up-form-sign-in-link');
  await expect(signInLink).toBeVisible();
  await signInLink.click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(SIGNIN_URL);
});
