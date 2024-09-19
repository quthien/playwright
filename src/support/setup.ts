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
import { loggerError, loggerInfo, logObject } from "../utils/logger"; // Custom logger
import { APIManager, APIHost } from "./apiManager";
import { writeJsonFile } from "../utils/JsonHelper";
import { login } from "../support/preAuthen";

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
  loggerInfo(`Test started: ${this.testName}`);

  const tags = pickle.tags.map((tag) => tag.name);

  if (tags.some((tag) => tag.startsWith("@api-") || tag.startsWith("@mix"))) {
    if (!this.apiManager?.initialized) {
      this.apiManager = new APIManager();
      await this.apiManager.initContext(APIHost.Host1, process.env.API_HOST_1);
      loggerInfo(`API context ${process.env.API_HOST_1}`);
    }
  }

  if (tags.some((tag) => tag.startsWith("@ui-") || tag.startsWith("@mix"))) {
    await initializeBrowser();

    // pre authen
    loggerInfo(`No cookies, performing login...`);
    const tempContext = await browser.newContext();

    await login("valid", tempContext);
    await tempContext.close();
    loggerInfo(`Temporary context closed after login`);

    if (!tags.some((tag) => tag.startsWith("@pre-authen"))) {
      this.context = await browser.newContext({
        storageState: "authentication/ui-authen.json",
      });
      this.page = await this.context.newPage();
      pageFixture.page = this.page;
      loggerInfo("Using storage state for authentication.");
    } else {
      this.context = await browser.newContext();
      this.page = await this.context.newPage();
      loggerInfo("Skipping storage state for this test case.");
      pageFixture.page = this.page;
      const storageState = await this.context.storageState();
      loggerInfo(`Storage State: ${JSON.stringify(storageState)}`);
      loggerInfo(`New context and page created for test`);
    }
  }
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  try {
    if (result) {
      if (result.status === Status.PASSED) testCounts.passedTestCount++;
      else if (result.status === Status.FAILED) {
        const screenshotPath = path.resolve(
          `./screenshots/${this.testName}.png`,
        );
        const image = await this.page?.screenshot();
        // await this.context.tracing.stop({ path: `trace/${this.testName}.zip` }); // Save trace file
        if (image) {
          fs.writeFileSync(screenshotPath, image);
          await this.attach(screenshotPath, "image/png");
        }
        testCounts.failedTestCount++;
      } else if (result.status === Status.SKIPPED) {
        testCounts.skippedTestCount++;
      }
    }

    if (this.apiManager) await this.apiManager.closeAllContexts();
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();

    loggerInfo(`Test finished: ${this.testName}`);
  } catch (error) {
    loggerError(`Error in After hook: ${error.message}`);
    throw error;
  }
});

AfterAll(async function (this: ICustomWorld) {
  if (browser) {
    try {
      await this.context.clearCookies();
      loggerInfo("Cookies cleared");
      await browser.close();
      loggerInfo("Browser closed");
    } catch (error) {
      loggerError(`Error closing browser: ${error.message}`);
    }
  } else {
    loggerError("No browser instance to close");
  }

  const reportData = {
    passed: testCounts.passedTestCount,
    failed: testCounts.failedTestCount,
    skipped: testCounts.skippedTestCount,
  };

  await writeJsonFile("reports/test-summary.json", reportData);
});
