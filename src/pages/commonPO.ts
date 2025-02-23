import { Page, Locator } from "@playwright/test";
import { CommonPageObject } from "../interface/commonPageObject";
import { LocatorHelper } from "../utils/locatorHelper";
import { CommonLocator } from "../locator/commonLocator";
import { loggerInfo } from "../utils/logger";

export class CommonPO implements CommonPageObject {
  private readonly page: Page;
  private readonly commonLocator: CommonLocator;
  public locatorHelper: LocatorHelper;

  constructor(page: Page) {
    this.page = page;
    this.locatorHelper = new LocatorHelper(page);
    this.commonLocator = new CommonLocator();
  }

  async navigateToPage(tabName: string): Promise<void> {
    const navigationMenuLocator = this.page.locator(`//a[text()="${tabName}"]`);
    await navigationMenuLocator.waitFor({ state: "visible" }); // Ensure the element is visible
    await navigationMenuLocator.click();
  }

  async openUserMenu(): Promise<void> {
    const userMenuLocator = this.page.locator(
      this.commonLocator.userMenuLocator,
    );
    await userMenuLocator.waitFor({ state: "visible" }); // Ensure the element is visible
    await userMenuLocator.click();
  }

  async navigateToAccountTab(tabName: string): Promise<void> {
    const myAccountLocator = this.page.locator(
      this.commonLocator.accountTabLocator + ` a`,
    );
    const count = await myAccountLocator.count();
    for (let i = 0; i < count; i++) {
      loggerInfo(`Clicking on ${i} tab`);
      const text = await myAccountLocator.nth(i).textContent();
      if (text?.trim() === tabName) {
        loggerInfo(`Clicking on ${i} tab`);
        await myAccountLocator.nth(i).waitFor({ state: "visible" });
        await myAccountLocator.nth(i).click();
        break;
      }
    }
  }
  async getNotificationMessage(): Promise<string> {
    const notificationLocator = this.page.locator(
      this.commonLocator.notificationLocator,
    );
    await notificationLocator.waitFor({ state: "visible" });
    return notificationLocator.innerText();
  }
}
