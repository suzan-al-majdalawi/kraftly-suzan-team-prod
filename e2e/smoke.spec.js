import { test, expect } from "@playwright/test";

test("kunden kan logga in och ser sin översikt", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder("E-postadress").fill("newemail@email.com");
  await page.getByPlaceholder("Lösenord").fill("password12!");

  await page.getByRole("button", { name: "Logga in" }).click();

  await expect(page).toHaveURL(/\/$/);

  await expect(
    page.getByRole("heading", { level: 1 })
  ).toHaveText("Hej Anna!");
});