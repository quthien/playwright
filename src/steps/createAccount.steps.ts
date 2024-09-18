import { ICustomWorld } from "../support/custom-world";
import { Given, When, Then } from "@cucumber/cucumber";
import { playwrightConfig } from "../../playwright.config";
import { expect } from "@playwright/test";

import { readJsonFile } from "../utils/JsonHelper";
import { pageFixture } from "../support/pageFixture";
import { LoginPO } from "../pages/loginPO";
import { SignupPO } from "../pages/signUpPO";
import { UserInforData } from "../DTO/UserInforData";
import { CommonLocator } from "../locator/commonLocator";

const path = require("path");

Given("I navigate to create account page", async function (this: ICustomWorld) {
  const loginPO = new LoginPO(pageFixture.page);
  await loginPO.navigateToCreateAccountPage();
});

Then("I sign up with invalid user", async function (this: ICustomWorld) {
  const testData = await readJsonFile(
    path.resolve(__dirname, "../data/InvalidUserData.json"),
  );
  const user = new UserInforData();
  Object.assign(user, testData);

  const signupPO = new SignupPO(pageFixture.page);

  await signupPO.enterEmail(user.Email);
  await signupPO.enterPassword(user.Password);
  await signupPO.enterFirstName(user.FirstName);
  await signupPO.enterLastName(user.LastName);
  await signupPO.acceptTermsAndConditions();
  await signupPO.clickSignUpButton();
});

Then(
  "I verify user sign up successfully with user name {string}",
  async function (this: ICustomWorld, user: string) {
    const commonLocator = new CommonLocator();
    const userMenu = pageFixture.page.locator(commonLocator.userMenuLocator);
    await userMenu.waitFor({ state: "visible" });
    const userName = await userMenu.textContent();
    expect(userName).toEqual(user);
  },
);
