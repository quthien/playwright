import { Page, Locator } from "@playwright/test";
import { CommonPageObject } from "./CommonPageObject";
import { locatorHelper } from "../utils/LocatorHelper";
import { CommonLocator } from "../locator/CommonLocator";

export class CommonPO implements CommonPageObject {
  private readonly page: Page;
  private readonly commonLocator: CommonLocator;
  public navigationMenu: Locator;
  public gridView: Locator;
  public category: Locator;
  public locatorHelper: locatorHelper;

  constructor(page: Page) {
    this.page = page;
    this.locatorHelper = new locatorHelper(page);
    this.commonLocator = new CommonLocator();
    this.navigationMenu = page.locator(this.commonLocator.navigationMenu);
    this.gridView = page.locator(this.commonLocator.gridView);
    this.category = page.locator(this.commonLocator.category);
  }

  async getCategoryProductType(): Promise<string[]> {
    const total = await this.category.count();
    const categoryList: string[] = [];
    for (let i = 0; i < total; i++) {
      let categoryItem = (await this.category
        .nth(i)
        .locator("[data-toggle='collapse']")
        .getAttribute("href")) as string;
      categoryList.push(categoryItem);
    }
    console.log(categoryList);
    return categoryList;
  }

  async openCategory(category: string): Promise<void> {
    await this.page.locator(`[href="${category}"]`).click();
  }

  async getFeatureProductsByCategory(): Promise<string[]> {
    await this.locatorHelper.waitForElement(
      this.commonLocator.visibleCategoryProduct,
    ); // Wait for the feature product links to appear

    const productCategory = await this.page.$$(
      this.commonLocator.visibleCategoryProduct,
    ); // Get all the feature product links

    const productList: string[] = [];
    for (const product of productCategory) {
      const productItem = await product.textContent(); // Get the text content of the link
      productList.push(productItem.trim()); // Add the text content to the productList array
    }
    return productList;
  }

  async clickOnProduct(product: string): Promise<void> {
    await this.page.locator(`//div[@class='panel-collapse in']//a[contains(text(), '${product}')]`).click();
  }
}
