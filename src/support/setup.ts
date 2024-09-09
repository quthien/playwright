import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  Status,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { ReportportalAgent } from "agent-js-cucumber";
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
import axios from "axios";
import { playwrightConfig } from "../../playwright.config";
import { ICustomWorld } from "../support/custom-world";
import { pageFixture } from "../support/pageFixture";
import fs from "fs";
import path from "path";
import { Logger } from "../utils/Logger"; // Custom logger
import { APIManager, APIHost } from "./APIManager";

let browser: Browser;

declare global {
  var browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
}

const logger = new Logger();

setDefaultTimeout(60 * 1000); // Can not be set into step BeforeAll
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

let reportPortalAgent;
let passedTestCount = 0;
let failedTestCount = 0;
let skippedTestCount = 0;

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
    logger.info("Browser initialized");
  }
}

BeforeAll(() => {
  reportPortalAgent = new ReportportalAgent();
});

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  this.testName = pickle.name.replace(/\W/g, "-");
  this.feature = pickle;
  logger.info(`API context ${this.apiManager.initialized}`);

  logger.info(`Test started: ${this.testName}`);
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
    logger.info(`API context ${process.env.API_HOST_1}`);
  }
});

Before({ tags: "@API" }, async function (this: ICustomWorld) {
  // Initialize API context
  if (!this.apiManager.initialized) {
    this.apiManager = new APIManager();
    await this.apiManager.initContext(APIHost.Host1, process.env.API_HOST_1);
    logger.info(`API context ${process.env.API_HOST_1}`);
  }
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  try {
    if (result) {
      if (result.status === Status.PASSED) {
        passedTestCount++;
        reportPortalAgent.sendLog({ level: "INFO", message: `Test Passed` });
      } else if (result?.status === Status.FAILED) {
        const image = await this.page?.screenshot();
        const screenshotPath = path.resolve(
          `./screenshots/${this.testName}.png`,
        );
        if (image) {
          fs.writeFileSync(screenshotPath, image);
          await this.attach(screenshotPath, "image/png");
        }
        failedTestCount++;
        reportPortalAgent.sendLog({ level: "ERROR", message: `Test Failed` });
      } else if (result?.status === Status.SKIPPED) {
        skippedTestCount++;
        reportPortalAgent.sendLog({ level: "WARN", message: `Test Skipped` });
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
    logger.info(`Test finished: ${this.testName}`);
  } catch (error) {
    logger.error(`Error in After hook: ${error.message}`);
    throw error;
  }
});

AfterAll(async () => {
  if (browser) {
    try {
      await browser.close();
      logger.info("Browser closed");
    } catch (error) {
      logger.error(`Error closing browser: ${error.message}`);
    }
  } else {
    logger.info("No browser instance to close");
  }

  const message = {
    text: `${passedTestCount} test passed, ${failedTestCount} tests failed, ${skippedTestCount} tests skipped`,
  };

  try {
    await axios.post(SLACK_WEBHOOK_URL, message);
    console.log("Slack notification sent");
  } catch (error) {
    console.error("Failed to send Slack notification:", error);
  }
  await reportPortalAgent.finish();
});
