import { test, expect } from '@playwright/test';
import {
  demoAdminCredentials,
  expectOrangeHrmDashboard,
  submitOrangeHrmLogin,
} from './support/orangehrm-login';

type LoginScenario = {
  title: string;
  username: string;
  password: string;
  expected: 'success' | 'failure';
};

const loginScenarios: LoginScenario[] = [
  {
    title: 'accepts valid demo credentials',
    ...demoAdminCredentials,
    expected: 'success',
  },
  {
    title: 'rejects an invalid username',
    username: 'invalid-user-demo',
    password: demoAdminCredentials.password,
    expected: 'failure',
  },
  {
    title: 'rejects an invalid password',
    username: demoAdminCredentials.username,
    password: 'invalid-password-demo',
    expected: 'failure',
  },
];

test.describe('OrangeHRM data-driven login', () => {
  for (const scenario of loginScenarios) {
    test(scenario.title, async ({ page }) => {
      await submitOrangeHrmLogin(page, scenario);

      if (scenario.expected === 'success') {
        await expectOrangeHrmDashboard(page);
      } else {
        await expect(page).toHaveURL(/auth\/login/);
        await expect(page.getByRole('alert')).toHaveText('Invalid credentials');
      }
    });
  }
});
