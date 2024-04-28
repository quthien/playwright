import { test, expect } from "@playwright/test";
import { productPO } from "../pages/ProductPO";
import { HomePO } from "../pages/HomePO";
import { Helper } from "../utils/Helper";
import { JsonReader } from '../utils/JsonReader';


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

  const listOfProductType = await homePage.getListFeatureProductsName(randomProductsByCategory);
  console.log(listOfProductType);

  const testData = await jsonData.readJsonFile("/Users/lap14961-local/playwright/data/products.json");
  // console.log(testData[randomCategory + "_" + randomProductsByCategory.replace(" ", "_")]);
  await expect(listOfProductType).toEqual(testData[randomCategory + "_" + randomProductsByCategory.replace(" ", "_")]);
});


test("Register User", async ({ page }) => {
  const productPage = new productPO(page);
  const homePage = new HomePO(page);
  const helper = new Helper();
  const jsonData = new JsonReader();
  await page.goto("https://automationexercise.com/");

});



