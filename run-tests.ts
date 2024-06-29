import { execSync } from "child_process";

(async () => {
  try {
    // Launch Playwright browser
    // Run Cucumber tests using execSync
    execSync("npx cucumber-js", { stdio: "inherit" });
    //generate allure report
    execSync("npx allure generate --clean ./allure-results", {
      stdio: "inherit",
    });
    execSync("npx allure serve ./allure-results", { stdio: "inherit" });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1); // Exit with non-zero code to indicate failure
  }
})();
