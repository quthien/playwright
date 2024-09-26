export class ProfileLocator {
  public profileFormLocator: String = '[id=user[first_name]-error"]';
  public profileFirstNameErrorLocator: string = '[id="user[first_name]-error"]';
  public profileLastNameInputLocator: string = '[id="user[last_name]"]';
  public profileFirstNameInputLocator: string = '[id="user[first_name]"]';
  public profileLastNameErrorLocator: string = '[id=user[last_name]-error"]';
  public profileEmailInputLocator: string = '[id="user[email]"]';
  public profileEmailErrorLocator: string = '[id=user[email]-error"]';
  public profileCompanyInputLocator: string =
    '[id="user[profile_attributes][company]"]';
  public profileCompanyTitleInputLocator: string =
    '[id="user[profile_attributes][headline]"]';
  public profileTimezoneInputLocator: string =
    '[id="user[profile_attributes][timezone]"]';
  public profileSaveButtonLocator: string = '[value="Save Changes"]';
}
