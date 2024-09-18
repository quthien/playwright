import { ICustomWorld } from "../support/custom-world";
import { Given, When, Then } from "@cucumber/cucumber";
import { playwrightConfig } from "../../playwright.config";
import { expect, Page, BrowserContext } from "@playwright/test";

import { readJsonFile } from "../utils/JsonHelper";
import { pageFixture } from "../support/pageFixture";
import { LoginPO } from "../pages/loginPO";
import { LoginLocator } from "../locator/loginLocator";
import { UserInforData } from "../DTO/userInforData";
import { loggerInfo } from "../utils/logger";
import { CommonPO } from "../pages/commonPO";

const path = require("path");

export async function login(userType: string, context?: BrowserContext) {
  const page: Page = await context.newPage();

  var testData = {};
  if (userType === "valid") {
    testData = await readJsonFile(
      path.resolve(__dirname, "../data/validUserData.json"),
    );
  } else if (userType === "invalid") {
    testData = await readJsonFile(
      path.resolve(__dirname, "../data/invalidUserData.json"),
    );
  }
  const user = new UserInforData();
  Object.assign(user, testData);

  try {
    await page.goto(`https://courses.ultimateqa.com/users/sign_in`, {
      timeout: 120000,
    });
  } catch (error) {
    console.error("Error navigating to website:", error);
    throw error;
  }

  const loginPO = new LoginPO(page);
  await loginPO.enterEmail(user.Email);
  await loginPO.enterPassword(user.Password);

  await loginPO.clickSignInButton();

  const cookies = await context.cookies();
  return cookies;
}

Then("I login with {string} user", async function (userType: string) {
  await login(userType);
});

Then(
  "I should see error message {string}",
  async function (this: ICustomWorld, errorMessage: string) {
    const loginPO = new LoginPO(pageFixture.page);
    const loginErrorList = await loginPO.getLoginErrorList();
    loggerInfo(`Login error list: ${loginErrorList}`);
    expect(loginErrorList).toEqual(errorMessage);
  },
);

Then(
  "I navigate to account management page",
  async function (this: ICustomWorld) {
    const commonPO = new CommonPO(pageFixture.page);
    await commonPO.openUserMenu();
    await commonPO.navigateToAccountTab("My Account");
  },
);
