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
import { Pact } from "@pact-foundation/pact";
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
import { setupProvider, finalizeProvider } from "./pactSetup";

const { Mutex } = require("async-mutex");
const mutex = new Mutex();
const lockFilePath = path.resolve("authentication/login.lock");
let sharedBrowserContext = null;

setDefaultTimeout(120 * 1000); // Can not be set into step BeforeAll
const testCounts = {
  passedTestCount: 0,
  failedTestCount: 0,
  skippedTestCount: 0,
};

let browserInstance: Browser | null = null;

BeforeAll(async function (this: ICustomWorld) {
  // await setupProvider(); // Set up the mock server once before all tests

  loggerInfo("Before all hook started");
  browserInstance = await initializeBrowser();
  loggerInfo(`browserInstance: ${browserInstance}`);
  // pre authen ui if needed
  await mutex.runExclusive(async () => {
    // Use a file-based lock to prevent multiple threads from logging in at the same time
    if (!fs.existsSync(lockFilePath)) {
      loggerInfo("Initializing browser and performing login...");

      // Mark login as in-progress by creating a lock file
      fs.writeFileSync(lockFilePath, "in progress");

      if (!fs.existsSync("authentication/ui-authen.json")) {
        loggerInfo(`No authentication state found, performing login...`);
        const tempContext = await browserInstance.newContext();
        await login("valid", tempContext);
        loggerInfo(`Temporary context closed after login`);
        await tempContext.close();
      }

      // Mark login as completed
      fs.writeFileSync(lockFilePath, "done");
    } else {
      loggerInfo(
        "Login already completed by another thread, waiting for authentication state.",
      );

      // Wait until the lock file indicates that the login has been completed
      while (fs.readFileSync(lockFilePath, "utf-8") === "in progress") {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100ms and retry
      }
    }
  });
});

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  this.testName = pickle.name.replace(/\W/g, "-");
  this.feature = pickle;
  loggerInfo(`Test started: ${this.testName}`);

  const tags = pickle.tags.map((tag) => tag.name);

  if (tags.some((tag) => tag.startsWith("@api") || tag.startsWith("@mix"))) {
    await initializeAPIManager(this);
    loggerInfo(`API contexts in after ${this.apiManager}}`);
  }

  if (tags.some((tag) => tag.startsWith("@ui") || tag.startsWith("@mix"))) {
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
  // await finalizeProvider(); // Finalize and verify after all tests
});
