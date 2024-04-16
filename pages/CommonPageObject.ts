import { Page, Locator } from "@playwright/test";

export interface CommonPageObject {
  navigationMenu: Locator;
  gridView: Locator;
  category: Locator;
  getCategoryProductType(): Promise<Array<string>>;
  openCategory(category: string): Promise<void>;
  getFeatureProductsByCategory(): Promise<Array<string>>;
  clickOnProduct(product: string): Promise<void>;
}
