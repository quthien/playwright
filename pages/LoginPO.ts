import { Page, Locator } from "@playwright/test";
import { CommonPO } from "../pages/CommonPO";
import { LocatorHelper } from "../utils/LocatorHelper";

export class LoginPO {
  private readonly page: Page;
  private commonPO: CommonPO;
  private locatorHelperObject: LocatorHelper;
  private signUpForm: string;
  private loginForm: string;

  constructor(page: Page) {
    this.page = page;
    this.commonPO = new CommonPO(page);
    this.locatorHelperObject = new LocatorHelper(page);
    this.signUpForm = ".signup-form";
    this.loginForm = ".login-form";
  }

  async navigateToLogin(): Promise<void> {
    return this.commonPO.navigationMenu.getByText("Signup / Login").click();
  }

  async setInputValueOnLoginPage(
    selector: string,
    value: string,
  ): Promise<void> {
    await this.page.locator(selector).fill(value);
  }

  async clickSignUpButton(): Promise<void> {
    await this.commonPO.click("Button", "Signup");
  }

  async isSignUpFormVisible(timeout: number = 5000): Promise<void> {
    await this.locatorHelperObject.waitForTextContain(
      this.signUpForm + " h2",
      "New User Signup!",
      timeout,
    );
  }
}
