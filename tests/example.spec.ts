import { test, expect } from "@playwright/test";
import { productPO } from "../pages/ProductPO";
import { HomePO } from "../pages/HomePO";
import { Helper } from "../utils/Helper";
import { JsonReader } from "../utils/JsonReader";
import { LoginPO } from "../pages/LoginPO";
import { LoginLocator } from "../locator/LoginLocator";
import { UserInforData } from "../DTO/UserInforData";
import { SignUpPO } from "../pages/SignUpPO";

test("Verify features items display base on category", async ({ page }) => {
  const productPage = new productPO(page);
  const homePage = new HomePO(page);
  const helper = new Helper();
  const jsonData = new JsonReader();
  await page.goto("https://automationexercise.com/");

  const listOfCategoryType = await homePage.getCategoryProductType();

  const randomCategory = await helper.randomItemInArray(listOfCategoryType);

  await homePage.openCategory(randomCategory);

  const ListOfFeartureProductsByCategory =
    await homePage.getFeatureProductsByCategory();

  const randomProductsByCategory = await helper.randomItemInArray(
    ListOfFeartureProductsByCategory,
  );
  console.log(randomProductsByCategory);
  await homePage.clickOnProduct(randomProductsByCategory);

  const listOfProductType = await homePage.getListFeatureProductsName(
    randomProductsByCategory,
  );
  console.log(listOfProductType);

  const testData = await jsonData.readJsonFile(
    "../playwright/data/Products.json",
  );
  // console.log(testData[randomCategory + "_" + randomProductsByCategory.replace(" ", "_")]);
  await expect(listOfProductType).toEqual(
    testData[randomCategory + "_" + randomProductsByCategory.replace(" ", "_")],
  );
});

test("Register User", async ({ page }) => {
  const loginPage = new LoginPO(page);
  const signUpPage = new SignUpPO(page);
  const loginLocator = new LoginLocator();
  const jsonData = new JsonReader();
  await page.goto("https://automationexercise.com/");

  await loginPage.navigateToLogin();

  await loginPage.isSignUpFormVisible();

  await loginPage.setInputValueOnLoginPage(
    loginLocator.signUpNameInput,
    "Test User",
  );
  await loginPage.setInputValueOnLoginPage(
    loginLocator.signUpEmailInput,
    "TestUser@gmail.com",
  );

  await loginPage.clickButton("Signup");

  const testData = await jsonData.readJsonFile(
    "../playwright/data/SignUpInfor.json",
  );

  const userDTO = new UserInforData();
  Object.assign(userDTO, testData);
  console.log(userDTO.DoB.split("/")[1]);

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

  await page.waitForTimeout(10000);
});
