import { test, expect } from "@playwright/test";

test("Tom flyttanmälan ska inte kunna skickas", async ({ page }) => {
  await page.goto("http://localhost:8080/login");

  await page.getByPlaceholder("E-postadress").fill("newemail@email.com");
  await page.getByPlaceholder("Lösenord").fill("password12!");

  await page.getByRole("button", { name: "Logga in" }).click();

  await expect(page).toHaveURL("http://localhost:8080/");

  await page.goto("http://localhost:8080/flytt");

  await page.getByRole("button", { name: "Skicka flyttanmälan" }).click();

  await expect(
    page.getByText("Fyll i alla uppgifter innan du skickar flyttanmälan."),
  ).toBeVisible();

  await expect(page.getByText(/Referensnummer:/)).not.toBeVisible();
});
