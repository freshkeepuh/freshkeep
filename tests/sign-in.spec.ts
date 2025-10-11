import { Page } from '@playwright/test';
import { test, expect, BASE_URL, expectSignedInOrRedirected, fillFormWithRetry } from './auth-utils';

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

async function fillAndSubmitSignup(page: Page, email: string, password: string = 'secret123', confirmPassword: string = password) {
  await fillSignin(page, email, password);
  await submitSignin(page);
}

test('sign in page - successful login', async ({ page }) => {
  await page.goto(SIGNIN_URL);

   await fillAndSubmitSignup(page, 'john@foo.com');
   await expectSignedInOrRedirected({ page, url: `${BASE_URL}/`, timeout: 20000 });
});

test('sign in page — Reset clears fields and errors', async ({ page }) => {
  await page.goto(SIGNIN_URL);

  // Fill fields
  await fillSignin(page, 'john@foo.com');

  // Reset the form
  await page.getByTestId('sign-in-form-reset').click();

  // Inputs cleared
  await expect(page.locator('[id="email"]')).toBeEmpty();
  await expect(page.locator('[id="password"]')).toBeEmpty();
});

test('test sign in page with sign up option', async ({ page }) => {
  await page.goto(SIGNIN_URL);

  // Click on the "Sign Up" link
  await page.getByRole('link', { name: 'Sign Up' }).last().click();
  await expect(page).toHaveURL(`${BASE_URL}/auth/signup`);
});
