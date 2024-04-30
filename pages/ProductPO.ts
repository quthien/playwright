import { Page, Locator } from "@playwright/test";
import { CommonPO } from "../pages/CommonPO";
export class productPO {
  private readonly page: Page;
  private productFilter: Locator;
  private productSearchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productFilter = page.locator('[id="search_product"]');
    this.productSearchButton = page.locator('[id="submit_search"]');
    // this.productSearchButton = page.getByTestId('[id="submit_search"]');
  }

  async navigateToPage() {
    const pageObject = new CommonPO(this.page);
    return pageObject.navigationMenu.getByText("Products").click();
  }

  async inputProduct(product: string) {
    return this.productFilter.fill(product);
  }

  async clickSearchProduct() {
    return this.productSearchButton.click();
  }
}
