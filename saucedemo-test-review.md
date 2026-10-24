# SauceDemo Playwright Test Review

## Overall verdict

The five existing SauceDemo tests passed in the Chromium run performed for this review. They cover all five scenarios in the test plan and use visible UI state assertions rather than relying only on successful clicks. No blocking test defects were identified from the files and run reviewed.

The main outstanding evidence gap is the discrepancy between the browser findings and the later evidence summarized in the test plan: the findings document says the cart was opened directly and does not verify cart-button navigation, while the plan reports a later fresh-tab recheck confirming navigation and removal. That recheck was not verified as a separate browser context, so its context isolation and the cause of the earlier discrepancy remain unknown.

## Scenario coverage

| Planned scenario | Existing test | Review |
| --- | --- | --- |
| SD-01 — Successful login | `logs in successfully` | Checks navigation to `/inventory.html` and visibility of **Products**. |
| SD-02 — Invalid login | `shows an error for invalid login credentials` | Checks the root URL and exact mismatch alert after rejected credentials. |
| SD-03 — Product listing | `shows all observed products after login` | Checks the heading, sort control, and all six planned product names. |
| SD-04 — Add Backpack | `adds the Backpack and shows a cart count of one` | Checks the Backpack action becomes **Remove** and the cart control shows one item. |
| SD-05 — Remove Backpack | `removes the Backpack from the cart` | Checks cart-button navigation, cart heading and item presence, then removal, item absence, and empty cart state. |

## Test quality and configuration

- Each test uses the Playwright `page` fixture and navigates to the application root in `beforeEach`; Playwright's per-test browser context provides test-level cookie and storage isolation.
- The tests use role/name locators for login, alerts, cart controls, and product detail controls. The Backpack add selector is an ID directly recorded in the browser findings.
- Assertions wait for the expected URL or UI state; there are no fixed sleeps.
- The product listing test verifies the sort control is present, but not its selected default (`Name (A to Z)`) or sorting behavior. The plan identifies the observed default but does not require changing the sort.
- `playwright.config.ts` defines Chromium, Firefox, and WebKit, but this review ran Chromium only. No cross-browser conclusion is supported by this run.

## Evidence limitations and uncertainties

- The browser findings record that the cart URL was opened directly, so that observation does not establish that clicking the cart button navigates successfully. The plan reports that a later fresh-tab recheck did confirm cart-button navigation and removal; this agrees with the automated run below.
- The plan explicitly says the recheck tab was not verified as a separate browser context. The cause of the earlier MCP discrepancy therefore remains unknown, and the review cannot claim independent-context reproducibility for that recheck.
- The browser findings note earlier MCP click timeouts on controls that were visible. These are interaction-tool limitations in that inspection, not evidence that the application actions failed.
- Exact DOM selectors for the password field, cart button, and cart-row Remove action are not recorded, but the existing tests use accessible locators for these controls.

## Actual Chromium execution

Command run:

```text
npx playwright test tests/saucedemo.spec.ts --project=chromium
```

Actual result:

```text
Running 5 tests using 1 worker
[1/5] [chromium] › tests\saucedemo.spec.ts:18:5 › logs in successfully
[2/5] [chromium] › tests\saucedemo.spec.ts:25:5 › shows an error for invalid login credentials
[3/5] [chromium] › tests\saucedemo.spec.ts:36:5 › shows all observed products after login
[4/5] [chromium] › tests\saucedemo.spec.ts:56:5 › adds the Backpack and shows a cart count of one
[5/5] [chromium] › tests\saucedemo.spec.ts:65:5 › removes the Backpack from the cart
5 passed (8.6s)
```

**Result: 5 passed, 0 failed.** No failure details apply.

No tests, OrangeHRM files, or To-Do files were modified. Checkout and order flows were not attempted.
