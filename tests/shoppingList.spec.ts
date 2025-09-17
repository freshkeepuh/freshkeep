import { test } from '@playwright/test';

test('ShoppingList components present, navbar shows up, product cards show up with product images, with fields and tags', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/shoppingList');
  await page.getByText('FreshKeepLogin').click();
  await page.getByRole('searchbox', { name: 'Search products...' }).click();
  await page
    .locator('div')
    .filter({ hasText: /^BananasStore:FoodlandStorage:CounterType:FruitRemove$/ })
    .nth(2)
    .click();
  await page.locator('.card-img-top').first().click();
  await page
    .locator('div')
    .filter({ hasText: /^Store:FoodlandStorage:CounterType:Fruit$/ })
    .getByRole('paragraph')
    .first()
    .click();
  await page
    .locator('div')
    .filter({ hasText: /^Storage:Counter$/ })
    .getByRole('paragraph')
    .click();
  await page
    .locator('div')
    .filter({ hasText: /^Type:Fruit$/ })
    .getByRole('paragraph')
    .click();
  await page.getByText('Foodland').first().click();
  await page.getByText('Counter').click();
  await page.getByText('Fruit').click();
  await page.locator('.btn.btn-danger').first().click();
  await page.locator('div:nth-child(2) > .rounded-5.bg-success > .rounded-5 > .card-img-top').click();
  await page.getByText('Greek Yogurt').click();
  await page
    .locator('div')
    .filter({ hasText: /^Store:WalmartStorage:RefrigeratorType:Dairy$/ })
    .getByRole('paragraph')
    .first()
    .click();
  await page
    .locator('div')
    .filter({ hasText: /^Store:WalmartStorage:RefrigeratorType:Dairy$/ })
    .getByRole('paragraph')
    .first()
    .click();
  await page
    .locator('div')
    .filter({ hasText: /^Store:WalmartStorage:RefrigeratorType:Dairy$/ })
    .getByRole('paragraph')
    .nth(1)
    .click();
  await page
    .locator('div')
    .filter({ hasText: /^Type:Dairy$/ })
    .getByRole('paragraph')
    .click();
  await page.getByText('Walmart').first().click();
  await page.getByText('Refrigerator').first().click();
  await page.getByText('Dairy').click();
  await page.locator('div:nth-child(2) > .rounded-5.bg-success > .rounded-5 > .card-body > .px-3 > .btn').click();
  await page.getByRole('button', { name: 'Add To List' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
});
