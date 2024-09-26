import { Page, BrowserContext } from "@playwright/test";
import { readJsonFile } from "../utils/JsonHelper";
import { LoginPO } from "../pages/loginPO";
import { UserInforData } from "../DTO/userInforData";
const path = require("path");

export async function login(userType: string, context?: BrowserContext) {
  const page: Page = await context.newPage();

  var testData = {};
  if (userType === "valid") {
    testData = await readJsonFile(
      path.resolve(__dirname, "../data/validUserData.json"),
    );
  } else if (userType === "invalid") {
    testData = await readJsonFile(
      path.resolve(__dirname, "../data/invalidUserData.json"),
    );
  }
  const user = new UserInforData();
  Object.assign(user, testData);

  try {
    await page.goto(`https://courses.ultimateqa.com/users/sign_in`, {
      timeout: 120000,
    });
  } catch (error) {
    console.error("Error navigating to website:", error);
    throw error;
  }

  const loginPO = new LoginPO(page);
  await loginPO.enterEmail(user.Email);
  await loginPO.enterPassword(user.Password);

  await loginPO.clickSignInButton();

  while (!(await validateUserCookie(context))) {
    await page.waitForTimeout(5000);
  }

  await page.context().storageState({ path: "authentication/ui-authen.json" });
  await context.close();
}

async function validateUserCookie(context: BrowserContext) {
  const cookies = await context.cookies();

  const userIdCookie = cookies.find(
    (cookie) =>
      cookie.name === "ajs_user_id" &&
      cookie.value !== null &&
      cookie.value !== "",
  );

  if (userIdCookie) {
    console.log("User is authenticated:", userIdCookie.value);
    return true; // User is authenticated
  } else {
    console.log("User is not authenticated");
    return false; // User is not authenticated
  }
}
