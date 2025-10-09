import { test, expect } from './auth-utils';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const URL = `${BASE_URL}/locations`;

test.slow();
test('test locations page', async ({ page }) => {
  await page.goto(URL);
  await expect(page.getByText('Location Management')).toBeVisible();

  // Check Locations section
  await expect(page.getByRole('heading', { name: 'Locations' })).toBeVisible();

    // Check Add button
    await expect(page.getByRole('button', { name: /add/i })).toBeVisible();

  // Check search bar
  await expect(page.getByPlaceholder('Search for a location or address...')).toBeVisible();

});
