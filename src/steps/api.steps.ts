import { ICustomWorld } from "../support/custom-world";
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { pageFixture } from "../support/pageFixture";
import { APIHost } from "../support/apiManager";

Given(
  "I call and change api random user with playwright route.fulfill",
  async function (this: ICustomWorld) {
    const response = await this.apiManager
      .getContext(APIHost.Host1)
      .get("/api/?nat=us&randomapi");
    // logger.logObject(await response.json());

    // await pageFixture.page.route(
    //   "https://localhost:4001/api/?nat=us&randomapi",
    //   async (route) => {
    //     const response = await route.fetch();
    //     const json = await response.json();
    //     json.results[0].name.first = "TestUser7";
    //     await route.fulfill({ response, json });
    //   },
    // );
    // console.log(await response.json());
    expect(response.ok()).toBeTruthy();

    await pageFixture.page.goto("https://randomuser.me");

    // await pageFixture.page.waitForTimeout(1000000000);
  },
);

// Given("I call api random user", async function () {
//   // Intercept requests to the real API and redirect to Mountebank
//   const axiosInstance = axios.create({
//     httpsAgent: new https.Agent({
//       rejectUnauthorized: false
//     })
//   });
//   await pageFixture.page.route("https://randomuser.me/api/?nat=us&randomapi", async (route) => {
//     try {
//       const response = await axiosInstance.get("https://localhost:4001/api/?nat=us&randomapi");

//       await route.fulfill({
//         status: response.status,
//         contentType: response.headers['content-type'],
//         body: JSON.stringify(response.data),
//       });
//     } catch (error) {
//       console.error('Failed to fetch mock data:', error);
//       await route.abort();
//     }
//   });

//   // const response = await pageFixture.page.goto("https://randomuser.me/api/?nat=us&randomapi", { waitUntil: 'networkidle', timeout: 60000 });
//   await pageFixture.page.goto("https://randomuser.me");
//     await pageFixture.page.waitForTimeout(1000000000);
//   // const data = await response.json();
//   // console.log(data);
// });

// Given(
//   "I call api random user with mounte bank mock service",
//   async function () {
//     // Intercept requests to the real API and redirect to Mountebank
//     const axiosInstance = axios.create({
//       httpsAgent: new https.Agent({
//         rejectUnauthorized: false,
//       }),
//     });
//     await pageFixture.page.route(
//       "https://randomuser.me/api/?nat=us&randomapi",
//       async (route) => {
//         await route.continue({
//           url: "https://localhost:4000/api/?nat=us&randomapi",
//         });
//       },
//     );

//     // const response = await pageFixture.page.goto("https://randomuser.me/api/?nat=us&randomapi", { waitUntil: 'networkidle', timeout: 60000 });
//     await pageFixture.page.goto("https://randomuser.me");
//     // await pageFixture.page.waitForTimeout(1000000000);
//     // const data = await response.json();
//     // console.log(data);
//   },
// );
