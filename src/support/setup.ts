import { BeforeAll, AfterAll, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser, Page } from "playwright";

import config from "../../playwright.config";

let browser: Browser;
let page: Page;
setDefaultTimeout(60 * 1000); // can not be set into step BeforeAll
BeforeAll(async () => {
  browser = await chromium.launch(config.use);
  page = await browser.newPage();
});

AfterAll(async () => {
  await browser.close();
});

export { browser, page };
