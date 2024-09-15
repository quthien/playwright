import { ICustomWorld } from "../support/custom-world";
import { Given, When, Then } from "@cucumber/cucumber";
import { playwrightConfig } from "../../playwright.config";
import { expect } from "@playwright/test";

import { HomePO } from "../pages/HomePO";
import { Helper } from "../utils/helper";
import { JsonReader } from "../utils/JsonReader";
import { pageFixture } from "../support/pageFixture";

const listOfProductTypeStored = "listOfProductTypeStored";
const randomCategoryStored = "randomCategoryStored";
const randomProductsByCategoryStored = "randomProductsByCategoryStored";

Given("I go to website", async function (this: ICustomWorld) {
  try {
    await pageFixture.page.goto(playwrightConfig.baseURL, { timeout: 120000 });
  } catch (error) {
    console.error("Error navigating to website:", error);
    throw error;
  }
});

When("I get list of product type", async function (this: ICustomWorld) {
  const homePage = new HomePO(pageFixture.page);

  const listOfCategoryType = await homePage.getCategoryProductType();

  const randomCategory =
    await this.helper.randomItemInArray(listOfCategoryType);
  this.sharedData[randomCategoryStored] = randomCategory;
  await homePage.openCategory(randomCategory);

  const ListOfFeartureProductsByCategory =
    await homePage.getFeatureProductsByCategory();

  const randomProductsByCategory = await this.helper.randomItemInArray(
    ListOfFeartureProductsByCategory,
  );
  this.sharedData[randomProductsByCategoryStored] = randomProductsByCategory;

  await homePage.clickOnProduct(randomProductsByCategory);

  const listOfProductType = await homePage.getListFeatureProductsName(
    randomProductsByCategory,
  );
  console.log(listOfProductType);

  this.sharedData[listOfProductTypeStored] = listOfProductType;
});

Then("I verify list of product type", async function (this: ICustomWorld) {
  const jsonData = new JsonReader();
  const path = require("path");
  const testData = await jsonData.readJsonFile(
    path.resolve(__dirname, "../data/Products.json"),
  );

  const listOfProductType = this.sharedData[listOfProductTypeStored];
  const randomCategory = this.sharedData[randomCategoryStored];
  const randomProductsByCategory =
    this.sharedData[randomProductsByCategoryStored];

  // console.log(testData[randomCategory + "_" + randomProductsByCategory.replace(" ", "_")]);
  await expect(listOfProductType).toEqual(
    testData[randomCategory + "_" + randomProductsByCategory.replace(" ", "_")],
  );
});
