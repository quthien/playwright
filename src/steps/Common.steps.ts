import { ICustomWorld } from "../support/custom-world";
import { Given, When, Then } from "@cucumber/cucumber";
import { playwrightConfig } from "../../playwright.config";
import { expect } from "@playwright/test";

import { Helper } from "../utils/helper";
import { pageFixture } from "../support/pageFixture";
import { CommonPO } from "../pages/commonPO";

Given("I go to website", async function (this: ICustomWorld) {
  try {
    await pageFixture.page.goto(playwrightConfig.baseURL, { timeout: 120000 });
  } catch (error) {
    console.error("Error navigating to website:", error);
    throw error;
  }
});

Then(
  "I navigate to page {string}",
  async function (this: ICustomWorld, pageName: string) {
    const commonPO = new CommonPO(pageFixture.page);
    await commonPO.navigateToPage(pageName);
  },
);

Then(
  "I should see notification message {string}",
  async function (this: ICustomWorld, expectedMessage: string) {
    const commonPO = new CommonPO(pageFixture.page);
    const mess = await commonPO.getNotificationMessage();
    expect(mess).toEqual(expectedMessage);
  },
);

Then("I sign out", async function (this: ICustomWorld) {
  const commonPO = new CommonPO(pageFixture.page);
  await commonPO.openUserMenu();
  await commonPO.navigateToAccountTab("Sign Out");
});
