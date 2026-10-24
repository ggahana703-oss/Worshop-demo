import { test, expect } from '@playwright/test';
import {
  expectOrangeHrmDashboard,
  submitOrangeHrmLogin,
} from './support/orangehrm-login';

test('logs out of OrangeHRM and returns to the login page', async ({ page }) => {
  await submitOrangeHrmLogin(page);
  await expectOrangeHrmDashboard(page);

  await page.getByRole('img', { name: 'profile picture' }).first().click();
  await expect(page.getByRole('menuitem', { name: 'Logout' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'About' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Support' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Change Password' })).toBeVisible();

  await page.getByRole('menuitem', { name: 'Logout' }).click();

  await expect(page).toHaveURL(/auth\/login/);
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
});
