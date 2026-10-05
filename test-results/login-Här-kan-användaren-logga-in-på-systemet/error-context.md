# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> Här kan användaren logga in på systemet
- Location: e2e\login.spec.js:3:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]: LOKAL
  - generic [ref=e4]:
    - banner [ref=e5]:
      - navigation [ref=e8]:
        - link "Översikt" [ref=e9] [cursor=pointer]:
          - /url: /
        - link "Fakturor" [ref=e10] [cursor=pointer]:
          - /url: /fakturor
        - link "Flyttanmälan" [ref=e11] [cursor=pointer]:
          - /url: /flytt
        - link "Mina uppgifter" [ref=e12] [cursor=pointer]:
          - /url: /profil
        - text: Logga ut
    - main [ref=e13]:
      - generic [ref=e14]:
        - heading "Hej Anna!" [level=1] [ref=e16]
        - generic [ref=e17]:
          - generic [ref=e18]:
            - generic [ref=e19]: Förbrukning senaste månaden
            - generic [ref=e20]: – kWh
          - generic [ref=e21]:
            - generic [ref=e22]: Aktuellt pris
            - generic [ref=e23]: – kr/kWh
          - generic [ref=e24]:
            - generic [ref=e25]: Avtal
            - generic [ref=e26]: Rörligt pris
        - generic [ref=e27]:
          - heading "Din elförbrukning – senaste 12 månaderna" [level=2] [ref=e28]
          - paragraph [ref=e29]: Laddar…
          - paragraph [ref=e30]: "Källa: din elmätare. Uppdateras varje dygn."
        - generic [ref=e31]:
          - heading "Spartips just nu" [level=2] [ref=e32]
          - paragraph [ref=e33]: Elpriset är som högst mellan 07–09 och 17–20. Flytta tvätt och diskmaskin till natten så kan du sänka din kostnad med upp till 15 %.
          - generic [ref=e34] [cursor=pointer]: Fler spartips
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
> 15 |   expect(await page.evaluate(() => localStorage.length)).toBe(0);
     |                                                          ^ Error: expect(received).toBe(expected) // Object.is equality
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
  26 |   await expect(page.getByRole("alert")).toBeVisible();
  27 |   await expect(page.getByRole("alert")).toHaveText(
  28 |     "Fel e-postadress eller lösenord.",
  29 |   );
  30 | 
  31 |   await expect(page).toHaveURL("http://localhost:8080/login");
  32 | 
  33 |   expect(await page.evaluate(() => localStorage.length)).toBe(0);
  34 | });
```