import { test, expect } from '@playwright/test';
import {
  expectOrangeHrmDashboard,
  submitOrangeHrmLogin,
} from './support/orangehrm-login';

test('logs in to OrangeHRM and opens PIM employee information', async ({ page }) => {
  await submitOrangeHrmLogin(page);
  await expectOrangeHrmDashboard(page);

  await page.getByRole('link', { name: 'PIM', exact: true }).click();

  await expect(page).toHaveURL(/pim\/viewEmployeeList/);
  await expect(page.getByRole('heading', { name: 'PIM', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Employee Information' })).toBeVisible();
});
