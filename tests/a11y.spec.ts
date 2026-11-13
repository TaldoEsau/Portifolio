import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("data pad has no serious accessibility violations", async ({ page }) => {
  await page.goto("/direto");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Esaú Santana",
  );
  const results = await new AxeBuilder({ page })
    .disableRules(["color-contrast"])
    .analyze();
  const blocking = results.violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical",
  );
  expect(blocking).toEqual([]);
});

test("shared sector hash skips the boot screen", async ({ page }) => {
  await page.goto("/#contato");
  await expect(page.getByRole("heading", { level: 1, name: /contato/i })).toBeVisible();
});
