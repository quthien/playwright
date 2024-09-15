import axios from "axios";
import fs from "fs";
import path from "path";

// Function to send Slack notification
async function sendSlackMessage() {
  const slackWebhookUrl =
    "https://hooks.slack.com/services/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"; // Add your Slack webhook URL
  const reportPortalUrl =
    "http://localhost:8081/ui/#report_portal/launches/all"; // Add your ReportPortal link
  const lockFilePath = path.resolve("first-launch-name.lock");
  const testSummary = JSON.parse(
    fs.readFileSync("reports/test-summary.json", "utf8"),
  );
  const launchID = fs.readFileSync(lockFilePath, "utf8");

  const reportData = await getLatestReportPortalLaunch(launchID);
  const reportID = reportData.content[0].id;

  const failedFilter = encodeURIComponent(
    "filter.eq.hasStats=true&filter.eq.hasChildren=false&filter.in.type=STEP&filter.in.status=FAILED,INTERRUPTED",
  );
  const passedFilter = encodeURIComponent(
    "filter.eq.hasStats=true&filter.eq.hasChildren=false&filter.in.type=STEP&filter.in.status=PASSED",
  );

  const message = `Cucumber tests completed:
  - <${reportPortalUrl}/${reportID}/?item0Params=${passedFilter} | Passed: ${testSummary.passed}>
  - <${reportPortalUrl}/${reportID}/?item0Params=${failedFilter} | Failed: ${testSummary.failed}>
  - Skipped: ${testSummary.skipped}
  - Full Report: ${reportPortalUrl}/${reportID}`;

  try {
    await axios.post(slackWebhookUrl, { text: message });
    console.log("Slack message sent!");
  } catch (error) {
    console.error(`Error sending Slack message: ${error.message}`);
  }
}

async function getLatestReportPortalLaunch(launchID) {
  const reportPortalConfig = await getReportPortalConfig("reportportal.json");

  const apiUrl = `${reportPortalConfig.endpoint}/${reportPortalConfig.project}/launch/latest?filter.eq.name=${encodeURIComponent(launchID)}`;
  const token = reportPortalConfig.apiKey; // Replace with your actual JWT token

  console.log("API URL:", apiUrl);
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    const latestLaunch = response.data;
    console.log("Latest Launch:", latestLaunch);
    return latestLaunch;
  } catch (error) {
    console.error(
      "Error fetching the latest Report Portal launch:",
      error.message,
    );
  }
}

function getReportPortalConfig(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8"); // Read the file synchronously
    const jsonData = JSON.parse(data); // Parse the file content into JSON
    console.log(jsonData); // Output the JSON data
    return jsonData;
  } catch (error) {
    console.error("Error reading JSON file:", error);
  }
}

sendSlackMessage();
