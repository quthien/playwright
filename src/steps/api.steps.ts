import { ICustomWorld } from "../support/custom-world";
import axios from "axios";
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { Pact } from "@pact-foundation/pact";
import { pageFixture } from "../support/pageFixture";
import { APIHost } from "../support/apiManager";
import { getRandomUser } from "../service/randomuserService";
import { loggerInfo, logObject } from "../utils/logger";
import { provider } from "../support/pactSetup";
import { Verifier, Matchers } from "@pact-foundation/pact";

Given("a Pact interaction is set up", async () => {
  await provider.addInteraction({
    state: "provider has data for query parameters nat=us and randomapi",
    uponReceiving: "a request to fetch data with query parameters",
    withRequest: {
      method: "GET",
      path: "/api/",
      query: {
        nat: "us",
        randomapi: "",
      },
    },
    willRespondWith: {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" }, // Use plain string here
      body: {
        results: Matchers.eachLike({
          gender: Matchers.string("female"),
          name: {
            title: Matchers.string("Mrs"),
            first: Matchers.string("Carla"),
            last: Matchers.string("Mills"),
          },
          location: {
            street: {
              number: Matchers.integer(6099),
              name: Matchers.string("Valley View Ln"),
            },
            city: Matchers.string("Carrollton"),
            state: Matchers.string("New York"),
            country: Matchers.string("United States"),
            postcode: Matchers.integer(11501),
            coordinates: {
              latitude: Matchers.string("-89.8538"),
              longitude: Matchers.string("103.0951"),
            },
            timezone: {
              offset: Matchers.string("+10:00"),
              description: Matchers.string(
                "Eastern Australia, Guam, Vladivostok",
              ),
            },
          },
          email: Matchers.string("carla.mills@example.com"),
          login: {
            uuid: Matchers.string("295f9d2a-07b9-43f5-a8f9-6c331bcd2403"),
            username: Matchers.string("purplegoose806"),
            password: Matchers.string("volcano"),
            salt: Matchers.string("BTLm8w5G"),
            md5: Matchers.string("e76911ff960d4746dd967ce5737732ee"),
            sha1: Matchers.string("a9fc1c6ce9560bbb0f390a322f0c3474ffd61af0"),
            sha256: Matchers.string(
              "d72cd3e7d571c1762fb70e7b506c4fd0c080ccf53ac939a2a79fa542ecf945c7",
            ),
          },
          dob: {
            date: Matchers.string("1955-10-22T19:25:13.832Z"),
            age: Matchers.integer(69),
          },
          registered: {
            date: Matchers.string("2006-07-20T14:22:21.864Z"),
            age: Matchers.integer(18),
          },
          phone: Matchers.string("(778) 320-1026"),
          cell: Matchers.string("(365) 757-3478"),
          id: {
            name: Matchers.string("SSN"),
            value: Matchers.string("300-72-8936"),
          },
          picture: {
            large: Matchers.string(
              "https://randomuser.me/api/portraits/women/11.jpg",
            ),
            medium: Matchers.string(
              "https://randomuser.me/api/portraits/med/women/11.jpg",
            ),
            thumbnail: Matchers.string(
              "https://randomuser.me/api/portraits/thumb/women/11.jpg",
            ),
          },
          nat: Matchers.string("US"),
        }),
        info: {
          seed: Matchers.string("7790da2d6901fe01"),
          results: Matchers.integer(1),
          page: Matchers.integer(1),
          version: Matchers.string("1.4"),
        },
      },
    },
  });
});

Given("Pact Verification as a provider", async () => {
  await provider.setup();
  const stateHandlers = {
    "": () => {
      // No setup needed, empty state
      return Promise.resolve();
    },
  };

  await new Verifier({
    providerBaseUrl: "https://randomuser.me",
    pactBrokerUrl: "http://localhost:9292/",
    pactBrokerUsername: "pactuser",
    pactBrokerPassword: "pactpassword",
    provider: "Provider",
    consumerVersionSelectors: [{ latest: true }],
    publishVerificationResult: true, // Publishes results back to the broker
    providerVersion: "1.0.3", // Replace with actual provider version
    logLevel: "debug", // Set log level to DEBUG or TRACE for detailed logs
    stateHandlers, // Add the empty state handler here
  }).verifyProvider();
});

Given(
  "I call and change api random user with playwright route.fulfill",
  async function (this: ICustomWorld) {
    const response = await getRandomUser(this.apiManager);

    loggerInfo(JSON.stringify(response));
    loggerInfo(Object.assign(response));
    expect(response).toBeTruthy();

    // await pageFixture.page.goto("https://randomuser.me");

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
