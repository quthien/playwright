import { playwrightConfig } from "../../playwright.config";
import { chromium, firefox, webkit, Browser } from "@playwright/test";
import { loggerInfo } from "../utils/logger";
import { APIHost, APIManager } from "./apiManager";
import { ICustomWorld } from "./custom-world";

let browserInstance: Browser | null = null;

// singleton browser instance
export async function initializeBrowser(): Promise<Browser> {
  if (!browserInstance) {
    loggerInfo("Initializing browser");
    switch (playwrightConfig.browser) {
      case "firefox":
        browserInstance = await firefox.launch(playwrightConfig.browserOptions);
        break;
      case "webkit":
        browserInstance = await webkit.launch(playwrightConfig.browserOptions);
        break;
      case "chromiumRemote":
        browserInstance = await chromium.connectOverCDP(
          "http://host.docker.internal:9222",
        );
        break;
      default:
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
  const baseUrL = "http://localhost:1234";
  if (!world.apiManager?.initialized) {
    world.apiManager = new APIManager();
    await world.apiManager.initContext(APIHost.Host1, baseUrL);
    loggerInfo(`API context ${baseUrL}`);
  }
}
