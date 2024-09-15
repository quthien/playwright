import { createRPFormatterClass } from "@reportportal/agent-js-cucumber";
import config from "../../reportportal.json"; // Importing JSON directly in TypeScript
import { currentDateTime } from "../variableSharing/variables";
import fs from "fs";
import path from "path";

const lockFilePath = path.resolve("first-launch-name.lock");
let RPFormatter = null;

export function setupReportPortal() {
  let launchName;

  if (!fs.existsSync(lockFilePath)) {
    // First process: generate the launch name and save it to the lock file
    launchName = `Playwright Cucumber Launch ${currentDateTime}`;
    fs.writeFileSync(lockFilePath, launchName, "utf8");

    // Use this launch name for ReportPortal
    config.launch = launchName;
    RPFormatter = createRPFormatterClass(config);
    console.log(
      `Formatter created at: ${launchName} by Process ID: ${process.pid}`,
    );
  } else {
    // Subsequent processes: read the launch name from the file
    launchName = fs.readFileSync(lockFilePath, "utf8");
    config.launch = launchName;
    RPFormatter = createRPFormatterClass(config);
    console.log(
      `Using launch name from first process: ${launchName} by Process ID: ${process.pid}`,
    );
  }

  return RPFormatter;
}

export default setupReportPortal();
