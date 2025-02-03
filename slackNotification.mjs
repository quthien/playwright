import axios from "axios";
import fs from "fs";
import path from "path";

const slackWebhookUrl = `https://hooks.slack.com/services/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/${process.env.SLACK_WEBHOOK}`;

// Function to send Slack notification
async function sendSlackMessage() {
  const reportPortalUrl =
    "http://localhost:8081/ui/#report_portal/launches/all"; // Replace with your Report Portal URL
  const lockFilePath = path.resolve("first-launch-name.lock");
  const testSummary = readJsonFile("reports/test-summary.json");
  const launchID = fs.readFileSync(lockFilePath, "utf8");

  const reportData = await getLatestReportPortalLaunch(launchID);
  const reportID = reportData.content[0].id;

  postToSlackTestJenkin(slackWebhookUrl, "jenkin run successfully");

  const message = generateSlackMessage(reportPortalUrl, reportID, testSummary);
  postToSlack(slackWebhookUrl, message);
}

// Generate the Slack message
function generateSlackMessage(reportPortalUrl, reportID, testSummary) {
  const failedFilter = encodeURIComponent(
    "filter.in.status=FAILED,INTERRUPTED",
  );
  const passedFilter = encodeURIComponent("filter.in.status=PASSED");

  return `Cucumber tests completed:
  - <${reportPortalUrl}/${reportID}/?item0Params=${passedFilter} | Passed: ${testSummary.passed}>
  - <${reportPortalUrl}/${reportID}/?item0Params=${failedFilter} | Failed: ${testSummary.failed}>
  - Skipped: ${testSummary.skipped}
  - Full Report: ${reportPortalUrl}/${reportID}`;
}

// Post the message to Slack
async function postToSlack(slackWebhookUrl, message) {
  try {
    await axios.post(slackWebhookUrl, { text: message });
    console.log("Slack message sent!");
  } catch (error) {
    console.error(`Error sending Slack message: ${error.message}`);
  }
}

async function postToSlackTestJenkin(slackWebhookUrl, message) {
  try {
    await axios.post(slackWebhookUrl, { text: message });
    console.log("Slack message sent!");
  } catch (error) {
    console.error(`Error sending Slack message: ${error.message}`);
  }
}

// Fetch latest Report Portal launch
async function getLatestReportPortalLaunch(launchID) {
  const { endpoint, project, apiKey } = readJsonFile("reportportal.json");
  const apiUrl = `${endpoint}/${project}/launch/latest?filter.eq.name=${encodeURIComponent(launchID)}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: { accept: "*/*", Authorization: `Bearer ${apiKey}` },
    });
    console.log("Latest Launch:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching the latest Report Portal launch:",
      error.message,
    );
  }
}

// Read JSON file helper
function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error("Error reading JSON file:", error);
  }
}

sendSlackMessage();
