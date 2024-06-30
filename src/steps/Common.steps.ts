import { ICustomWorld } from "../support/custom-world";
import { Given, When, Then } from "@cucumber/cucumber";
import { playwrightConfig } from "../../playwright.config";

Given("I go to website", async function (this: ICustomWorld) {
  try {
    const page = this.page!;
    await page.goto(playwrightConfig.baseURL);
  } catch (error) {
    console.error("Error navigating to website:", error);
    throw error;
  }
});
