import { test, expect, BASE_URL, FORGOT_PASSWORD_URL, SIGNIN_URL } from './auth-utils';

test.slow();
test.use({ viewport: { width: 1280, height: 800 } });
test('Forgot Password page loads correctly', async ({ page }) => {
  await page.goto(FORGOT_PASSWORD_URL);
  expect(await page.getByTestId('forgot-password-welcome-title')).toBeVisible();
  expect(await page.getByTestId('forgot-password-welcome-subtitle')).toBeVisible();
});

test('Forgot Password form validation', async ({ page }) => {
  await page.goto(FORGOT_PASSWORD_URL);
  await page.click('[data-testid="forgot-password-submit"]');
  expect(await page.locator('#email + .invalid-feedback').textContent()).toBe('Email is required');
  await page.fill('#email', 'invalid-email');
  await page.click('[data-testid="forgot-password-submit"]');
  expect(await page.locator('#email + .invalid-feedback').textContent()).toBe('Enter a valid email address');
  await page.fill('#email', 'valid-email@example.com');
  await page.click('[data-testid="forgot-password-submit"]');
  expect(await page.locator('#email + .invalid-feedback').textContent()).toBe('');
  await page.click('[data-testid="forgot-password-reset"]');
  expect(await page.locator('#email').inputValue()).toBe('');
});

test('Forgot Password navigation link', async ({ page }) => {
  await page.goto(FORGOT_PASSWORD_URL);
  await page.click('[data-testid="forgot-password-signin-link"]');
  await expect(page).toHaveURL(SIGNIN_URL);
});