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
import { login } from "../steps/login.steps";

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

  // Step 1: Initialize browser
  await initializeBrowser();
  const tags = pickle.tags.map((tag) => tag.name);

  // Step 2: Handle API context initialization if needed
  if (
    tags.some((tag) => tag.startsWith("@api-")) ||
    tags.some((tag) => tag.startsWith("@mix"))
  ) {
    if (!this.apiManager?.initialized) {
      this.apiManager = new APIManager();
      await this.apiManager.initContext(APIHost.Host1, process.env.API_HOST_1);
      loggerInfo(`API context ${process.env.API_HOST_1}`);
    }
  }

  // Step 3: Handle UI context and cookies if needed
  if (
    tags.some((tag) => tag.startsWith("@ui-")) ||
    tags.some((tag) => tag.startsWith("@mix"))
  ) {
    if (!this.cookies) {
      loggerInfo(`No cookies, performing login...`);

      // Temporary context for login
      const tempContext = await browser.newContext();
      loggerInfo(`Performing login...`);
      this.cookies = await login("valid", tempContext); // Perform login and Save cookies after login
      await tempContext.close(); // Close temporary context
      loggerInfo(`Temporary context closed after login`);
    }

    // Create new context for actual tests and apply cookies
    this.context = await browser.newContext({ ignoreHTTPSErrors: true });
    await writeJsonFile("cookies.json", this.cookies);
    const specificCookie = this.cookies.filter(
      (cookie) => cookie.name === "_hjSessionUser_1678036",
    );
    await this.context.addCookies(specificCookie);
    this.page = await this.context.newPage();
    pageFixture.page = this.page;

    loggerInfo(`New context and page created for test`);
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

        // await this.context.tracing.stop({ path: `trace/${this.testName}.zip` }); // Save trace file
        if (image) {
          fs.writeFileSync(screenshotPath, image);
          await this.attach(screenshotPath, "image/png");
        }
        testCounts.failedTestCount++;
      } else if (result?.status === Status.SKIPPED) {
        testCounts.skippedTestCount++;
      }
    }

    // Clean up API contexts if they were initialized
    if (this.apiManager) {
      await this.apiManager.closeAllContexts();
    }

    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }

    loggerInfo(`Test finished: ${this.testName}`);
  } catch (error) {
    loggerInfo(`Error in After hook: ${error.message}`);
    throw error;
  }
});

AfterAll(async function (this: ICustomWorld) {
  if (browser) {
    try {
      await this.context.clearCookies(); // Clear cookies from the context
      console.log("Cookies cleared");
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
