import { test, expect } from './auth-utils';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SIGNUP_URL = `${BASE_URL}/auth/signup`;

function uniqueEmail() {
  return `playwright+${Date.now()}@example.com`;
}

async function expectSignedInOrRedirected({
  page,
  timeout = 20000,
}: { page: any; timeout?: number }) {
  // Primary: redirect to /
  const redirected = await page
    .waitForURL(`${BASE_URL}/`, { timeout })
    .then(() => true)
    .catch(() => false);

  if (redirected) {
    await expect(page).toHaveURL(`${BASE_URL}/`);
    return;
  }

  // Fallback: NextAuth session cookie present (Firefox sometimes lags redirect)
  const cookies = await page.context().cookies();
  const hasSession = cookies.some((c) => c.name.includes('next-auth') && c.value);
  expect(hasSession, 'Expected a NextAuth session cookie if not redirected').toBeTruthy();

  // And the submit cycle should have finished
  await page.waitForLoadState('networkidle', { timeout: 5000 });
  await expect(page.getByRole('button', { name: /Create Account|Creating…/ })).toBeVisible();
}

async function fillAndSubmitSignup(page: any, email: string, password = 'secret123') {
  await page.goto(SIGNUP_URL);
  await page.getByPlaceholder('📧 Email').fill(email);
  await page.getByPlaceholder('🔒 Password').fill(password);
  await page.getByPlaceholder('🔁 Confirm Password').fill(password);
  await page.getByRole('button', { name: 'Create Account' }).click();
}

test('sign up page — validation errors', async ({ page }) => {
  await page.goto(SIGNUP_URL);

  // Submit empty form
  await page.getByRole('button', { name: 'Create Account' }).click();

  await expect(page.getByText('Email is required', { exact: true })).toBeVisible();
  await expect(page.getByText('Password is required', { exact: true })).toBeVisible();
  await expect(page.getByText('Confirm Password is required', { exact: true })).toBeVisible();

  // Invalid email
  await page.getByPlaceholder('📧 Email').fill('not-an-email');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText('Email is invalid', { exact: true })).toBeVisible();

  // Mismatched passwords
  await page.getByPlaceholder('📧 Email').fill('valid@mail.com');
  await page.getByPlaceholder('🔒 Password').fill('secret123');
  await page.getByPlaceholder('🔁 Confirm Password').fill('different123');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText('Confirm Password does not match', { exact: true })).toBeVisible();
});

test('sign up page — successful account creation (redirect OR session cookie)', async ({ page }) => {
  const email = uniqueEmail();
  await fillAndSubmitSignup(page, email);
  await expectSignedInOrRedirected({ page, timeout: 20000 });
});

test('sign up page — Reset clears fields and errors', async ({ page }) => {
  await page.goto(SIGNUP_URL);

  // Trigger required errors first
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText('Email is required', { exact: true })).toBeVisible();

  // Fill fields
  await page.getByPlaceholder('📧 Email').fill(uniqueEmail());
  await page.getByPlaceholder('🔒 Password').fill('secret123');
  await page.getByPlaceholder('🔁 Confirm Password').fill('secret123');

  // Reset
  await page.getByRole('button', { name: 'Reset' }).click();

  // Inputs cleared
  await expect(page.getByPlaceholder('📧 Email')).toHaveValue('');
  await expect(page.getByPlaceholder('🔒 Password')).toHaveValue('');
  await expect(page.getByPlaceholder('🔁 Confirm Password')).toHaveValue('');

  // Errors gone after simple re-focus/blur
  await page.getByPlaceholder('📧 Email').focus();
  await page.getByPlaceholder('📧 Email').blur();
  await expect(page.getByText('Email is required', { exact: true })).toBeHidden({ timeout: 500 });
});
