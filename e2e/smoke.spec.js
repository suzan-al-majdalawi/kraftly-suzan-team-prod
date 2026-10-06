import { test, expect } from "@playwright/test";

test("kunden kan logga in och ser sin översikt", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder("E-postadress").fill("newemail@email.com");
  await page.getByPlaceholder("Lösenord").fill("password12!");

  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/v2/auth/login") &&
        response.request().method() === "POST" &&
        response.ok(),
    ),
    page.getByRole("button", { name: "Logga in" }).click(),
  ]);

  await expect(page).toHaveURL(/\/$/);

  const heading = page.getByRole("heading", { level: 1 });

  await expect(heading).toHaveText("Hej Anna!");
});