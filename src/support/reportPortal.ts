import { createRPFormatterClass } from "@reportportal/agent-js-cucumber";
import config from "../../reportportal.json"; // Importing JSON directly in TypeScript
import { currentDateTime } from "../variableSharing/sharedVariables"; // Import shared variable

// Create the ReportPortal formatter once
config.launch = `Playwright Cucumber Launch ${currentDateTime}`;
const RPFormatter = createRPFormatterClass(config);

// Export the RPFormatter class
export default RPFormatter;
