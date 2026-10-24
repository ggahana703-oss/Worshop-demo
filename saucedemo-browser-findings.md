# SauceDemo Browser Findings

**Application inspected:** https://www.saucedemo.com/  
**Inspection method:** Shared Playwright MCP browser page, accessibility snapshots, keyboard interaction, and screenshots.  
**Related plan:** [SauceDemo End-to-End Test Plan](./saucedemo-test-plan.md)

## 1. Login page

- **Page title:** `Swag Labs`
- **URL:** `/`
- **Form accessible name:** `Login`
- **Username:** textbox, accessible name `Username`. A browser locator trace exposed `id="user-name"` and `data-test="username"` (CSS selectors `#user-name` and `[data-test="username"]`).
- **Password:** textbox, accessible name `Password`. The value was masked in the screenshot; its exact DOM selector was not confirmed during this inspection.
- **Submit:** button, accessible name `Login`. A locator trace exposed `id="login-button"` and `data-test="login-button"` (selectors `#login-button` and `[data-test="login-button"]`).
- **Error area:** no alert was present on the initial page. It appeared as a role `alert` after an invalid submission, alongside a `Dismiss error` button.
- The login view visibly lists accepted demo usernames and states `secret_sauce` as the password for all users.

## 2. Valid login

**Credentials entered:** `standard_user` / `secret_sauce`

- The values appeared in the labeled textboxes before submission.
- Submitting opened `/inventory.html`; the page title remained `Swag Labs`.
- The product page displayed the text `Products` and a `Sort products` combobox, with `Name (A to Z)` selected by default.
- Submission succeeded using keyboard focus followed by Enter. The MCP click action timed out against the login button despite the control being present in the accessibility snapshot.

## 3. Product page

Six products and their product-detail accessible button names were observed:

1. Sauce Labs Backpack — `View details for Sauce Labs Backpack`
2. Sauce Labs Bike Light — `View details for Sauce Labs Bike Light`
3. Sauce Labs Bolt T-Shirt — `View details for Sauce Labs Bolt T-Shirt`
4. Sauce Labs Fleece Jacket — `View details for Sauce Labs Fleece Jacket`
5. Sauce Labs Onesie — `View details for Sauce Labs Onesie`
6. Test.allTheThings() T-Shirt (Red) — `View details for Test.allTheThings() T-Shirt (Red)`

- Each product had an `Add to cart` button before the add action. The Backpack button's locator trace exposed `id="add-to-cart-sauce-labs-backpack"` (`#add-to-cart-sauce-labs-backpack`).
- The product name also appeared as an image accessible name and as text within its detail button.
- The header cart control was exposed as a **button**, not a link, named `Cart, empty` before adding an item and `Cart, 1 items` afterward.
- After adding the Backpack, its action changed to `Remove` and the cart count showed `1`.
- **Selector note:** Since every product's action button has the same accessible name `Add to cart`, a test should scope the action to the selected product's card/container. Only the Backpack's exact action ID was observed.

## 4. Cart page

- The cart was inspected at `/cart.html` after adding the Backpack. (The browser's cart header control was exposed in the snapshot, but clicking it was not successfully validated in this run; the cart URL was opened directly.)
- **Page title:** `Swag Labs`
- The page displayed `Your Cart`, with `QTY` and `Description` labels.
- The row showed quantity `1`, `Sauce Labs Backpack`, its description, and `$29.99`.
- A `Remove` button was present for the row. The cart header control remained `Cart, 1 items`.
- The exact DOM selector for the cart control and the `Remove` button was not confirmed. The snapshot only established their accessible names and roles.

## 5. Invalid login

**Credentials entered:** `not_a_user` / `secret_sauce`

- Submission stayed on `/`; the page title remained `Swag Labs`.
- A role `alert` appeared with the exact text: **Epic sadface: Username and password do not match any user in this service**
- The alert also contained a `Dismiss error` button.
- The message describes a username/password mismatch rather than identifying the username specifically.

## Reliability notes and uncertainties

- The visible page and accessibility snapshots were available throughout. Some MCP click actions timed out on controls that appeared in the snapshot, so keyboard focus plus Enter was used to submit forms and add the Backpack.
- The cart content and count were verified, but navigation via clicking the cart header button was not verified; `/cart.html` was opened directly after adding the item.
- Exact CSS selectors were only recorded where the browser locator trace directly exposed them. Prefer the observed accessible names and scope repeated product actions by product.
- No checkout steps were taken, no order was placed, and no real personal information was entered.
