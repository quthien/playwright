import { ICustomWorld } from "../support/custom-world";
import { Given, When, Then } from "@cucumber/cucumber";
import { playwrightConfig } from "../../playwright.config";
import { expect } from "@playwright/test";

import { HomePO } from "../pages/HomePO";
import { Helper } from "../utils/Helper";
import { JsonReader } from "../utils/JsonReader";
import { pageFixture } from "../support/pageFixture";

// Given("I call and verify product list", async function (this: ICustomWorld) {
//  // call this api https://automationexercise.com/api/productsList and verify the response
//  const newIssue = await request.(`https://automationexercise.com/api/productsList`, {
// });
// expect(newIssue.ok()).toBeTruthy();
// });
