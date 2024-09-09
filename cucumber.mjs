import * as dotenvx from "@dotenvx/dotenvx";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import _ from "lodash";
import pkg from "agent-js-cucumber";
const { ReportportalAgent } = pkg;

// Determine which environment file to load based on NODE_ENV
const envFile = {
  sandbox: ".env.sandbox",
  staging: ".env.staging",
  production: ".env.production",
}[process.env.NODE_ENV || "sandbox"]; // Default to sandbox if NODE_ENV is not set

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Get the current directory

dotenvx.config({
  path: path.join(__dirname, "/environments/", envFile),
});

async function loadReportPortalConfig() {
  const configPath = path.resolve("./reportportal.json");
  const fileContent = await fs.readFile(configPath, "utf-8");
  return JSON.parse(fileContent);
}

const reportportalConfig = await loadReportPortalConfig(); // Load the ReportPortal configuration

console.log(`Loading environment variables from: ${envFile}`);
console.log("BASE_URL:", process.env.BASE_URL);
console.log("BROWSER:", process.env.BROWSER);
console.log("PARALLEL:", _.toInteger(process.env.PARALLEL));
console.log("ALLURE:", process.env.USE_ALLURE);

const config = {
  requireModule: ["ts-node/register"], // Loads TypeScript files directly for execution
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
    "agent-js-cucumber/reporter", // Add the ReportPortal reporter here
  ],
  formatOptions: { snippetInterface: "async-await" },
  parallel: _.toInteger(process.env.PARALLEL),
  worldParameters: {
    reportportal: reportportalConfig,
  },
};

if (process.env.USE_ALLURE === "true") {
  config.format.push("./src/support/reporter.ts");
} else {
  config.format.push("@cucumber/pretty-formatter");
}
export default config;
