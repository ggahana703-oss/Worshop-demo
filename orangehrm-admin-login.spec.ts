import { test, expect } from '@playwright/test';
import {
  expectOrangeHrmDashboard,
  submitOrangeHrmLogin,
} from './support/orangehrm-login';

test('logs in to OrangeHRM and opens the Admin page', async ({ page }) => {
  await submitOrangeHrmLogin(page);
  await expectOrangeHrmDashboard(page);

  await page.getByRole('link', { name: 'Admin', exact: true }).click();

  await expect(page).toHaveURL(/admin\/viewSystemUsers/);
  await expect(page.getByRole('heading', { name: 'Admin', exact: true })).toBeVisible();
});
