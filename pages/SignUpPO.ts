import { Page, Locator } from "@playwright/test";
import { CommonPO } from "./commonPO";
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
    // await this.page.locator(`[id='uniform-days']`).click();
    await this.page.locator(`[id='days']`).selectOption(date);
    // await this.page.waitForTimeout(10000)
  }

  async pickMonthOfBirth(month: string): Promise<void> {
    // await this.page.locator(`[id='uniform-months']`).click();
    await this.page.locator(`[id='months']`).selectOption(month);
  }

  async pickYearOfBirth(year: string): Promise<void> {
    // await this.page.locator(`[id='uniform-years']`).click();
    await this.page.locator(`[id='years']`).selectOption(year);
  }

  async clickCheckBoxNewLetter(): Promise<void> {
    await this.commonPO.clickCheckBox(this.checkBoxNewLetter);
  }

  async clickCheckBoxSpecialoffer(): Promise<void> {
    await this.commonPO.clickCheckBox(this.checkBoxSpecialOffer);
  }

  async pickCountry(country: string): Promise<void> {
    // await this.page.locator(`[id='country']`).click();
    await this.page.locator(`[id='country']`).selectOption(country);
  }
}
