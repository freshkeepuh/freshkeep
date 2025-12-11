import { test, expect } from './auth-utils';

const BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const SETTINGS_URL = `${BASE_URL}/settings`;

const TEST_EMAIL = process.env.PLAYWRIGHT_TEST_USER_EMAIL || 'admin@foo.com';
const TEST_PASSWORD = process.env.PLAYWRIGHT_TEST_USER_PASSWORD || 'changeme';

test.describe('Settings', () => {
  test('renders and toggles theme (light ↔ dark)', async ({ getUserPage }) => {
    const page = await getUserPage(TEST_EMAIL, TEST_PASSWORD);

    await page.goto(SETTINGS_URL);
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByRole('heading', { name: 'User Settings' }),
    ).toBeVisible();

    // Default should be light (no .dark on body)
    await expect
      .poll(async () =>
        page.evaluate(() => document.body.classList.contains('dark')),
      )
      .toBe(false);

    // Switch to dark
    await page.locator('label[for="theme-dark"]').click();

    await expect
      .poll(async () =>
        page.evaluate(() => document.body.classList.contains('dark')),
      )
      .toBe(true);

    await expect(page.locator('#theme-dark')).toBeChecked();
    await expect(page.locator('#theme-light')).not.toBeChecked();

    // Switch back to light
    await page.locator('label[for="theme-light"]').click();

    await expect
      .poll(async () =>
        page.evaluate(() => document.body.classList.contains('dark')),
      )
      .toBe(false);

    await expect(page.locator('#theme-light')).toBeChecked();
    await expect(page.locator('#theme-dark')).not.toBeChecked();
  });

  test('updates profile form (no navigation, controlled input stays)', async ({
    getUserPage,
  }) => {
    const page = await getUserPage(TEST_EMAIL, TEST_PASSWORD);

    await page.goto(SETTINGS_URL);
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByRole('heading', { name: 'User Settings' }),
    ).toBeVisible();

    const nameInput = page.locator('#firstName');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Josh Tester');

    await page.getByRole('button', { name: 'Update Profile' }).click();

    // Form is client-side only right now; ensure we didn't navigate and value persisted
    await expect(page).toHaveURL(SETTINGS_URL);
    await expect(nameInput).toHaveValue('Josh Tester');
  });

  test('basic UI is present', async ({ getUserPage }) => {
    const page = await getUserPage(TEST_EMAIL, TEST_PASSWORD);

    await page.goto(SETTINGS_URL);
    await page.waitForLoadState('networkidle');

    // Section headings
    await expect(
      page.getByRole('heading', { name: 'User Information' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Appearance' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Account Actions' }),
    ).toBeVisible();

    // Buttons / inputs visible
    await expect(
      page.getByRole('button', { name: 'Update Profile' }),
    ).toBeVisible();
    await expect(page.locator('#theme-light')).toBeVisible();
    await expect(page.locator('#theme-dark')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
  });
});
