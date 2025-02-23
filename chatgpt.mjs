const fs = require("fs");
const axios = require("axios");
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Store API key in environment variables

const resultsFile = "test-results.json";

if (!fs.existsSync(resultsFile)) {
  console.error("Test results file not found.");
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsFile, "utf8"));

// Extract failed tests
const failedTests = results.suites.flatMap((suite) =>
  suite.specs.flatMap((spec) =>
    spec.tests.filter((test) =>
      test.results.some((result) => result.status === "failed"),
    ),
  ),
);

const failureSummary = failedTests.map((test) => ({
  name: test.title,
  error: test.results.find((r) => r.status === "failed")?.error.message,
}));

const totalTests = results.suites.reduce(
  (acc, suite) => acc + suite.specs.length,
  0,
);
const failedCount = failedTests.length;
const passedCount = totalTests - failedCount;

// ChatGPT Prompt
const chatGPTPrompt = `
Here is a summary of Playwright test results:

- Total Tests: ${totalTests}
- Passed: ${passedCount}
- Failed: ${failedCount}

Detailed Failures:
${failureSummary.map((f) => `Test: ${f.name}, Error: ${f.error}`).join("\n")}

Generate a concise, actionable report highlighting the key failure patterns and suggestions for fixes.
`;

async function getChatGPTAnalysis() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert test automation analyst.",
        },
        { role: "user", content: chatGPTPrompt },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return "⚠️ ChatGPT analysis failed.";
  }
}

// Send to Slack
async function sendToSlack(report) {
  const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"; // Replace with your Slack Webhook

  const slackMessage = { text: `📝 *Test Analysis Report:*\n\n${report}` };

  try {
    await axios.post(SLACK_WEBHOOK_URL, slackMessage);
    console.log("📤 Report sent to Slack");
  } catch (error) {
    console.error("⚠️ Error sending Slack message:", error);
  }
}

// Run Analysis
getChatGPTAnalysis().then(sendToSlack);
