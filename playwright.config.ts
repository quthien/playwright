import { LaunchOptions } from "@playwright/test";

const browserOptions: LaunchOptions = {
  slowMo: 0,
  headless: process.env.HEADLESS === "false", // Run tests in headless mode
  timeout: 60000,
};

export const playwrightConfig = {
  baseURL: process.env.BASE_URL,
  browserOptions,
  browser: process.env.BROWSER,
  baseURL_API: process.env.BASE_URL_API,
};
