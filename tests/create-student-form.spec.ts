import { test, expect } from '@playwright/test';

test('Create Student Form', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('heading', { name: 'Create Student' })).toBeVisible();
  await page.getByPlaceholder('Your name').click();
  await page.getByPlaceholder('Your name').fill('Cam Moore');
  await page.getByPlaceholder('Your name').press('Tab');
  await page.getByPlaceholder('Your email').fill('cmoore@foo.com');
  await page.getByPlaceholder('Your email').press('Tab');
  await page.getByPlaceholder('A bit about you').fill('A bit about me.');
  await page.getByPlaceholder('A bit about you').press('Tab');
  await page.getByLabel('Level*').press('ArrowDown');
  await page.getByLabel('Level*').press('ArrowDown');
  await page.getByLabel('Level*').press('ArrowDown');
  await page.getByLabel('Level*').press('Tab');
  await page.getByLabel('GPA*').press('ArrowDown');
  await page.getByLabel('GPA*').press('ArrowDown');
  await page.getByLabel('GPA*').press('ArrowDown');
  await page.getByLabel('GPA*').press('Tab');
  await page.getByLabel('Date Enrolled*').fill('2020-03-25');
  await page.getByLabel('ComputerScience').check();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('link', { name: 'Edit this data.' })).toBeVisible();
});
