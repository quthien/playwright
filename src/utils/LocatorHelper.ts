import { Page, Locator } from "@playwright/test";

export class LocatorHelper {
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
      // console.log("Element is now visible");
    } catch (error) {
      console.log(
        `Element with selector '${selector}' did not appear within ${timeout}ms`,
      );
    }
  }

  async waitForTextContain(
    selector: string,
    expected: string,
    timeout: number = 5000,
  ): Promise<void> {
    try {
      const start = Date.now();
      while (Date.now() - start < timeout) {
        const actual = await this.page.locator(selector).textContent();
        if (actual !== null && actual.includes(expected)) {
          return; // If the expected text is found, exit the function
        }
        await this.page.waitForTimeout(100); // Wait for 100 milliseconds before checking again
      }
      console.log(
        `Text '${expected}' did not appear within ${timeout}ms for element with selector '${selector}'`,
      );
    } catch (error) {
      console.log(`Error occurred while waiting for text: ${error}`);
    }
  }
}
