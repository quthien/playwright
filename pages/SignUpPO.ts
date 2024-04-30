import { Page, Locator } from "@playwright/test";
import { CommonPO } from "../pages/CommonPO";
import { RoleType } from "../enum/RoleType";
export class SignUpPO {
  private readonly page: Page;
  private commonPO: CommonPO;
  private checkBoxNewLetter: string;
  private checkBoxSpecialOffer: string;

  constructor(page: Page) {
    this.page = page;
    this.commonPO = new CommonPO(page);
    this.checkBoxNewLetter = "[id='newsletter']";
    this.checkBoxSpecialOffer = "[id='optin']";
  }

  async chooseGender(gender: string): Promise<void> {
    await this.page.locator(`[value='${gender}']`).click();
  }

  async setInputValueOnSignUpPage(
    fieldName: string,
    value: string,
  ): Promise<void> {
    await this.page.locator(`[id='${fieldName}']`).fill(value);
  }

  async pickDateOfBirth(date: string): Promise<void> {
    await this.page.locator(`[id='days']`).selectOption(date);
  }

  async pickMonthOfBirth(month: string): Promise<void> {
    await this.page.locator(`[id='months']`).selectOption(month);
  }

  async pickYearOfBirth(year: string): Promise<void> {
    await this.page.locator(`[id='years']`).selectOption(year);
  }

  async clickCheckBoxNewLetter(): Promise<void> {
    await this.commonPO.click(RoleType.CHECKBOX, this.checkBoxNewLetter);
  }

  async clickCheckBoxSpecialoffer(): Promise<void> {
    await this.commonPO.click(RoleType.CHECKBOX, this.checkBoxSpecialOffer);
  }

  async pickCountry(country: string): Promise<void> {
    await this.page.locator(`[id='country']`).selectOption(country);
  }

  async clickSignUpButton(): Promise<void> {
    await this.commonPO.click(RoleType.BUTTON, "Create Account");
  }

  async clickContinueButton(): Promise<void> {
    await this.page.locator(`[data-qa='continue-button']`).click();
  }
}
