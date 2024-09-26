import {
  Before,
  After,
  AfterAll,
  Status,
  setDefaultTimeout,
  BeforeAll,
} from "@cucumber/cucumber";
import { Browser } from "@playwright/test";
import { ITestCaseHookParameter } from "@cucumber/cucumber/lib/support_code_library_builder/types";
import { ICustomWorld } from "./custom-world";
import { pageFixture } from "./pageFixture";
import fs from "fs";
import path from "path";
import { loggerError, loggerInfo } from "../utils/logger"; // Custom logger
import { writeJsonFile } from "../utils/JsonHelper";
import { login } from "./preAuthen";
import {
  getBrowserInstance,
  initializeAPIManager,
  initializeBrowser,
} from "./setup";

setDefaultTimeout(60 * 1000); // Can not be set into step BeforeAll
const testCounts = {
  passedTestCount: 0,
  failedTestCount: 0,
  skippedTestCount: 0,
};

let browserInstance: Browser | null = null;

BeforeAll(async function (this: ICustomWorld) {
  browserInstance = await initializeBrowser();
  // pre authen ui if needed
  if (!fs.existsSync("authentication/ui-authen.json")) {
    loggerInfo(`No authentication state found, performing login...`);
    const tempContext = await browserInstance.newContext();
    await login("valid", tempContext);
    await tempContext.close();
    loggerInfo(`Temporary context closed after login`);
  } else {
    loggerInfo(`Authentication state found, using existing state.`);
  }
});

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  this.testName = pickle.name.replace(/\W/g, "-");
  this.feature = pickle;
  loggerInfo(`Test started: ${this.testName}`);

  const tags = pickle.tags.map((tag) => tag.name);

  if (tags.some((tag) => tag.startsWith("@api-") || tag.startsWith("@mix"))) {
    await initializeAPIManager(this);
    loggerInfo(`API contexts in after ${this.apiManager}}`);
  }

  if (tags.some((tag) => tag.startsWith("@ui-") || tag.startsWith("@mix"))) {
    browserInstance = await getBrowserInstance();

    if (tags.some((tag) => tag.startsWith("@pre-authen"))) {
      this.context = await browserInstance.newContext({
        storageState: "authentication/ui-authen.json",
      });
      loggerInfo("Using storage state for authentication.");
    } else {
      this.context = await browserInstance.newContext();
      loggerInfo("Skipping storage state for this test case.");
    }

    this.page = await this.context.newPage();
    pageFixture.page = this.page;
    loggerInfo(`New context and page created for test: ${this.testName}`);
  }
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  try {
    if (result) {
      switch (result.status) {
        case Status.FAILED:
          const screenshotPath = path.resolve(
            `./screenshots/${this.testName}.png`,
          );
          const image = await this.page?.screenshot();
          if (image) {
            fs.writeFileSync(screenshotPath, image);
            await this.attach(screenshotPath, "image/png");
          }
          testCounts.failedTestCount++;
          loggerError(`Test failed: ${this.testName}`);

          break;
        case Status.PASSED:
          testCounts.passedTestCount++;
          loggerInfo(`Test passed: ${this.testName}`);
          break;
        case Status.SKIPPED:
          testCounts.skippedTestCount++;
          loggerInfo(`Test skipped: ${this.testName}`);
          break;
        default:
          loggerInfo(`Test status unknown: ${this.testName}`);
          break;
      }
    }

    if (this.page) await this.page.close();
    if (this.context) await this.context.close();

    loggerInfo(`Test finished: ${this.testName}`);
  } catch (error) {
    loggerError(`Error in After hook: ${error.message}`);
    throw error;
  }
});

AfterAll(async function (this: ICustomWorld) {
  if (this?.apiManager) {
    try {
      await this.apiManager.closeAllContexts();
      loggerInfo("API contexts closed");
    } catch (error) {
      loggerError(`Error closing API contexts: ${error.message}`);
    }
  } else {
    loggerInfo("API manager not initialized, skipping API context closure.");
  }

  if (browserInstance) {
    try {
      await browserInstance.close();
      loggerInfo("Browser closed");
    } catch (error) {
      loggerError(`Error closing browser: ${error.message}`);
    }
  } else {
    loggerError("No browser instance to close");
  }

  // if (this.context) await this.context.close();

  const reportData = {
    passed: testCounts.passedTestCount,
    failed: testCounts.failedTestCount,
    skipped: testCounts.skippedTestCount,
  };

  await writeJsonFile("reports/test-summary.json", reportData);
});
