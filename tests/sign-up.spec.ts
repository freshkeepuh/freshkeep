import { Page } from '@playwright/test';
import { test, expect, BASE_URL, expectSignedInOrRedirected, fillFormWithRetry } from './auth-utils';

const SIGNUP_URL = `${BASE_URL}/auth/signup`;

function uniqueEmail() {
  return `playwright+${Date.now()}@example.com`;
}

async function submitSignup(page: Page) {
  await page.getByTestId('sign-up-form-submit').click();
}

async function fillSignup(page: Page, email: string, password: string = 'secret123', confirmPassword: string = password) {
  await fillFormWithRetry(page, [
    { selector: '[data-testid="sign-up-form-email-field"]', value: email },
    { selector: '[data-testid="sign-up-form-password-field"]', value: password },
    { selector: '[data-testid="sign-up-form-confirm-password-field"]', value: confirmPassword },
  ]);
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

  await page.getByTestId('sign-up-form-reset').click();

  // Short password
  await fillAndSubmitSignup(page, 'valid@mail.com', 'short', 'short');
  await expect(page.getByTestId('sign-up-form-password-field-error')).toBeVisible();
  
  await page.getByTestId('sign-up-form-reset').click();

  // Mismatched passwords
  await fillAndSubmitSignup(page, 'valid@mail.com', 'secret123', 'different123');
  await expect(page.getByTestId('sign-up-form-confirm-password-field-error')).toBeVisible();
});

test('sign up page — successful account creation (redirect OR session cookie)', async ({ page }) => {
  await page.goto(SIGNUP_URL);

  const email = uniqueEmail();

  await fillAndSubmitSignup(page, email);
  await expectSignedInOrRedirected({ page, url: `${BASE_URL}/`, timeout: 30000 });
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
