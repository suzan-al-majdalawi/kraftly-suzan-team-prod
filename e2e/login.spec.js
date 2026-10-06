import { test, expect } from "@playwright/test";

test("Här kan användaren logga in på systemet", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder("E-postadress").fill("newemail@email.com");
  await page.getByPlaceholder("Lösenord").fill("password12!");

  await page.getByRole("button", { name: "Logga in" }).click();

  await expect(page).toHaveURL("http://localhost:8080/");
  await expect(page.getByText("Mina uppgifter")).toBeVisible();

  // Access token ska inte sparas i localStorage.
  expect(
    await page.evaluate(() => localStorage.getItem("accessToken"))
  ).toBeNull();
});

test("Felaktiga inloggningsuppgifter visar felmeddelande", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder("E-postadress").fill("fel@example.com");
  await page.getByPlaceholder("Lösenord").fill("fel-lösenord");

  await page.getByRole("button", { name: "Logga in" }).click();

  await expect(page.getByRole("alert")).toBeVisible();

  await expect(page.getByRole("alert")).toHaveText(
    "Fel e-postadress eller lösenord."
  );

  await expect(page).toHaveURL("http://localhost:8080/login");

  expect(
    await page.evaluate(() => localStorage.getItem("accessToken"))
  ).toBeNull();
});