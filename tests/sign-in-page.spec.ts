import { test, expect, HOME_URL, SIGNUP_URL, SIGNIN_URL } from './auth-utils';

test.slow();
test.use({ viewport: { width: 1280, height: 800 } });
test('test sign in page goto sign up', async ({ page }) => {
  await page.goto(SIGNIN_URL);
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(SIGNIN_URL);

  // Click on the "Sign Up" link
  const signUpLink = page.getByTestId('sign-in-form-sign-up-link');
  await expect(signUpLink).toBeVisible();
  await signUpLink.click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(SIGNUP_URL);
});
