import { Page } from '@playwright/test';
import { test, expect, BASE_URL, expectSignedInOrRedirected, fillFormWithRetry, checkFormEmpty } from './auth-utils';

const SIGNIN_URL = `${BASE_URL}/auth/signin`;

async function submitSignin(page: Page) {
  await page.getByTestId('sign-in-form-submit').click();
}

async function fillSignin(page: Page, email: string, password: string = 'changeme') {
  await fillFormWithRetry(page, [
    { selector: '[id="email"]', value: email },
    { selector: '[id="password"]', value: password },
  ]);
}

async function isEmptySignin(page: Page) {
  await checkFormEmpty(page, [
    { selector: '[id="email"]' },
    { selector: '[id="password"]' },
  ]);
}

async function fillAndSubmitSignup(page: Page, email: string, password: string = 'secret123', confirmPassword: string = password) {
  await fillSignin(page, email, password);
  await submitSignin(page);
}

test('sign in page - successful login', async ({ page }) => {
  await page.goto(SIGNIN_URL);
  
  const email = 'john@foo.com';

  await fillAndSubmitSignup(page, email);
  await expectSignedInOrRedirected({ page, url: `${BASE_URL}/`, timeout: 10000 });
});

test('sign in page — Reset clears fields and errors', async ({ page }) => {
  await page.goto(SIGNIN_URL);

  // Fill fields
  await fillSignin(page, 'john@foo.com');

  // Reset the form
  await page.getByTestId('sign-in-form-reset').click();

  // Inputs cleared
  await isEmptySignin(page);
});

test('test sign in page with sign up option', async ({ page }) => {
  await page.goto(SIGNIN_URL);

  // Click on the "Sign Up" link
  await page.getByTestId('sign-in-form-signup-link').click();
  await page.waitForLoadState();
  await expect(page).toHaveURL(`${BASE_URL}/auth/signup`);
});
