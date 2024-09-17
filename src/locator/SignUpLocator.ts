export class SignupLocator {
  public signUpFormLocator: String = ".sign-up__wrapper";
  public signUpFirstNameErrorLocator: string = '[id="user[first_name]-error"]';
  public signUpLastNameInputLocator: string = '[id="user[last_name]"]';
  public signUpFirstNameInputLocator: string = '[id="user[first_name]"]';
  public signupLastNameErrorLocator: string = '[id=user[last_name]-error"]';
  public signUpEmailInputLocator: string = '[id="user[email]"]';
  public signUpEmailErrorLocator: string = '[id=user[email]-error"]';
  public signUpPasswordInputLocator: string = '[id="user[password]"]';
  public signUpErrorListLocator: string = `${this.signUpFormLocator} ul`;
  public signUpTurnCheckBoxLocator: string = '[id="user[terms]"]';
}
