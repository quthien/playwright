import { ICustomWorld } from "../support/custom-world";
import { Given, When, Then } from "@cucumber/cucumber";
import { playwrightConfig } from "../../playwright.config";
import { expect } from "@playwright/test";

import { readJsonFile } from "../utils/JsonHelper";
import { pageFixture } from "../support/pageFixture";
import { UserInforData } from "../DTO/userInforData";
import { ProfilePO } from "../pages/profilePO";
import { CommonPO } from "../pages/commonPO";
import { ProfileLocator } from "../locator/profileLocator";
import { loggerInfo } from "../utils/logger";

const path = require("path");

const notiMessStored = "notiMessStored";

Then("I edit user data", async function (this: ICustomWorld) {
  const testData = await readJsonFile(
    path.resolve(__dirname, "../data/validUserData.json"),
  );
  const user = new UserInforData();
  Object.assign(user, testData);
  const commonPO = new CommonPO(pageFixture.page);
  const profilePO = new ProfilePO(pageFixture.page);

  await profilePO.enterEmail(user.Email);
  await profilePO.enterFirstName(user.FirstName);
  await profilePO.enterLastName(user.LastName);
  await profilePO.pickTimezone(user.Timezone);
  await profilePO.clickSaveButton();

  const mess = await commonPO.getNotificationMessage();

  this.sharedData[notiMessStored] = mess;
});

Then("I verify user data is updated", async function (this: ICustomWorld) {
  const testData = await readJsonFile(
    path.resolve(__dirname, "../data/ValidUserData.json"),
  );
  const user = new UserInforData();
  Object.assign(user, testData);

  const profileLocator = new ProfileLocator();

  const mess = this.sharedData[notiMessStored];
  expect(mess).toEqual("Your profile was successfully updated.");
  const actualFirstName = await pageFixture.page
    .locator(profileLocator.profileFirstNameInputLocator)
    .getAttribute("value");
  expect(actualFirstName).toEqual(user.FirstName);
  const actualLastName = await pageFixture.page
    .locator(profileLocator.profileLastNameInputLocator)
    .getAttribute("value");
  expect(actualLastName).toEqual(user.LastName);

  const selectedText = await pageFixture.page
    .locator('[selected="selected"]')
    .textContent();
  loggerInfo(`Selected text: ${selectedText}`);
  expect(selectedText?.trim()).toBe("Abu Dhabi");
});
