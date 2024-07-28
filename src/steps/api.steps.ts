import { ICustomWorld } from "../support/custom-world";
import { Given, When, Then } from "@cucumber/cucumber";
import { playwrightConfig } from "../../playwright.config";
import { expect } from "@playwright/test";

import { HomePO } from "../pages/HomePO";
import { Helper } from "../utils/Helper";
import { Logger } from "../utils/Logger";
import { JsonReader } from "../utils/JsonReader";
import { pageFixture } from "../support/pageFixture";

const logger = new Logger();

Given("I call and verify product list", async function (this: ICustomWorld) {
  const response = await this.server.get("/api/productsList");
  console.log(await response.json());
  expect(response.ok()).toBeTruthy();
});

Given("I call api random user", async function (this: ICustomWorld) {
  const response = await this.server.get("/api/?nat=us&randomapi");
  logger.logObject(await response.json());

  await pageFixture.page.route(
    "https://randomuser.me/api/?nat=us&randomapi",
    async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      json.results[0].name.first = "TestUser7";
      await route.fulfill({ response, json });
    },
  );
  //  console.log(await response.json());
  //  expect(response.ok()).toBeTruthy();

  await pageFixture.page.goto("https://randomuser.me");

  await pageFixture.page.waitForTimeout(1000000000);
});

// Given("I call login api", async function (this: ICustomWorld) {
//     const helper = new Helper();

//     await pageFixture.page.route('https://automationexercise.com/login', route => {
//         const requestHeaders = route.request().headers();
//         console.log('Intercepted request headers:', requestHeaders);
//         route.continue();
//       });

//     const response = await this.server.post('/login', {
//         headers: {
//             'referer':"https://automationexercise.com/login",
//         },
//         data: {
//             'csrfmiddlewaretoken': "y3XPtuSvog6SRPeSvEmO6vLIV3A33SrlCNSpABcWHg5Mkxv2QwHTd97uUvIqSyMO",
//             'email': "TestUser7@gmail.com",
//             'password': "TestUser123",
//           }
//     });
//    console.log(await response.headersArray());
// //    expect(response.ok()).toBeTruthy();
//    });
