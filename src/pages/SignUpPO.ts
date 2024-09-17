import { Page, Locator } from "@playwright/test";
import { CommonPO } from "../pages/commonPO";
import { LocatorHelper } from "../utils/LocatorHelper";
import { SignupLocator } from "../locator/signUpLocator";

export class SignupPO {
  private readonly page: Page;
  private commonPO: CommonPO;
  private signupLocator: SignupLocator;
  private locatorHelper: LocatorHelper;

  constructor(page: Page) {
    this.page = page;
    this.commonPO = new CommonPO(page);
    this.signupLocator = new SignupLocator();
    this.locatorHelper = new LocatorHelper(page);
  }

  async enterEmail(email: string): Promise<void> {
    const emailLocator = this.page.locator(
      this.signupLocator.signUpEmailInputLocator,
    );
    await emailLocator.fill(email);
  }

  async enterPassword(password: string): Promise<void> {
    const passwordLocator = this.page.locator(
      this.signupLocator.signUpPasswordInputLocator,
    );
    await passwordLocator.fill(password);
  }

  async enterFirstName(firstName: string): Promise<void> {
    const FirstNameLocator = this.page.locator(
      this.signupLocator.signUpFirstNameInputLocator,
    );
    await FirstNameLocator.fill(firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    const LastNameLocator = this.page.locator(
      this.signupLocator.signUpLastNameInputLocator,
    );
    await LastNameLocator.fill(lastName);
  }

  async clickSignUpButton(): Promise<void> {
    await this.locatorHelper.click("Button", "Sign up");
  }

  async getSignUpErrorList(): Promise<string> {
    const signUpErrorListLocator = await this.page.locator(
      this.signupLocator.signUpErrorListLocator,
    );
    await signUpErrorListLocator.waitFor({ state: "visible" });

    const signUpErrorList = await signUpErrorListLocator.innerText();
    return signUpErrorList;
  }

  async acceptTermsAndConditions(): Promise<void> {
    const termsCheckBoxLocator = await this.page.locator(
      this.signupLocator.signUpTurnCheckBoxLocator,
    );
    await termsCheckBoxLocator.check();
  }
}
