import { test, expect } from './auth-utils';

test.slow();
test('test access to user page', async ({ getUserPage }) => {
  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const customUserPage = await getUserPage('john@foo.com', 'changeme');
});
