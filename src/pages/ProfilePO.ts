import { Page, Locator } from "@playwright/test";
import { CommonPO } from "./CommonPO";
import { LocatorHelper } from "../utils/LocatorHelper";
import { ProfileLocator } from "../locator/ProfileLocator";

export class ProfilePO {
  private readonly page: Page;
  private commonPO: CommonPO;
  private profileLocator: ProfileLocator;
  private locatorHelper: LocatorHelper;

  constructor(page: Page) {
    this.page = page;
    this.commonPO = new CommonPO(page);
    this.profileLocator = new ProfileLocator();
    this.locatorHelper = new LocatorHelper(page);
  }

  async enterEmail(email: string): Promise<void> {
    const emailLocator = this.page.locator(
      this.profileLocator.profileEmailInputLocator,
    );
    await emailLocator.fill(email);
  }

  async enterFirstName(firstName: string): Promise<void> {
    const firstNameLocator = this.page.locator(
      this.profileLocator.profileFirstNameInputLocator,
    );
    await firstNameLocator.fill(firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    const lastNameLocator = this.page.locator(
      this.profileLocator.profileLastNameInputLocator,
    );
    await lastNameLocator.fill(lastName);
  }

  async clickSaveButton(): Promise<void> {
    const saveButtonLocator = this.page.locator(
      this.profileLocator.profileSaveButtonLocator,
    );
    await saveButtonLocator.click();
  }

  async pickTimezone(timezone: string): Promise<void> {
    const timezoneLocator = await this.page.locator(
      this.profileLocator.profileTimezoneInputLocator,
    );
    await timezoneLocator.selectOption({ label: timezone });
  }

  async;
}
