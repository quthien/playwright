import axios from "axios";
import { currentDateTime } from "../variableSharing/sharedVariables"; // Import shared variable
import configReportPortal from "../../reportportal.json"; // Importing JSON directly in TypeScript
export class slackNotificationHelper {
  SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

  async pushNotiToSlack(counts: {
    passedTestCount: number;
    failedTestCount: number;
    skippedTestCount: number;
  }) {
    const message = {
      text:
        `${counts.passedTestCount} test passed, ${counts.failedTestCount} tests failed, ${counts.skippedTestCount} tests skipped \n` +
        `this is the full test result report: ${configReportPortal.endpoint}/ui/#launches/all`,
    };

    try {
      await axios.post(this.SLACK_WEBHOOK_URL, message);
      console.log("Slack notification sent");
    } catch (error) {
      console.error("Failed to send Slack notification:", error);
    }
  }
}
