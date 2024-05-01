import { test, expect } from "@playwright/test";
import path from 'path';
import { productPO } from "../pages/ProductPO";
import { HomePO } from "../pages/HomePO";
import { Helper } from "../utils/Helper";
import { JsonReader } from "../utils/JsonReader";
import { LoginPO } from "../pages/LoginPO";
import { LoginLocator } from "../locator/LoginLocator";
import { UserInforData } from "../DTO/UserInforData";
import { SignUpPO } from "../pages/SignUpPO";


test("Register User", async ({ page }) => {
  const loginPage = new LoginPO(page);
  const signUpPage = new SignUpPO(page);
  const loginLocator = new LoginLocator();
  const homePage = new HomePO(page);
  const jsonData = new JsonReader();
  await page.goto("https://automationexercise.com/");

  const testData = await jsonData.readJsonFile(
    path.resolve(__dirname, '../data/SignUpInfor.json'),
  );

  const userDTO = new UserInforData();
  Object.assign(userDTO, testData);

  await loginPage.navigateToLogin();

  await loginPage.isSignUpFormVisible();

  await loginPage.setInputValueOnLoginPage(
    loginLocator.signUpNameInput,
    userDTO.Name,
  );
  await loginPage.setInputValueOnLoginPage(
    loginLocator.signUpEmailInput,
    userDTO.Email,
  );

  await loginPage.clickSignUpButton();

  await signUpPage.chooseGender(userDTO.Title);
  await signUpPage.setInputValueOnSignUpPage("password", userDTO.FirstName);
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

  await homePage.deleteUser();
});
