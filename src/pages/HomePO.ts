import { Page, Locator } from "@playwright/test";
import { LocatorHelper } from "../utils/LocatorHelper";
import { CommonPageObject } from "./CommonPageObject";
import { CommonLocator } from "../locator/CommonLocator";
import { CommonPO } from "./CommonPO";
import { RoleType } from "../enum/RoleType";

export class HomePO {
  private readonly page: Page;
  private locatorHelperObject: LocatorHelper;
  private commonPO: CommonPageObject;
  private commonLocator: CommonLocator;
  public productName: Locator;
  public gridView: string;

  constructor(page: Page) {
    this.page = page;
    this.commonPO = new CommonPO(page);
    this.commonLocator = new CommonLocator();
    this.locatorHelperObject = new LocatorHelper(page);
    this.gridView = this.commonLocator.gridView;
    this.productName = this.page
      .locator(this.gridView)
      .locator(this.commonLocator.productName);
  }

  async getListFeatureProducts() {
    return this.page
      .locator(this.commonLocator.gridView)
      .locator(".product-image-wrapper");
  }

  async getListFeatureProductsName(title: string): Promise<string[]> {
    const gridViewTitleLocator =
      this.commonLocator.gridView + " > .title.text-center";
    await this.locatorHelperObject.waitForTextContain(
      gridViewTitleLocator,
      title,
    );
    return this.productName.allInnerTexts();
  }

  async getCategoryProductType() {
    return this.commonPO.getCategoryProductType();
  }

  async openCategory(category: string) {
    this.locatorHelperObject.scrollDownIfElementNotFound(
      this.page.locator(this.gridView),
    );
    return this.commonPO.openCategory(category);
  }

  async getFeatureProductsByCategory() {
    return this.commonPO.getFeatureProductsByCategory();
  }

  async clickOnProduct(product: string) {
    return this.commonPO.clickOnProduct(product);
  }

  async deleteUser(): Promise<void> {
    return this.commonPO.navigationMenu.getByText("Delete Account").click();
  }
}
