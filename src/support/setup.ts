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
  ChromiumBrowser,
  firefox,
  FirefoxBrowser,
  webkit,
  WebKitBrowser,
  ConsoleMessage,
  request,
  Browser,
} from "@playwright/test";

import { chromium } from "playwright-extra";
import { playwrightConfig } from "../../playwright.config";
import { ICustomWorld } from "../support/custom-world";
import { pageFixture } from "../support/pageFixture";
import { DotenvConfigOptions } from "@dotenvx/dotenvx";
import fs from "fs";
import path from "path";
import { Logger } from "../utils/Logger"; // Custom logger

let browser: Browser;

require("@dotenvx/dotenvx").config({ path: "/custom/path/to/.env" });
const stealth = require("puppeteer-extra-plugin-stealth")();

declare global {
  var browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
}

const logger = new Logger();

setDefaultTimeout(60 * 1000); // Can not be set into step BeforeAll

BeforeAll(async () => {
  try {
    switch (playwrightConfig.browser) {
      case "firefox":
        browser = await firefox.launch(playwrightConfig.browserOptions);
        break;
      case "webkit":
        browser = await webkit.launch(playwrightConfig.browserOptions);
        break;
      default:
        chromium.use(stealth);
        browser = await chromium.launch(playwrightConfig.browserOptions);
    }
    logger.info(`Browser launched: ${playwrightConfig.browser}`);
  } catch (error) {
    logger.error(`Error launching browser: ${error.message}`);
    throw error;
  }
});

AfterAll(async () => {
  try {
    await browser.close();
    logger.info("Browser closed");
  } catch (error) {
    logger.error(`Error closing browser: ${error.message}`);
  }
});

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  try {
    this.context = await browser.newContext({ ignoreHTTPSErrors: true });
    this.testName = pickle.name.replace(/\W/g, "-");
    this.page = await this.context.newPage();
    pageFixture.page = this.page;
    this.server = await request.newContext({
      baseURL: playwrightConfig.baseURL_API,
    });
    this.feature = pickle;
    logger.info(`Test started: ${this.testName}`);
  } catch (error) {
    logger.error(`Error in Before hook: ${error.message}`);
    throw error;
  }
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  try {
    if (result) {
      if (result.status === Status.FAILED) {
        const image = await this.page?.screenshot();
        const screenshotPath = path.resolve(
          `./screenshots/${this.testName}.png`,
        );
        if (image) {
          fs.writeFileSync(screenshotPath, image);
          await this.attach(screenshotPath, "image/png");
        }
      }
    }
    await pageFixture.page.close();
    await this.context.close();
    logger.info(`Test finished: ${this.testName}`);
  } catch (error) {
    logger.error(`Error in After hook: ${error.message}`);
    throw error;
  }
});
