import { Given, When, Then } from "@cucumber/cucumber";
import { chromium, Browser, Page } from "playwright";

let browser: Browser;
let page: Page;

Given("I am on the login page", async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto("https://example.com/login");
});

When("I enter valid credentials", async function () {
  await page.fill('input[name="username"]', "validUsername");
  await page.fill('input[name="password"]', "validPassword");
  await page.click('button[type="submit"]');
});

Then("I should see the dashboard", async function () {
  await page.waitForSelector("#dashboard");
  const dashboard = await page.$("#dashboard");
  if (dashboard === null) {
    throw new Error("Dashboard not found");
  }
  await browser.close();
});
