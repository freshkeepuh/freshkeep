import { test, expect } from './auth-utils';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SETTINGS_URL = `${BASE_URL}/settings`;

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SETTINGS_URL);
    await page.waitForLoadState('networkidle');
    // Sanity check
    await expect(page.getByRole('heading', { name: 'User Settings' })).toBeVisible();
  });

  test('renders and toggles theme (light ↔ dark)', async ({ page }) => {
    // Default should be light (no .dark on body)
    await expect
      .poll(async () => await page.evaluate(() => document.body.classList.contains('dark')))
      .toBe(false);

    // Switch to dark
    await page.locator('#theme-dark').click();
    await expect
      .poll(async () => await page.evaluate(() => document.body.classList.contains('dark')))
      .toBe(true);
    await expect(page.locator('#theme-dark')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#theme-light')).toHaveAttribute('aria-pressed', 'false');

    // Switch back to light
    await page.locator('#theme-light').click();
    await expect
      .poll(async () => await page.evaluate(() => document.body.classList.contains('dark')))
      .toBe(false);
    await expect(page.locator('#theme-light')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#theme-dark')).toHaveAttribute('aria-pressed', 'false');
  });

  test('updates profile form (no navigation, controlled input stays)', async ({ page }) => {
    const nameInput = page.locator('#firstName');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Josh Tester');

    // Submit
    await page.getByRole('button', { name: 'Update Profile' }).click();

    // Form is client-side only right now; ensure we didn't navigate and value persisted
    await expect(page).toHaveURL(SETTINGS_URL);
    await expect(nameInput).toHaveValue('Josh Tester');
  });

  test('basic UI is present', async ({ page }) => {
    // Section headings
    await expect(page.getByRole('heading', { name: 'User Information' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Appearance' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Account Actions' })).toBeVisible();

    // Buttons visible
    await expect(page.getByRole('button', { name: 'Update Profile' })).toBeVisible();
    await expect(page.locator('#theme-light')).toBeVisible();
    await expect(page.locator('#theme-dark')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
  });
});
