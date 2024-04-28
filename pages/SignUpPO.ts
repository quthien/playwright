import { Page, Locator } from "@playwright/test";
import { CommonPO } from "./commonPO";
export class SignUpPO {
  private readonly page: Page;
  private commonPO: CommonPO;
  private 

  constructor(page: Page) {
    this.page = page;
    this.commonPO = new CommonPO(page);
  }

  async chooseGender(gender: string): Promise<void> {
    await this.page.locator(`[id='${gender}']`).click();
  }

  async setInputValueOnSignUpPage(inputName: string, value: string): Promise<void> {
    await this.page.locator(`[id='${inputName}']`).fill(value);
  }

  async pickDateOfBirth(date: string): Promise<void> {
    await this.page.locator(`[id='uniform-days']`).click();
    await this.page.locator(`[option[value='${date}']`).click();
  }

  async pickMonthOfBirth(month: string): Promise<void> {
    await this.page.locator(`[id='uniform-months']`).click();
    await this.page.locator(`[option[value='${month}']`).click();
  }

  async pickYearOfBirth(year: string): Promise<void> {
    await this.page.locator(`[id='uniform-years']`).click();
    await this.page.locator(`[option[value='${year}']`).click();
  }
}
