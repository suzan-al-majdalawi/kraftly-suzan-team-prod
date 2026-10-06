# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.js >> kunden kan logga in och ser sin översikt
- Location: e2e\smoke.spec.js:3:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByRole('heading', { level: 1 })
Expected: "Hej!"
Received: "Hej Anna!"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" getByRole('heading', { level: 1 }) with timeout 5000ms
  - waiting for getByRole('heading', { level: 1 })
    14 × locator resolved to <h1 data-v-145c1607="">Hej Anna!</h1>
       - unexpected value "Hej Anna!"

```

```yaml
- heading "Hej Anna!" [level=1]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("kunden kan logga in och ser sin översikt", async ({ page }) => {
  4  |   await page.goto("/login");
  5  | 
  6  |   await page.getByPlaceholder("E-postadress").fill("newemail@email.com");
  7  |   await page.getByPlaceholder("Lösenord").fill("password12!");
  8  | 
  9  |   await page.getByRole("button", { name: "Logga in" }).click();
  10 | 
  11 |   await expect(page).toHaveURL(/\/$/);
  12 | 
> 13 |   await expect(page.getByRole("heading", { level: 1 })).toHaveText(
     |                                                         ^ Error: expect(locator).toHaveText(expected) failed
  14 |     "Hej!",
  15 |   );
  16 | });
```