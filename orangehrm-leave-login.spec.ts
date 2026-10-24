import { test, expect } from '@playwright/test';
import {
  expectOrangeHrmDashboard,
  submitOrangeHrmLogin,
} from './support/orangehrm-login';

test('logs in to OrangeHRM and opens the Leave List', async ({ page }) => {
  await submitOrangeHrmLogin(page);
  await expectOrangeHrmDashboard(page);

  await page.getByRole('link', { name: 'Leave', exact: true }).click();

  await expect(page).toHaveURL(/leave\/viewLeaveList/);
  await expect(page.getByRole('heading', { name: 'Leave', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Leave List' })).toBeVisible();
});
