import { test, expect } from "@playwright/test";

test("Här kan användaren logga in på systemet", async ({ page }) => {
  await page.goto("http://localhost:8080/login");

  await page.getByPlaceholder("E-postadress").fill("newemail@email.com");
  await page.getByPlaceholder("Lösenord").fill("password12!");

  await page.getByRole("button", { name: "Logga in" }).click();

  await expect(page).toHaveURL("http://localhost:8080/");
  await expect(page.getByText("Mina uppgifter")).toBeVisible();
});
