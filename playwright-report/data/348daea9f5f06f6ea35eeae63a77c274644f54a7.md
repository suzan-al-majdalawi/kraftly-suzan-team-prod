# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> Felaktiga inloggningsuppgifter visar felmeddelande
- Location: e2e\login.spec.js:18:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('alert')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('alert') with timeout 5000ms
  - waiting for getByRole('alert')

```

```yaml
- text: LOKAL
- banner:
  - img
  - navigation:
    - link "Översikt":
      - /url: /
    - link "Fakturor":
      - /url: /fakturor
    - link "Flyttanmälan":
      - /url: /flytt
    - link "Mina uppgifter":
      - /url: /profil
    - text: Logga ut
- main:
  - img
  - heading "Hej Anna!" [level=1]
  - text: Förbrukning senaste månaden 205 kWh Aktuellt pris 1.42 kr/kWh Avtal Rörligt pris
  - heading "Din elförbrukning – senaste 12 månaderna" [level=2]
  - paragraph: "Källa: din elmätare. Uppdateras varje dygn."
  - heading "Spartips just nu" [level=2]
  - paragraph: Elpriset är som högst mellan 07–09 och 17–20. Flytta tvätt och diskmaskin till natten så kan du sänka din kostnad med upp till 15 %.
  - text: Fler spartips
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("Här kan användaren logga in på systemet", async ({ page }) => {
  4  |   await page.goto("http://localhost:8080/login");
  5  | 
  6  |   await page.getByPlaceholder("E-postadress").fill("newemail@email.com");
  7  |   await page.getByPlaceholder("Lösenord").fill("password12!");
  8  | 
  9  |   await page.getByRole("button", { name: "Logga in" }).click();
  10 | 
  11 |   await expect(page).toHaveURL("http://localhost:8080/");
  12 |   await expect(page.getByText("Mina uppgifter")).toBeVisible();
  13 | 
  14 |   // Access token ska inte sparas i localStorage.
  15 |   expect(await page.evaluate(() => localStorage.length)).toBe(0);
  16 | });
  17 | 
  18 | test("Felaktiga inloggningsuppgifter visar felmeddelande", async ({ page }) => {
  19 |   await page.goto("http://localhost:8080/login");
  20 | 
  21 |   await page.getByPlaceholder("E-postadress").fill("fel@example.com");
  22 |   await page.getByPlaceholder("Lösenord").fill("fel-lösenord");
  23 | 
  24 |   await page.getByRole("button", { name: "Logga in" }).click();
  25 | 
> 26 |   await expect(page.getByRole("alert")).toBeVisible();
     |                                         ^ Error: expect(locator).toBeVisible() failed
  27 |   await expect(page.getByRole("alert")).toHaveText(
  28 |     "Fel e-postadress eller lösenord.",
  29 |   );
  30 | 
  31 |   await expect(page).toHaveURL("http://localhost:8080/login");
  32 | 
  33 |   expect(await page.evaluate(() => localStorage.length)).toBe(0);
  34 | });
```