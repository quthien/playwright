import { test, expect } from "@playwright/test";
import { productPO } from "../pages/ProductPO";
import { HomePO } from "../pages/HomePO";
import { Helper } from "../utils/helper";

test("Verify features items display base on category", async ({ page }) => {
  const productPage = new productPO(page);
  const homePage = new HomePO(page);
  const helper = new Helper();
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

  const listOfProductType = await homePage.getListFeatureProductsName();
  console.log(listOfProductType);
  await page.waitForTimeout(50000);
});
