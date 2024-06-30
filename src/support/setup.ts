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
  ConsoleMessage,
  request,
  Browser,
} from "@playwright/test";
import { playwrightConfig } from "../../playwright.config";
import { ICustomWorld } from "../support/custom-world";

let browser: Browser;

declare global {
  // eslint-disable-next-line no-var
  var browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
}

setDefaultTimeout(60 * 1000); // can not be set into step BeforeAll
BeforeAll(async () => {
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
});

AfterAll(async () => {
  await browser.close();
});

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, "-");
  await this.context.tracing.start({ screenshots: true, snapshots: true });
  this.page = await this.context.newPage();
  this.page.on("console", async (msg: ConsoleMessage) => {
    if (msg.type() === "log") {
      await this.attach(msg.text());
    }
  });
  this.feature = pickle;
});
