import { test, expect } from "@playwright/test";
import { productPO } from "../src/pages/ProductPO";
import { HomePO } from "../src/pages/HomePO";
import { Helper } from "../src/utils/Helper";
import { JsonReader } from "../src/utils/JsonReader";
import { LoginPO } from "../src/pages/LoginPO";
import { LoginLocator } from "../src/locator/LoginLocator";
import { UserInforData } from "../src/DTO/UserInforData";
import { SignUpPO } from "../src/pages/SignUpPO";
import path from "path";

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
    path.resolve(__dirname, "../data/Products.json"),
  );
  // console.log(testData[randomCategory + "_" + randomProductsByCategory.replace(" ", "_")]);
  await expect(listOfProductType).toEqual(
    testData[randomCategory + "_" + randomProductsByCategory.replace(" ", "_")],
  );
});
