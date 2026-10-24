import { test, expect } from '@playwright/test';
import {
  expectOrangeHrmDashboard,
  submitOrangeHrmLogin,
} from './support/orangehrm-login';

test('searches PIM employees by the observed employee ID', async ({ page }) => {
  await submitOrangeHrmLogin(page);
  await expectOrangeHrmDashboard(page);

  await page.getByRole('link', { name: 'PIM', exact: true }).click();
  await expect(page).toHaveURL(/pim\/viewEmployeeList/);
  await expect(page.getByRole('heading', { name: 'Employee Information' })).toBeVisible();

  const currentRecordCount = page.getByText(/\(\d+\)\s+Records?\s+Found/);
  await expect(currentRecordCount).toBeVisible();

  const employeeTable = page.getByRole('table').last();
  const employeeRows = employeeTable.getByRole('rowgroup').last().getByRole('row');
  await expect(employeeRows.first()).toBeVisible();

  const columnHeaders = await employeeTable.getByRole('columnheader').allInnerTexts();
  const employeeIdColumn = columnHeaders.findIndex((text) => text.trim().startsWith('Id'));
  const firstNameColumn = columnHeaders.findIndex((text) =>
    text.trim().startsWith('First (& Middle) Name'),
  );
  const lastNameColumn = columnHeaders.findIndex((text) => text.trim().startsWith('Last Name'));
  expect(employeeIdColumn).toBeGreaterThanOrEqual(0);
  expect(firstNameColumn).toBeGreaterThanOrEqual(0);
  expect(lastNameColumn).toBeGreaterThanOrEqual(0);

  let employeeId = '';
  let employeeFirstName = '';
  let employeeLastName = '';
  for (let index = 0; index < (await employeeRows.count()); index += 1) {
    const cells = await employeeRows.nth(index).getByRole('cell').allInnerTexts();
    const id = cells[employeeIdColumn]?.trim();
    const firstName = cells[firstNameColumn]?.trim();
    const lastName = cells[lastNameColumn]?.trim();

    if (id && firstName && lastName) {
      employeeId = id;
      employeeFirstName = firstName;
      employeeLastName = lastName;
      break;
    }
  }
  expect(employeeId).not.toBe('');
  expect(employeeFirstName).not.toBe('');
  expect(employeeLastName).not.toBe('');

  // The Employee Id textbox has no accessible name; observed order is Search, Employee Name, Employee Id.
  const employeeIdField = page.getByRole('textbox').nth(2);

  if (!(await employeeIdField.isVisible())) {
    await page.getByRole('button', { name: /|/ }).click();
  }

  await expect(employeeIdField).toBeVisible();
  await employeeIdField.fill(employeeId);
  await page.getByRole('button', { name: 'Search' }).click();

  const resultCount = page.getByText(/\(\d+\)\s+Records?\s+Found/);
  await expect(resultCount).toBeVisible();
  const countText = await resultCount.innerText();
  const reportedResultCount = Number(countText.match(/\((\d+)\)/)?.[1]);
  expect(reportedResultCount).toBeGreaterThan(0);

  const resultRows = employeeTable.getByRole('rowgroup').last().getByRole('row');
  const matchingRows = resultRows.filter({
    has: page.getByRole('cell', { name: employeeId, exact: true }),
  });
  await expect(matchingRows).toHaveCount(reportedResultCount);
  for (let index = 0; index < (await matchingRows.count()); index += 1) {
    const cells = matchingRows.nth(index).getByRole('cell');
    await expect(cells.nth(employeeIdColumn)).toHaveText(employeeId);
  }

  const observedEmployeeRow = matchingRows
    .filter({ has: page.getByRole('cell', { name: employeeFirstName, exact: true }) })
    .filter({ has: page.getByRole('cell', { name: employeeLastName, exact: true }) });
  await expect(observedEmployeeRow.first()).toBeVisible();
});
