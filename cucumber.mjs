import * as dotenvx from "@dotenvx/dotenvx";
import path from "path";
import { fileURLToPath } from "url";
import _ from "lodash";

// Utility function to resolve the environment file based on NODE_ENV
function resolveEnvFile() {
  const envFiles = {
    sandbox: ".env.sandbox",
    staging: ".env.staging",
    production: ".env.production",
  };

  // Default to sandbox if NODE_ENV is not set
  return envFiles[process.env.NODE_ENV || "sandbox"];
}

// Function to load the environment variables
const envFile = resolveEnvFile();
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Get the current directory

dotenvx.config({
  path: path.join(__dirname, "/environments/", envFile),
});

console.log(`Loading environment variables from: ${envFile}`);
console.log("BASE_URL:", process.env.BASE_URL);
console.log("BROWSER:", process.env.BROWSER);
console.log("PARALLEL:", _.toInteger(process.env.PARALLEL));
console.log("ALLURE:", process.env.USE_ALLURE);
console.log("REPORT_PORTAL:", process.env.USE_REPOR_PORTAL);

// Define Cucumber.js configuration
const config = {
  requireModule: ["ts-node/register"], // Loads TypeScript files directly for execution
  require: ["./src/**/*.ts"],
  paths: [
    // Define your Feature file path here
    "features/**/*.feature",
  ],
  format: [
    "progress",
    // "json:reports/cucumber-report.json",
    // "html:reports/report.html",
  ],
  formatOptions: { snippetInterface: "async-await" },
  parallel: _.toInteger(process.env.PARALLEL),
  retry: 0, // Retries failed scenarios twice
};

// Add Allure reporting if enabled
if (process.env.USE_ALLURE === "true") {
  config.format.push("./src/support/allureReporter.ts");
} else if (process.env.USE_REPOR_PORTAL === "true") {
  config.format.push("./src/support/reportPortal.ts");
} else {
  config.format.push("@cucumber/pretty-formatter");
}

// Export the configuration
export default config;
