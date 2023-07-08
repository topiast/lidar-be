const { test, expect } = require("@playwright/test");

test("Server responds with a page with the title 'Hello world!'", async ({ page }) => {
  await page.goto("/");
  expect(await page.title()).toBe("Hello world!");
});
