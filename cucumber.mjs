import * as dotenv from "@dotenvx/dotenvx";
import path from "path";
// Determine which environment file to load based on NODE_ENV
const envFile = {
  sandbox: "environments/sandbox.env",
  staging: "environments/staging.env",
  production: "environments/production.env",
}[process.env.NODE_ENV || "sandbox"]; // Default to sandbox if NODE_ENV is not set

dotenv.config({ path: "environments/.env.sandbox" });

const getWorldParams = () => {
  const params = {
    foo: "bar",
  };

  return params;
};

const config = {
  requireModule: ["ts-node/register"],
  require: ["./src/**/*.ts"],
  paths: [
    // Define your Feature file path here
    "features/**/*.feature",
  ],
  format: [
    "progress",
    "@cucumber/pretty-formatter",
    "json:reports/cucumber-report.json",
    "html:reports/report.html",
    "./src/support/reporter.ts",
  ],
  formatOptions: { snippetInterface: "async-await" },
  worldParameters: getWorldParams(),
};
// process.env.USE_ALLURE = true;
// if (process.env.USE_ALLURE) {
//   config.format.push('./src/support/reporters/allure-reporter.ts');
// } else {
//   config.format.push('@cucumber/pretty-formatter');
// }
export default config;
