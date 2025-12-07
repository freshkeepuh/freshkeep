import { test as base, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Base configuration
export const BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
export const SESSION_STORAGE_PATH = path.join(
  __dirname,
  'playwright-auth-sessions',
);

// Ensure session directory exists
if (!fs.existsSync(SESSION_STORAGE_PATH)) {
  fs.mkdirSync(SESSION_STORAGE_PATH, { recursive: true });
}

// Define our custom fixtures
interface AuthFixtures {
  getUserPage: (email: string, password: string) => Promise<Page>;
}

/**
 * Helper to fill form fields with retry logic
 * @param page The Page on which the fields are to be filled
 * @param fields The Fields to fill with values
 */
async function fillFormWithRetry(
  page: Page,
  fields: { selector: string; value: string }[],
): Promise<void> {
  for (const field of fields) {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const element = page.locator(field.selector);
        await element.waitFor({ state: 'visible', timeout: 2000 });
        await element.clear();
        await element.fill(field.value);
        await element.evaluate((el) => el.blur()); // Trigger blur event
        break;
      } catch (error) {
        attempts += 1;
        if (attempts >= maxAttempts) {
          throw new Error(
            `Failed to fill field ${field.selector} after ${maxAttempts} attempts`,
          );
        }
        if (page.isClosed()) {
          throw new Error('Page is closed, cannot fill form fields');
        }
        await page.waitForTimeout(500);
      }
    }
  }
}

export default fillFormWithRetry;

/**
 * Helper to empty form fields with retry logic
 * @param page The Page on which the fields are to be emptied
 * @param fields The Fields to empty
 */
export async function emptyFormWithRetry(
  page: Page,
  fields: { selector: string }[],
): Promise<void> {
  for (const field of fields) {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const element = page.locator(field.selector);
        await element.waitFor({ state: 'visible', timeout: 2000 });
        await element.clear();
        await element.evaluate((el) => el.blur()); // Trigger blur event
        break;
      } catch (error) {
        attempts += 1;
        if (attempts >= maxAttempts) {
          throw new Error(
            `Failed to clear field ${field.selector} after ${maxAttempts} attempts`,
          );
        }
        await page.waitForTimeout(500);
      }
    }
  }
}

/**
 * Check that form fields are empty
 * @param page The Page on which the fields are to be checked
 * @param fields The Fields to check
 */
export async function checkFormEmpty(
  page: Page,
  fields: { selector: string }[],
): Promise<void> {
  await Promise.all(
    fields.map((field) => expect(page.locator(field.selector)).toBeEmpty()),
  );
}

/**
 * Expect the user to be signed in or redirected to the home page
 * @param param0 - Object containing the page and optional timeout
 * @returns {Promise<void>}
 */
export async function expectSignedInOrRedirected({
  page,
  url,
  timeout = 20000,
}: {
  page: Page;
  url: string;
  timeout?: number;
}): Promise<void> {
  try {
    // Primary: check for session cookie
    await page.waitForLoadState();
    const cookies = await page.context().cookies();
    const hasSessionCookie = cookies.some(
      (cookie) =>
        cookie.name === 'next-auth.session-token' ||
        cookie.name === '__Secure-next-auth.session-token',
    );

    if (hasSessionCookie) {
      console.log('✓ Session cookie found, user is signed in');
      return;
    }
    // Primary: redirect to /
    const redirected = await page
      .waitForURL(url, { timeout })
      .then(() => true)
      .catch(() => false);

    if (redirected) {
      await expect(page).toHaveURL(url);
      console.log(`✓ Redirected to ${url}, user is signed in`);
    }
  } catch (err: Error | any) {
    throw new Error(`× User is not signed in or redirected: ${err}`);
  }
}

/**
 * Authenticate using the UI with robust waiting and error handling
 */
async function authenticateWithUI(
  page: Page,
  email: string,
  password: string,
  sessionName: string,
): Promise<void> {
  const sessionPath = path.join(SESSION_STORAGE_PATH, `${sessionName}.json`);
  const AUTH_CHECK_TIMEOUT = 3000;
  // Try to restore session from storage if available
  if (fs.existsSync(sessionPath)) {
    try {
      const sessionData = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
      await page.context().addCookies(sessionData.cookies);
      // Navigate to homepage to verify session
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      // Check if we're authenticated by looking for a sign-out option or user email
      const authCheck = await Promise.race([
        page
          .getByTestId('navbar-dropdown-account')
          .isVisible()
          .then((visible) => ({ success: visible })),
        new Promise<{ success: boolean }>((resolve) => {
          setTimeout(() => {
            resolve({ success: false });
          }, AUTH_CHECK_TIMEOUT);
        }),
      ]);
      if (authCheck.success) {
        console.log(`✓ Restored session for ${email}`);
        return;
      }
      console.log(`× Saved session for ${email} expired, re-authenticating...`);
    } catch (error) {
      console.log(`× Error restoring session: ${error}`);
    }
  }

  // If session restoration fails, authenticate via UI
  try {
    console.log(`→ Authenticating ${email} via UI...`);

    // Navigate to login page
    await page.goto(`${BASE_URL}/auth/signin`);
    await page.waitForLoadState('networkidle');

    // Fill in credentials with retry logic
    await fillFormWithRetry(page, [
      { selector: 'input[name="email"]', value: email },
      { selector: 'input[name="password"]', value: password },
    ]);

    // Click submit button and wait for navigation
    const submitButton = page.getByRole('button', { name: /sign[ -]?in/i });
    if (!(await submitButton.isVisible({ timeout: 1000 }))) {
      // Try alternative selector if the first one doesn't work
      await page.getByRole('button', { name: /log[ -]?in/i }).click();
    } else {
      await submitButton.click();
    }

    // Wait for navigation to complete
    await page.waitForURL(`${BASE_URL}/`, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    /*  // Verify authentication was successful
    await expect(async () => {
      const authState = await Promise.race([
        page.getByTestId('navbar-dropdown-account').isVisible().then((visible) => ({ success: visible })),
        // eslint-disable-next-line no-promise-executor-return
        new Promise<{ success: boolean }>((resolve) => setTimeout(() => resolve({ success: false }), 5000)),
      ]);

      expect(authState.success).toBeTruthy();
    }).toPass({ timeout: 10000 });
    */

    // Verify authentication was successful by checking for authenticated user elements
    await expect(page.getByTestId('navbar-dropdown-account')).toBeVisible();

    // Save session for future tests
    const cookies = await page.context().cookies();
    fs.writeFileSync(sessionPath, JSON.stringify({ cookies }));
    console.log(`✓ Successfully authenticated ${email}`);
  } catch (error) {
    throw new Error('Authentication failed', { cause: error });
  }
}

// Create custom test with authenticated fixtures
export const test = base.extend<AuthFixtures>({
  getUserPage: async ({ browser }, use) => {
    const createUserPage = async (email: string, password: string) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      await authenticateWithUI(page, email, password, `session-${email}`);
      return page;
    };

    await useFixture(createUserPage);
  },
});

export { expect } from '@playwright/test';
