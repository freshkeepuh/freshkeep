import { test, expect, BASE_URL } from './auth-utils';

const URL = `${BASE_URL}/locations`;

test.slow();
test('test locations page', async ({ page }) => {
    await page.goto(URL);
    await expect(page.getByText('Location Management')).toBeVisible();

    // Check Locations section
    await expect(page.getByRole('heading', { name: 'Locations' })).toBeVisible();

    // Check each location in the list
    const loc = page.locator('li');
    const locCount = await loc.count();
    for (let i = 0; i < locCount; i++) {
        await expect(loc.nth(i)).toBeVisible();
        // Optionally, check for edit and delete buttons on each location
        await expect(loc.nth(i).getByRole('button', { name: /edit/i })).toBeVisible();
        await expect(loc.nth(i).getByRole('button', { name: /delete/i })).toBeVisible();
    }

    // Check Add button
    await expect(page.getByRole('button', { name: /add/i })).toBeVisible();

    // Check search bar
    await expect(page.getByPlaceholder('Search for a location or address...')).toBeVisible();

    // Check map placeholder image
    await expect(page.getByAltText(/not found/i)).toBeVisible();
});
