import { LaunchOptions } from "@playwright/test";

const isHeadless = process.env.HEADLESS === "true" ? true : false;

const browserOptions: LaunchOptions = {
  slowMo: 0,
  headless: isHeadless,
  timeout: 60000,
};

export const playwrightConfig = {
  baseURL: process.env.BASE_URL,
  browserOptions,
  browser: process.env.BROWSER,
  baseURL_API: process.env.BASE_URL_API,
};
