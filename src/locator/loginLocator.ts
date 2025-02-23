export class LoginLocator {
  public loginFormLocator: String = '[action="/users/sign_in"]';
  public loginEmailInputLocator: string = '[id="user[email]"]';
  public loginEmailErrorLocator: string = '[id="user[email]-error"]';
  public loginPasswordInputLocator: string = '[id="user[password]"]';
  public loginPasswordErrorLocator: string = '[id="user[password]-error"]';
  public loginErrorListLocator: string = `${this.loginFormLocator} ul`;
  public navigateToCreateAccountPageLocator: string = ".sign-in__sign-up";
}
