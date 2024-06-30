import { LaunchOptions } from "@playwright/test";
const browserOptions: LaunchOptions = {
  slowMo: 0,
  headless: true, // Run tests in headless mode
};

export const playwrightConfig = {
  baseURL: "https://automationexercise.com",
  browserOptions,
  browser: process.env.BROWSER || "chromium",
};
