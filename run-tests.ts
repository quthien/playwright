import { chromium } from "playwright";
import { execSync } from "child_process";
import * as playwrightConfig from "./playwright.config";

(async () => {
  try {
    // Launch Playwright browser
    // Run Cucumber tests using execSync
    execSync("npx cucumber-js", { stdio: "inherit" });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1); // Exit with non-zero code to indicate failure
  }
})();
