import { Page, Locator } from "@playwright/test";

export class locatorHelper {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async scrollDownIfElementNotFound(locator: Locator) {
    if (!(await locator.isVisible())) {
      locator.scrollIntoViewIfNeeded();
    }
  }
}
