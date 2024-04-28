import { Page, Locator } from "@playwright/test";
import { CommonPO } from "./commonPO";
export class LoginPO {
  private readonly page: Page;
  private commonPO: CommonPO;
  private 

  constructor(page: Page) {
    this.page = page;
    this.commonPO = new CommonPO(page);
  }

  async navigateToLogin():Promise<void> {
    return this.commonPO.navigationMenu.getByText("Signup / Login").click();
  }

  async setInputValueOnLoginPage(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).fill(value);
  }

  async clickButton(buttonName: string):Promise<void> { 
    await this.page.getByRole("button", { name: buttonName }).click();
  }

}
