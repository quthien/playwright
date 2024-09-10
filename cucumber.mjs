import * as dotenvx from "@dotenvx/dotenvx";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import _ from "lodash";
import pkg from "agent-js-cucumber";
const { ReportportalAgent } = pkg;

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
function loadEnvVariables() {
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
}

// Asynchronously load the ReportPortal configuration from JSON
async function loadReportPortalConfig() {
  try {
    const configPath = path.resolve("./reportportal.json");
    const fileContent = await fs.readFile(configPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading ReportPortal config:", error);
    throw error;
  }
}

// Main function to setup ReportPortalAgent and configuration
async function setup() {
  loadEnvVariables(); // Load environment variables

  const reportportalConfig = await loadReportPortalConfig(); // Load the ReportPortal config
  reportportalAgent = new ReportportalAgent(reportportalConfig); // Initialize the agent

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
      "@cucumber/pretty-formatter",
      "json:reports/cucumber-report.json",
      "html:reports/report.html",
      "agent-js-cucumber/reporter", // ReportPortal reporter
    ],
    formatOptions: { snippetInterface: "async-await" },
    parallel: _.toInteger(process.env.PARALLEL),
    worldParameters: {
      reportportal: reportportalConfig,
    },
  };

  // Add Allure reporting if enabled
  if (process.env.USE_ALLURE === "true") {
    config.format.push("./src/support/reporter.ts");
  } else {
    config.format.push("@cucumber/pretty-formatter");
  }

  return config; // Return the configuration
}

// Export the configuration
export default await setup();
