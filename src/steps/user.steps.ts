import { ICustomWorld } from "../support/custom-world";
import { Given, When, Then } from "@cucumber/cucumber";
import { playwrightConfig } from "../../playwright.config";
import { expect } from "@playwright/test";

import { HomePO } from "../pages/HomePO";
import { Helper } from "../utils/helper";
import { readJsonFile } from "../utils/JsonHelper";
import { pageFixture } from "../support/pageFixture";
import { LoginPO } from "../pages/LoginPO";
import { LoginLocator } from "../locator/LoginLocator";
import { UserInforData } from "../DTO/UserInforData";
import { SignUpPO } from "../pages/SignUpPO";

const path = require("path");

const listOfProductTypeStored = "listOfProductTypeStored";
const randomCategoryStored = "randomCategoryStored";
const randomProductsByCategoryStored = "randomProductsByCategoryStored";

When(
  "I navigate to Signup and Login page",
  async function (this: ICustomWorld) {
    const loginPage = new LoginPO(pageFixture.page);
    await loginPage.navigateToLogin();
  },
);

Then(
  "I verify the Signup form is visible",
  async function (this: ICustomWorld) {
    const loginPage = new LoginPO(pageFixture.page);
    await loginPage.isSignUpFormVisible();
  },
);

Then("I sign up with data", async function (this: ICustomWorld) {
  const loginLocator = new LoginLocator();
  const loginPage = new LoginPO(pageFixture.page);

  const testData = await readJsonFile(
    path.resolve(__dirname, "../data/SignUpInfor.json"),
  );
  const userDTO = new UserInforData();
  Object.assign(userDTO, testData);

  await loginPage.setInputValueOnLoginPage(
    loginLocator.signUpNameInput,
    userDTO.Name,
  );
  await loginPage.setInputValueOnLoginPage(
    loginLocator.signUpEmailInput,
    userDTO.Email,
  );

  await loginPage.clickSignUpButton();
});

Then(
  "I fill in user information and click create",
  async function (this: ICustomWorld) {
    const testData = await readJsonFile(
      path.resolve(__dirname, "../data/SignUpInfor.json"),
    );
    const userDTO = new UserInforData();
    Object.assign(userDTO, testData);

    const signUpPage = new SignUpPO(pageFixture.page);
    await signUpPage.chooseGender(userDTO.Title);
    await signUpPage.setInputValueOnSignUpPage("password", userDTO.Password);
    await signUpPage.pickDateOfBirth(userDTO.DoB.split("/")[0]);
    await signUpPage.pickMonthOfBirth(userDTO.DoB.split("/")[1]);
    await signUpPage.pickYearOfBirth(userDTO.DoB.split("/")[2]);
    await signUpPage.setInputValueOnSignUpPage("first_name", userDTO.FirstName);
    await signUpPage.setInputValueOnSignUpPage("last_name", userDTO.LastName);
    await signUpPage.setInputValueOnSignUpPage("company", userDTO.Company);
    await signUpPage.setInputValueOnSignUpPage("address1", userDTO.Address1);
    await signUpPage.setInputValueOnSignUpPage("address2", userDTO.Address2);
    await signUpPage.pickCountry(userDTO.Country);
    await signUpPage.setInputValueOnSignUpPage("state", userDTO.State);
    await signUpPage.setInputValueOnSignUpPage("city", userDTO.City);
    await signUpPage.setInputValueOnSignUpPage("zipcode", userDTO.Zip);
    await signUpPage.setInputValueOnSignUpPage("mobile_number", userDTO.Phone);

    await signUpPage.clickSignUpButton();
    await signUpPage.clickContinueButton();

    // await homePage.deleteUser();
  },
);
