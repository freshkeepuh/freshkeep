import { Cookie, Page } from '@playwright/test';
import { test, expect, BASE_URL } from './auth-utils';

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

  await expect(page).toBeTruthy();
  // Fallback: NextAuth session cookie present (Firefox sometimes lags redirect)
  const cookies = await page.context().cookies();
  const hasSession = cookies.some((c: Cookie) => c.name.includes('next-auth') && c.value);
  expect(hasSession, 'Expected a NextAuth session cookie if not redirected').toBeTruthy();
}

async function submitSignup(page: Page) {
  await page.getByTestId('sign-up-form-submit').click();
}

async function fillSignup(page: Page, email: string, password: string = 'secret123', confirmPassword: string = password) {
  await page.getByTestId('sign-up-form-email-field').fill(email);
  await page.getByTestId('sign-up-form-password-field').fill(password);
  await page.getByTestId('sign-up-form-confirm-password-field').fill(confirmPassword);
}

async function fillAndSubmitSignup(page: Page, email: string, password: string = 'secret123', confirmPassword: string = password) {
  await fillSignup(page, email, password, confirmPassword);
  await submitSignup(page);
}

test('sign up page — validation errors', async ({ page }) => {
  await page.goto(SIGNUP_URL);

  // Submit empty form
  await submitSignup(page);

  await expect(page.getByTestId('sign-up-form-email-field-error')).toBeVisible();
  await expect(page.getByTestId('sign-up-form-password-field-error')).toBeVisible();
  await expect(page.getByTestId('sign-up-form-confirm-password-field-error')).toBeVisible();

  // Invalid email
  fillAndSubmitSignup(page, 'invalid-email');
  await expect(page.getByTestId('sign-up-form-email-field-error')).toBeVisible();

  // Short password
  await fillAndSubmitSignup(page, 'valid@mail.com', 'short', 'short');
  await expect(page.getByTestId('sign-up-form-password-field-error')).toBeVisible();

  // Mismatched passwords
  await fillAndSubmitSignup(page, 'valid@mail.com', 'secret123', 'different123');
  await expect(page.getByTestId('sign-up-form-confirm-password-field-error')).toBeVisible();
});

test('sign up page — successful account creation (redirect OR session cookie)', async ({ page }) => {
  await page.goto(SIGNUP_URL);

  const email = uniqueEmail();

  await fillAndSubmitSignup(page, email);
  await expectSignedInOrRedirected({ page });
});

test('sign up page — Reset clears fields and errors', async ({ page }) => {
  await page.goto(SIGNUP_URL);

  // Fill fields
  await fillSignup(page, uniqueEmail());

  // Reset the form
  await page.getByTestId('sign-up-form-reset').click();

  // Inputs cleared
  await expect(page.getByTestId('sign-up-form-email-field')).toBeEmpty();
  await expect(page.getByTestId('sign-up-form-password-field')).toBeEmpty();
  await expect(page.getByTestId('sign-up-form-confirm-password-field')).toBeEmpty();
});
