import { Page, Locator } from "@playwright/test";
import { CommonPageObject } from "./CommonPageObject";

export class CommonPO implements CommonPageObject {
  private readonly page: Page;
  public navigationMenu: Locator;
  public gridView: Locator;
  public category: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigationMenu = page.locator(".nav.navbar-nav");
    this.gridView = page.locator(".features_items");
    this.category = page
      .locator("[id='accordian']")
      .locator(`.panel.panel-default`);
  }

  async getCategoryProductType(): Promise<string[]> {
    const total = await this.category.count();
    const categoryList: string[] = [];
    for (let i = 0; i < total; i++) {
      let categoryItem = (await this.category
        .nth(i)
        .getAttribute("data-toggle")) as string;
      console.log(categoryItem);
      categoryList.push(categoryItem);
    }
    return categoryList;
  }

  async openCategory(category: string): Promise<void> {
    await this.page.getByRole("link", { name: `#${category}` }).click();
  }

  async getFeatureProductsByCategory(): Promise<string[]> {
    return this.category.locator(".panel-body > ul").allInnerTexts();
  }
}
