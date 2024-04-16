import { Page, Locator } from "@playwright/test";
import { locatorHelper } from "../utils/locatorhelper";
import { CommonPageObject } from "./CommonPageObject";
import { CommonPO } from "./CommonPO";

export class HomePO {
  private readonly page: Page;
  public gridView: Locator;
  public productName: Locator;
  private locatorHelperObject: locatorHelper;
  private commonPO: CommonPageObject;

  constructor(page: Page) {
    this.page = page;
    this.gridView = page.locator(".features_items");
    this.productName = this.gridView.locator(
      ".col-sm-4 .productinfo.text-center p",
    );
    this.locatorHelperObject = new locatorHelper(page);
    this.commonPO = new CommonPO(page);
  }

  async getListFeatureProducts() {
    this.locatorHelperObject.waitForElement;
    return this.gridView.locator(".product-image-wrapper");
  }

  async getListFeatureProductsName() {
    this.locatorHelperObject.scrollDownIfElementNotFound(this.gridView);
    return this.productName.allInnerTexts();
  }

  async getCategoryProductType() {
    return this.commonPO.getCategoryProductType();
  }

  async openCategory(category: string) {
    this.locatorHelperObject.scrollDownIfElementNotFound(this.gridView);
    return this.commonPO.openCategory(category);
  }

  async getFeatureProductsByCategory() {
    return this.commonPO.getFeatureProductsByCategory();
  }

  async clickOnProduct(product: string) {
    return this.commonPO.clickOnProduct(product);
  }
}
