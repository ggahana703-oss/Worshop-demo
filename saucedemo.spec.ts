import { expect, test } from '@playwright/test';

const baseUrl = 'https://www.saucedemo.com/';
const username = 'standard_user';
const password = 'secret_sauce';
const backpackName = 'Sauce Labs Backpack';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl);
});

async function logIn(page: import('@playwright/test').Page) {
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test('logs in successfully', async ({ page }) => {
  await logIn(page);

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});

test('shows an error for invalid login credentials', async ({ page }) => {
  await page.getByRole('textbox', { name: 'Username' }).fill('not_a_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('wrong_password');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(baseUrl);
  await expect(page.getByRole('alert')).toHaveText(
    'Epic sadface: Username and password do not match any user in this service'
  );
});

test('shows all observed products after login', async ({ page }) => {
  await logIn(page);

  await expect(page.getByText('Products', { exact: true })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Sort products' })).toBeVisible();

  const productNames = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
  ];

  for (const name of productNames) {
    await expect(page.getByText(name, { exact: true })).toBeVisible();
  }
});

test('adds the Backpack and shows a cart count of one', async ({ page }) => {
  await logIn(page);

  await page.locator('#add-to-cart-sauce-labs-backpack').click();

  await expect(page.getByRole('button', { name: 'Remove', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cart, 1 items' })).toBeVisible();
});

test('removes the Backpack from the cart', async ({ page }) => {
  await logIn(page);
  await page.locator('#add-to-cart-sauce-labs-backpack').click();
  await page.getByRole('button', { name: 'Cart, 1 items' }).click();

  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(page.getByText('Your Cart', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('button', { name: `View details for ${backpackName}` })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Remove', exact: true }).click();

  await expect(
    page.getByRole('button', { name: `View details for ${backpackName}` })
  ).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();
});
