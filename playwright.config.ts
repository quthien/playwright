import { LaunchOptions } from "@playwright/test";
import * as dotenv from "@dotenvx/dotenvx";

// Determine which environment file to load based on NODE_ENV
const envFile = {
  sandbox: "environments/sandbox.env",
  staging: "environments/staging.env",
  production: "environments/production.env",
}[process.env.NODE_ENV || "sandbox"]; // Default to sandbox if NODE_ENV is not set

dotenv.config({ path: __dirname + "environments/" + envFile });

const browserOptions: LaunchOptions = {
  slowMo: 0,
  headless: true, // Run tests in headless mode
};

export const playwrightConfig = {
  baseURL: process.env.BASE_URL,
  browserOptions,
  browser: process.env.BROWSER,
};
