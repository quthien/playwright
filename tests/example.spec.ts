import { test, expect } from "@playwright/test";
import { productPO } from "../pages/ProductPO";
import { HomePO } from "../pages/HomePO";
import { Helper } from "../utils/helper";

test("has title", async ({ page }) => {
  const productPage = new productPO(page);
  const homePage = new HomePO(page);
  const helper = new Helper();
  await page.goto("https://automationexercise.com/");

  const listOfProductType = await homePage.getListFeatureProductsName();

  const listOfCategoryType = await homePage.getCategoryProductType();

  const randomCategory = await helper.randomItemInArray(listOfCategoryType);

  console.log(randomCategory);
  await homePage.openCategory(randomCategory);

  const ListOfFeartureProductsByCategory =
    await homePage.getFeatureProductsByCategory();

  console.log(ListOfFeartureProductsByCategory);

  await page.waitForTimeout(5000);
});
