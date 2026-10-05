import { test, expect } from "@playwright/test";

test("navigation between different pages work", async ({ page }) => {
  await page.goto("/login");

  await page
    .getByPlaceholder("E-postadress")
    .fill("newemail@email.com");

  await page
    .getByPlaceholder("Lösenord")
    .fill("password12!");

  await page.getByRole("button", { name: "Logga in" }).click();

  await expect(page).toHaveURL(/\/$/);

  // Fakturor
  await page.getByRole("link", { name: "Fakturor" }).click();

  await expect(page).toHaveURL(/\/fakturor\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Fakturor",
  );

  // Flyttanmälan
  await page.getByRole("link", { name: "Flyttanmälan" }).click();

  await expect(page).toHaveURL(/\/flytt\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Flyttanmälan",
  );

  // Mina uppgifter
  await page.getByRole("link", { name: "Mina uppgifter" }).click();

  await expect(page).toHaveURL(/\/profil\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Mina uppgifter",
  );
});