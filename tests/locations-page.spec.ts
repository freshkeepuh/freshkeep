import { test, expect, BASE_URL } from './auth-utils';

const URL = `${BASE_URL}/locations`;

test.slow();
test('test locations page', async ({ page }) => {
  await page.goto(URL);
  await expect(page.getByText('Your Locations')).toBeVisible();

  // Check search bar
  await expect(
    page.getByPlaceholder('Search for a location or address...'),
  ).toBeVisible();
});
