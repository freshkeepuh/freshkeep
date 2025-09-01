import { test, expect } from '@playwright/test';

test('Edit Student Form', async ({ page }) => {
  // This test requires the student cmoore@foo.com to exist in the database.
  // Create Student Form test can be used to create this student.
  await page.goto('http://localhost:3000/student/cmoore@foo.com');
  await expect(page.getByRole('heading', { name: 'Edit Student' })).toBeVisible();
  await expect(page.getByText('Major*')).toBeVisible();
  await page.getByLabel('Date Enrolled*').fill('2020-03-24');
  await page.getByLabel('Math').check();
  await expect(page.getByLabel('Email*')).toHaveValue('cmoore@foo.com');
  await expect(page.getByLabel('Date Enrolled*')).toHaveValue('2020-03-24');
  await page.getByRole('button', { name: 'Update' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByLabel('ComputerScience')).not.toBeChecked();
  await expect(page.getByLabel('Math')).toBeChecked();
});
