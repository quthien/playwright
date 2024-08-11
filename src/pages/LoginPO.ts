import { Page, Locator } from "@playwright/test";
import { CommonPO } from "./CommonPO";
import { LocatorHelper } from "../utils/LocatorHelper";
import { LoginLocator } from "../locator/LoginLocator";

export class LoginPO {
  private readonly page: Page;
  private commonPO: CommonPO;
  private loginLocator: LoginLocator;
  private locatorHelper: LocatorHelper;

  constructor(page: Page) {
    this.page = page;
    this.commonPO = new CommonPO(page);
    this.loginLocator = new LoginLocator();
    this.locatorHelper = new LocatorHelper(page);
  }

  async enterEmail(email: string): Promise<void> {
    const emailLocator = this.page.locator(
      this.loginLocator.loginEmailInputLocator,
    );
    await emailLocator.fill(email);
  }

  async enterPassword(password: string): Promise<void> {
    const passwordLocator = this.page.locator(
      this.loginLocator.loginPasswordInputLocator,
    );
    await passwordLocator.fill(password);
  }

  async clickSignInButton(): Promise<void> {
    await this.locatorHelper.click("Button", "Sign in");
  }

  async getLoginErrorList(): Promise<string> {
    const loginErrorListLocator = await this.page.locator(
      this.loginLocator.loginErrorListLocator,
    );
    await loginErrorListLocator.waitFor({ state: "visible" });

    const loginErrorList = await loginErrorListLocator.innerText();
    return loginErrorList;
  }

  async navigateToCreateAccountPage(): Promise<void> {
    const navigateToCreateAccountPageLocator = await this.page.locator(
      this.loginLocator.navigateToCreateAccountPageLocator,
    );
    await navigateToCreateAccountPageLocator.click();
  }
}
