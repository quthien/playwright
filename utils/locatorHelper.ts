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

  async waitForElement(selector: string, timeout: number = 5000) {
    try {
      await this.page.waitForSelector(selector, { timeout }); // Wait for the element to appear
      console.log("Element is now visible");
    } catch (error) {
      console.log(
        `Element with selector '${selector}' did not appear within ${timeout}ms`,
      );
    }
  }
}
