import { playwrightConfig } from "../../playwright.config";
import { firefox, webkit, Browser } from "@playwright/test";
import { chromium } from "playwright-extra";
import { loggerInfo } from "../utils/logger";
import { APIHost, APIManager } from "./apiManager";
import { ICustomWorld } from "./custom-world";

let browserInstance: Browser | null = null;
const stealth = require("puppeteer-extra-plugin-stealth")();
// singleton browser instance
export async function initializeBrowser(): Promise<Browser> {
  if (!browserInstance) {
    switch (playwrightConfig.browser) {
      case "firefox":
        browserInstance = await firefox.launch(playwrightConfig.browserOptions);
        break;
      case "webkit":
        browserInstance = await webkit.launch(playwrightConfig.browserOptions);
        break;
      default:
        chromium.use(stealth);
        browserInstance = await chromium.launch(
          playwrightConfig.browserOptions,
        );
    }
    loggerInfo("Browser initialized");
  }
  return browserInstance;
}

export function getBrowserInstance(): Browser | null {
  return browserInstance;
}

export async function initializeAPIManager(world: ICustomWorld) {
  if (!world.apiManager?.initialized) {
    world.apiManager = new APIManager();
    await world.apiManager.initContext(APIHost.Host1, process.env.API_HOST_1);
    loggerInfo(`API context ${process.env.API_HOST_1}`);
  }
}
