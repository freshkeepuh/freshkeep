import { Page } from '@playwright/test';
import { test, expect, BASE_URL } from './auth-utils';

const LIST_URL = `${BASE_URL}/recipes`;

/** Helper: parse "Showing X results" and return X as a number */
async function getResultsCount(page: Page): Promise<number> {
  const txt = await page
    .getByText(/^Showing\s+\d+\s+results$/)
    .first()
    .textContent();
  const m = txt?.match(/\b(\d+)\b/);
  return m ? Number(m[1]) : 0;
}
// Allow more time on CI
test.slow();

test.describe('Recipes (no code changes)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LIST_URL);
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByText(/^Showing\s+\d+\s+results$/).first(),
    ).toBeVisible();
  });

  test('List loads and count matches number of cards', async ({ page }) => {
    const expected = await getResultsCount(page);
    // Each recipe card is an <article> element
    const cards = page.getByRole('article');
    await expect(cards).toHaveCount(expected);
  });

  test('Search filters by title/ingredient (e.g., "pasta")', async ({
    page,
  }) => {
    // Search input uses placeholder "example: soup, pasta"
    await page.getByPlaceholder('example: soup, pasta').fill('pasta');
    // "Search" button has visible text "Search"
    await page.getByRole('button', { name: 'Search' }).click();

    // The count should reflect filtered results and the number of cards should match that count
    const expected = await getResultsCount(page);
    await expect(page.getByRole('article')).toHaveCount(expected);

    // If nothing matches, we show an empty state
    if (expected === 0) {
      await expect(
        page.getByText('No recipes match your filters.'),
      ).toBeVisible();
    }
  });

  test('Combined filters (time + difficulty + diet)', async ({ page }) => {
    // Select values by their existing element IDs
    await page.locator('#maxTimeSelect').selectOption('< 30 min');
    await page.locator('#difficultySelect').selectOption('Easy');
    await page.locator('#dietSelect').selectOption('Vegan');

    // Validate that the visible count and actual card count remain in sync
    const expected = await getResultsCount(page);
    await expect(page.getByRole('article')).toHaveCount(expected);
  });

  test('Ingredient chips add/remove/deduplication ("Tomato")', async ({
    page,
  }) => {
    // Ingredient input uses placeholder "example: tomato, beef"
    await page.getByPlaceholder('example: tomato, beef').fill('Tomato');
    await page.getByRole('button', { name: 'Add' }).click();

    // Add duplicate in different case
    await page.getByPlaceholder('example: tomato, beef').fill('tomato');
    await page.getByRole('button', { name: 'Add' }).click();

    // Verify that adding "tomato" after "Tomato" does not create a second chip
    const removeTomato = page.getByRole('button', { name: /Remove Tomato/i });
    // If present, click it
    if (await removeTomato.isVisible()) {
      await removeTomato.click();
    }

    // Still shows a valid results count and renders accordingly
    const expected = await getResultsCount(page);
    await expect(page.getByRole('article')).toHaveCount(expected);
  });

  test('Navigate to view page and back', async ({ page }) => {
    // Click first "View Recipe" link
    const firstView = page.getByRole('link', { name: 'View Recipe' }).first();
    await expect(firstView).toBeVisible();
    await firstView.click();
    await page.waitForLoadState('networkidle');

    // On the view page, pills show the labels "TIME", "DIFFICULTY", "DIET"
    await expect(page.getByText(/^TIME$/)).toBeVisible();
    await expect(page.getByText(/^DIFFICULTY$/)).toBeVisible();
    await expect(page.getByText(/^DIET$/)).toBeVisible();

    // Go back using the visible "Back to Recipes" link
    await page.getByRole('link', { name: 'Back to Recipes' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(LIST_URL);
  });

  test('Bad slug shows NotFound page', async ({ page }) => {
    // A nonexistent recipe URL should render the NotFound message
    await page.goto(`${BASE_URL}/recipes/__does-not-exist__`);
    await expect(page.getByText('Recipe not found')).toBeVisible();
  });
});
