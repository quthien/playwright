import * as dotenvx from "@dotenvx/dotenvx";
import path from "path";
import { fileURLToPath } from "url";

// Determine which environment file to load based on NODE_ENV
const envFile = {
  sandbox: ".env.sandbox",
  staging: ".env.staging",
  production: ".env.production",
}[process.env.NODE_ENV || "sandbox"]; // Default to sandbox if NODE_ENV is not set

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenvx.config({
  path: path.join(__dirname, "/environments/", envFile),
});
console.log(`Loading environment variables from: ${envFile}`);
console.log("BASE_URL:", process.env.BASE_URL);
console.log("BROWSER:", process.env.BROWSER);

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
