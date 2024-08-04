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
import { pageFixture } from "../support/pageFixture";
import { DotenvConfigOptions } from "@dotenvx/dotenvx";

let browser: Browser;

require("@dotenvx/dotenvx").config({ path: "/custom/path/to/.env" });
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
  // this.startTime = new Date();
  this.context = await browser.newContext({ ignoreHTTPSErrors: true });
  this.testName = pickle.name.replace(/\W/g, "-");
  this.page = await this.context.newPage();
  pageFixture.page = this.page;
  this.server = await request.newContext({
    baseURL: playwrightConfig.baseURL_API,
  });
  // this.page.on("console", async (msg: ConsoleMessage) => {
  //   if (msg.type() === "log") {
  //     await this.attach(msg.text());
  //   }
  // });
  this.feature = pickle;
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  if (result) {
    // await this.attach(`Status: ${result?.status}. Duration:${result.duration?.seconds}s`);
    if (result.status === Status.FAILED) {
      const image = await this.page?.screenshot();
      const path = `./screenshots/${this.testName}.png`;

      image && (await this.attach(path, "image/png"));
    }
  }

  await pageFixture.page.close();
  await this.context.close();
});
