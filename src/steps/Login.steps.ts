import { ICustomWorld } from "../support/custom-world";
import { Given, When, Then } from "@cucumber/cucumber";
import { playwrightConfig } from "../../playwright.config";
import { expect } from "@playwright/test";

import { Helper } from "../utils/Helper";
import { JsonReader } from "../utils/JsonReader";
import { pageFixture } from "../support/pageFixture";
import { LoginPO } from "../pages/LoginPO";
import { LoginLocator } from "../locator/LoginLocator";
import { UserInforData } from "../DTO/UserInforData";
import { Logger } from "../utils/Logger";
import { CommonPO } from "../pages/CommonPO";

const path = require("path");

const jsonData = new JsonReader();

Then(
  "I login with {string} user",
  async function (this: ICustomWorld, userType: string) {
    var testData = {};
    if (userType === "valid") {
      testData = await jsonData.readJsonFile(
        path.resolve(__dirname, "../data/ValidUserData.json"),
      );
    } else if (userType === "invalid") {
      testData = await jsonData.readJsonFile(
        path.resolve(__dirname, "../data/InvalidUserData.json"),
      );
    }
    const user = new UserInforData();
    Object.assign(user, testData);

    const loginPO = new LoginPO(pageFixture.page);
    await loginPO.enterEmail(user.Email);
    await loginPO.enterPassword(user.Password);

    await loginPO.clickSignInButton();
  },
);

Then(
  "I should see error message {string}",
  async function (this: ICustomWorld, errorMessage: string) {
    const loginPO = new LoginPO(pageFixture.page);
    const loginErrorList = await loginPO.getLoginErrorList();
    this.logger.info(`Login error list: ${loginErrorList}`);
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
