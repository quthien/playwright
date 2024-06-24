import { Given, When, Then } from "@cucumber/cucumber";
import { chromium, Browser, Page } from "playwright";
import * as playwrightConfig from "../../playwright.config";

let browser: Browser;
let page: Page;

Given("I go to website", async function () {
  browser = await chromium.launch(playwrightConfig.use.launchOptions);
  page = await browser.newPage();
  await page.goto("https://automationexercise.com/");
});
