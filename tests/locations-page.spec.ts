import { test, expect } from './auth-utils';

const URL = `http://localhost:3000/locations`;

test.slow();
test('test locations page', async ({ page }) => {
    await page.goto(URL);
    await expect(page.getByText('Location Management')).toBeVisible();

    // Check Locations section
    await expect(page.getByRole('heading', { name: 'Locations' })).toBeVisible();
    await expect(page.getByText('Sample Location 1')).toBeVisible();
    await expect(page.getByText('Sample Location 2')).toBeVisible();
    await expect(page.getByText('Sample Location 3')).toBeVisible();
    // Check management buttons
    await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();

    // Check search bar
    await expect(page.getByPlaceholder('Search for a location or address...')).toBeVisible();
    // Check map placeholder image
    await expect(page.getByAltText(/not found/i)).toBeVisible();
});
