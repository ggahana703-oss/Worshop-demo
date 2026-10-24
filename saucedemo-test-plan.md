# SauceDemo End-to-End Test Plan

**Application:** https://www.saucedemo.com/  
**Purpose:** A small, beginner-friendly suite for login, the product list, and basic cart actions.  
**Scope limit:** Do not enter checkout or place orders.

## Evidence and confidence

This plan separates the behavior the tests are meant to check from what the available evidence currently confirms. “Confirmed” is scoped to the named observation/run; it is not a claim that the public application behaves consistently in every browser session.

| Behavior | Evidence available | Current status |
| --- | --- | --- |
| Valid login opens the product page | Shared MCP inspection recorded `/inventory.html` and the **Products** heading. The isolated Chromium suite also passed its login assertion. | **Confirmed in both reported paths** |
| Product list contains the six named products and a sort control | Recorded in the shared MCP findings; the Chromium suite passed its listing assertions. | **Confirmed in both reported paths** |
| Invalid login displays the mismatch alert | Earlier shared MCP findings and the latest fresh-tab Browser Explorer recheck observed the alert; the Chromium run passed its alert assertion. | **Confirmed in latest recheck and Chromium run** |
| Adding the Backpack changes its action and cart count | Earlier shared MCP findings and the latest fresh-tab Browser Explorer recheck observed the action/count update; the Chromium run passed its assertions. | **Confirmed in latest recheck and Chromium run** |
| Clicking the cart control navigates to the cart | The latest fresh-tab Browser Explorer recheck confirmed navigation with the item present; the Chromium run passed its navigation assertion. Earlier findings opened `/cart.html` directly and did not verify click navigation. | **Confirmed in latest recheck and Chromium run** |
| Cart contains the Backpack and allows removal | Earlier findings observed the cart row and Remove control after adding the item; the latest fresh-tab Browser Explorer recheck confirmed the item and removal; the Chromium run passed its cart/removal assertions. | **Confirmed in latest recheck and Chromium run** |

The latest Browser Explorer fresh-tab recheck agrees with the latest Chromium run on the disputed UI outcomes. However, the fresh tab was not verified as a separate browser context, so it does not establish context isolation or explain the earlier MCP discrepancy. The cause of that discrepancy remains unknown. Reported telemetry errors had no corresponding UI failure in the recheck.

## Scenarios

### SD-01 — Successful login

**Priority:** P1 — Critical  
**Type:** Positive  
**Preconditions:** Begin signed out on the login page.

**Steps**
1. Enter `standard_user` in the **Username** field.
2. Enter `secret_sauce` in the **Password** field.
3. Select **Login**.

**Expected results**
- The browser navigates to `/inventory.html`.
- The page shows the **Products** heading and a product listing.

**Evidence status:** Confirmed by the earlier shared MCP inspection and the isolated Chromium rerun.

### SD-02 — Invalid login displays an error

**Priority:** P1 — Critical  
**Type:** Negative  
**Preconditions:** Begin signed out on the login page.

**Steps**
1. Enter `not_a_user` in **Username**.
2. Enter `wrong_password` in **Password**.
3. Select **Login**.

**Expected results**
- Login is rejected and the user stays on the login page.
- An alert displays: **Epic sadface: Username and password do not match any user in this service**.

**Evidence status:** The latest fresh-tab Browser Explorer recheck observed the exact alert, and the latest Chromium run passed its alert assertion. This agrees with the earlier shared MCP inspection. The fresh tab was not verified as a separate browser context; the cause of the earlier discrepancy remains unknown.

### SD-03 — Product listing after login

**Priority:** P1 — Critical  
**Type:** Positive  
**Preconditions:** Begin signed out.

**Steps**
1. Log in with `standard_user` / `secret_sauce`.
2. Inspect the product listing.

**Expected results**
- The `/inventory.html` page shows the **Products** heading.
- All six observed products are present: Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt, Sauce Labs Fleece Jacket, Sauce Labs Onesie, and Test.allTheThings() T-Shirt (Red).
- The **Sort products** control is visible (the earlier inspection recorded **Name (A to Z)** as the default).

**Evidence status:** The heading, product names, and sort control were confirmed in earlier shared MCP inspection and the isolated Chromium rerun. The default sort value was observed earlier; the review says the automated suite checks the control's presence, not its selected value.

### SD-04 — Add a product and verify the cart count

**Priority:** P1 — Critical  
**Type:** Positive  
**Preconditions:** Begin signed out with an empty cart in a fresh browser context.

**Steps**
1. Log in with `standard_user` / `secret_sauce`.
2. Select **Add to cart** for **Sauce Labs Backpack**.
3. Inspect the product action and cart control in the page header.

**Expected results**
- The Backpack action changes to **Remove**.
- The cart control shows **Cart, 1 items** (count `1`).

**Evidence status:** The latest fresh-tab Browser Explorer recheck observed both the Backpack action change and cart count update, and the latest Chromium run passed both assertions. This agrees with the earlier shared MCP inspection. The fresh tab was not verified as a separate browser context; the cause of the earlier discrepancy remains unknown. Check the resulting UI state rather than treating a click completing as proof of mutation.

### SD-05 — Remove a product from the cart

**Priority:** P1 — Critical  
**Type:** Positive  
**Preconditions:** Begin signed out with an empty cart in a fresh browser context.

**Steps**
1. Log in with `standard_user` / `secret_sauce`.
2. Select **Add to cart** for **Sauce Labs Backpack**.
3. Verify the cart count updates, then click the cart control.
4. Verify the cart page and Backpack row are displayed.
5. Select **Remove** for **Sauce Labs Backpack**.

**Expected results**
- Clicking the cart control opens the cart page.
- Sauce Labs Backpack is listed in **Your Cart** before removal.
- After removal, Sauce Labs Backpack is no longer listed and the cart control shows **Cart, empty**.

**Evidence status:** The latest fresh-tab Browser Explorer recheck confirmed cart-button navigation with the Backpack present and its removal; the latest Chromium run passed the navigation and removal assertions. Earlier shared MCP inspection confirmed the cart row and Remove control after opening `/cart.html` directly, but did not validate cart-button navigation. The fresh tab was not verified as a separate browser context, so the cause of the earlier MCP discrepancy remains unknown.

## Discrepancy status and remaining uncertainty

The latest fresh-tab Browser Explorer recheck confirmed the invalid-login alert, Backpack action/count update, cart navigation with the item, and removal. This agrees with the latest Chromium run: `npx playwright test tests/saucedemo.spec.ts --project=chromium` — **5 passed in 11.5s**. Reported telemetry errors did not correspond to a UI failure. The recheck tab was not verified as a separate browser context, so the cause of the earlier MCP discrepancy remains unknown; these observations do not establish behavior across contexts or browsers. Keep the test files unchanged. No checkout or order flow is in scope.

## Workshop reliability notes

- Run each scenario with a fresh browser context or reset the app state so cart contents and login state do not leak between tests.
- Prefer accessible names and roles observed in the UI (for example, textbox **Username**, button **Login**, and button **Add to cart**) over CSS classes or positional selectors.
- Wait for the expected page or UI state, such as the **Products** heading or updated cart control; avoid fixed sleeps.
- Use the regular `standard_user` account for predictable behavior in these basic flow tests.
