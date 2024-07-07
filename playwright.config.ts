import { LaunchOptions } from "@playwright/test";

const browserOptions: LaunchOptions = {
  slowMo: 0,
  headless: process.env.HEADLESS === "true", // Run tests in headless mode
};

export const playwrightConfig = {
  baseURL: process.env.BASE_URL,
  browserOptions,
  browser: process.env.BROWSER,
};
