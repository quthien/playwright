import { Given, When, Then } from "@cucumber/cucumber";
import { page } from "../../src/support/setup";
import { chromium, Page } from "playwright";

Given("I go to website", async function () {
  try {
    await page.goto("https://automationexercise.com");
  } catch (error) {
    console.error("Error navigating to website:", error);
    throw error;
  }
});
