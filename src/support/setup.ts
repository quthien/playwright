import { playwrightConfig } from "../../playwright.config";
import { chromium, firefox, webkit, Browser } from "@playwright/test";
import { loggerInfo } from "../utils/logger";
import { APIHost, APIManager } from "./APIManager";
import { ICustomWorld } from "./custom-world";

export async function initializeBrowser() {
  if (!global.browser) {
    switch (playwrightConfig.browser) {
      case "firefox":
        global.browser = await firefox.launch(playwrightConfig.browserOptions);
        break;
      case "webkit":
        global.browser = await webkit.launch(playwrightConfig.browserOptions);
        break;
      default:
        global.browser = await chromium.launch(playwrightConfig.browserOptions);
    }
    loggerInfo("Browser initialized");
  }
}

export async function initializeAPIManager(world: ICustomWorld) {
  if (!world.apiManager?.initialized) {
    world.apiManager = new APIManager();
    await world.apiManager.initContext(APIHost.Host1, process.env.API_HOST_1);
    loggerInfo(`API context ${process.env.API_HOST_1}`);
  }
}
