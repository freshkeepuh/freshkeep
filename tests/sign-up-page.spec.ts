import { deleteUser } from '@/lib/dbUserActions';
import { test, expect, SIGNUP_URL, RESET_REGEX, SIGNIN_REGEX, SIGNIN_URL, SIGNUP_REGEX, HOME_URL } from './auth-utils';

test('test sign up page with reset', async ({ page }) => {
  await page.goto(SIGNUP_URL);
  await page.waitForLoadState();
  await expect(page).toHaveURL(`${SIGNUP_URL}`);

  const email = page.locator('input[name="email"]');
  const password = page.locator('input[name="password"]');
  const confirm = page.locator('input[name="confirmPassword"]');

  // Expect the fields to be visible
  await expect(email).toBeVisible();
  await expect(password).toBeVisible();
  await expect(confirm).toBeVisible();

  // Fill in credentials
  await email.fill('john@foo.com');
  await password.fill('changeme');
  await confirm.fill('changeme');

  // Expect the fields to have the correct values
  await expect(email).toHaveValue('john@foo.com');
  await expect(password).toHaveValue('changeme');
  await expect(confirm).toHaveValue('changeme');

  // Reset the form
  await page.getByRole('button', { name: RESET_REGEX }).click();
  await page.waitForLoadState();
  await expect(page).toHaveURL(`${SIGNUP_URL}`);

  // Expect the fields to be cleared
  await expect(email).toHaveValue('');
  await expect(password).toHaveValue('');
  await expect(confirm).toHaveValue('');
});

test('test sign up page with create', async ({ page }) => {
  await page.goto(SIGNUP_URL);
  await page.waitForLoadState();
  await expect(page).toHaveURL(`${SIGNUP_URL}`);

  const email = page.locator('input[name="email"]').first();
  const password = page.locator('input[name="password"]').first();
  const confirm = page.locator('input[name="confirmPassword"]').first();

  // Expect the fields to be visible
  await expect(email).toBeVisible();
  await expect(password).toBeVisible();
  await expect(confirm).toBeVisible();

  const rand = Math.floor((Math.random() * 10000) + 1);
  const emailAddress = `josh${rand}@foo.com`;

  // Clean up - delete the user we are about to create
  await deleteUser({ email: emailAddress });

  // Fill in credentials
  await email.fill(emailAddress);
  await password.fill('sixer1');
  await confirm.fill('sixer1');

  // Expect the fields to have the correct values
  await expect(email).toHaveValue(emailAddress);
  await expect(password).toHaveValue('sixer1');
  await expect(confirm).toHaveValue('sixer1');
  
  try {
    // Submit the form
    await page.getByRole('button', { name: SIGNUP_REGEX }).click();
    await page.waitForLoadState();

    // Expect to be redirected to the homepage
    await expect(page).toHaveURL(`${HOME_URL}`);
  } catch (error) {
    throw error;
  } finally {
    // Clean up - delete the user we just created
    await deleteUser({ email: emailAddress });
  }
});

test('test sign up page goto sign in', async ({ page }) => {
  await page.goto(`${SIGNUP_URL}`);
  await page.waitForLoadState();
  await expect(page).toHaveURL(`${SIGNUP_URL}`);

  // Click on the "Sign In" link
  await page.getByRole('link', { name: SIGNIN_REGEX }).last().click();
  await page.waitForLoadState();

  // Expect to be on the sign in page
  await expect(page).toHaveURL(`${SIGNIN_URL}`);
});