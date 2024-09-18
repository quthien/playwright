Feature: example
  @ui-login
  Scenario: verify login with valid user
    Given I go to website
    Then I navigate to page "Login automation"
    And I login with "valid" user
    Then I should see notification message "Signed in successfully."
    And I sign out

  @ui-signup
  Scenario: sign up with valid user
    Given I go to website
    Then I navigate to page "Login automation"
    And I navigate to create account page
    And I sign up with invalid user
    And I verify user sign up successfully with user name "test t"

  @ui-login-fail
  Scenario: verify login with invalid user
    Given I go to website
    Then I navigate to page "Login automation"
    And I login with "invalid" user
    And I should see error message "Invalid email or password."

  @ui-login
  Scenario: verify update user data
    Given I go to website
    Then I navigate to page "Login automation"
    And I login with "valid" user
    And I navigate to account management page
    And I edit user data
    Then I verify user data is updated

