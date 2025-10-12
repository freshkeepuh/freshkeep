import { Page } from '@playwright/test';
import { test, expect, BASE_URL, expectSignedInOrRedirected, fillFormWithRetry, checkFormEmpty } from './auth-utils';

const SIGNUP_URL = `${BASE_URL}/auth/signup`;

function uniqueEmail() {
  return `playwright+${Date.now()}@example.com`;
}

async function submitSignup(page: Page) {
  await page.getByTestId('sign-up-form-submit').click();
}

async function fillSignup(page: Page, email: string, password: string = 'secret123', confirmPassword: string = password) {
  await fillFormWithRetry(page, [
    { selector: '[id="email"]', value: email },
    { selector: '[id="password"]', value: password },
    { selector: '[id="confirmPassword"]', value: confirmPassword },
  ]);
}

async function isEmptySignup(page: Page) {
  await checkFormEmpty(page, [
    { selector: '[id="email"]' },
    { selector: '[id="password"]' },
    { selector: '[id="confirmPassword"]' },
  ]);
}

async function fillAndSubmitSignup(page: Page, email: string, password: string = 'secret123', confirmPassword: string = password) {
  await fillSignup(page, email, password, confirmPassword);
  await submitSignup(page);
}

test('sign up page — successful login', async ({ page }) => {
  await page.goto(SIGNUP_URL);

  const email = uniqueEmail();

  await fillAndSubmitSignup(page, email);
  await expectSignedInOrRedirected({ page, url: `${BASE_URL}/`, timeout: 10000 });
});

test('sign up page — Reset clears fields and errors', async ({ page }) => {
  await page.goto(SIGNUP_URL);

  // Fill fields
  await fillSignup(page, uniqueEmail());

  // Reset the form
  await page.getByTestId('sign-up-form-reset').click();

  // Inputs cleared
  await isEmptySignup(page);
});

test('test sign up page with sign in option', async ({ page }) => {
  await page.goto(SIGNUP_URL);

  // Click on the "Sign In" link
  await page.getByTestId('sign-up-form-signin-link').click();
  await page.waitForLoadState();
  await expect(page).toHaveURL(`${BASE_URL}/auth/signin`);
});
