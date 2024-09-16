import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  Status,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { ITestCaseHookParameter } from "@cucumber/cucumber/lib/support_code_library_builder/types";
import {
  chromium,
  ChromiumBrowser,
  firefox,
  FirefoxBrowser,
  webkit,
  WebKitBrowser,
  Browser,
} from "@playwright/test";
import { playwrightConfig } from "../../playwright.config";
import { ICustomWorld } from "../support/custom-world";
import { pageFixture } from "../support/pageFixture";
import fs from "fs";
import path from "path";
import { loggerInfo } from "../utils/logger"; // Custom logger
import { APIManager, APIHost } from "./apiManager";
import { writeJsonFile } from "../utils/JsonHelper";

let browser: Browser;

declare global {
  var browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
}

setDefaultTimeout(60 * 1000); // Can not be set into step BeforeAll
const testCounts = {
  passedTestCount: 0,
  failedTestCount: 0,
  skippedTestCount: 0,
};

async function initializeBrowser() {
  if (!browser) {
    switch (playwrightConfig.browser) {
      case "firefox":
        browser = await firefox.launch(playwrightConfig.browserOptions);
        break;
      case "webkit":
        browser = await webkit.launch(playwrightConfig.browserOptions);
        break;
      default:
        browser = await chromium.launch(playwrightConfig.browserOptions);
    }
    loggerInfo("Browser initialized");
  }
}

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  this.testName = pickle.name.replace(/\W/g, "-");
  this.feature = pickle;
  loggerInfo(`API context ${this.apiManager.initialized}`);

  loggerInfo(`Test started: ${this.testName}`);
});

Before({ tags: "@UI" }, async function (this: ICustomWorld) {
  await initializeBrowser();

  this.context = await browser.newContext({ ignoreHTTPSErrors: true });
  this.page = await this.context.newPage();
  pageFixture.page = this.page;
});

Before({ tags: "@MIX" }, async function (this: ICustomWorld) {
  // Initialize both browser and API contexts
  await initializeBrowser();

  this.context = await browser.newContext({ ignoreHTTPSErrors: true });
  this.page = await this.context.newPage();
  pageFixture.page = this.page;

  // Initialize API context
  if (!this.apiManager.initialized) {
    this.apiManager = new APIManager();
    await this.apiManager.initContext(APIHost.Host1, process.env.API_HOST_1);
    loggerInfo(`API context ${process.env.API_HOST_1}`);
  }
});

Before({ tags: "@API" }, async function (this: ICustomWorld) {
  // Initialize API context
  if (!this.apiManager.initialized) {
    this.apiManager = new APIManager();
    await this.apiManager.initContext(APIHost.Host1, process.env.API_HOST_1);
    loggerInfo(`API context ${process.env.API_HOST_1}`);
  }
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  try {
    if (result) {
      if (result.status === Status.PASSED) {
        testCounts.passedTestCount++;
      } else if (result?.status === Status.FAILED) {
        const image = await this.page?.screenshot();
        const screenshotPath = path.resolve(
          `./screenshots/${this.testName}.png`,
        );
        if (image) {
          fs.writeFileSync(screenshotPath, image);
          await this.attach(screenshotPath, "image/png");
        }
        testCounts.failedTestCount++;
      } else if (result?.status === Status.SKIPPED) {
        testCounts.skippedTestCount++;
      }
    }
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }

    // Clean up API contexts if they were initialized
    if (this.apiManager) {
      await this.apiManager.closeAllContexts();
    }
    loggerInfo(`Test finished: ${this.testName}`);
  } catch (error) {
    loggerInfo(`Error in After hook: ${error.message}`);
    throw error;
  }
});

AfterAll(async function () {
  if (browser) {
    try {
      await browser.close();
      loggerInfo("Browser closed");
    } catch (error) {
      loggerInfo(`Error closing browser: ${error.message}`);
    }
  } else {
    loggerInfo("No browser instance to close");
  }

  const reportData = {
    passed: testCounts.passedTestCount,
    failed: testCounts.failedTestCount,
    skipped: testCounts.skippedTestCount,
  };

  await writeJsonFile("reports/test-summary.json", reportData);
});
