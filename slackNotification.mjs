import axios from "axios";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import test from "@playwright/test";

const slackWebhookUrl = `https://hooks.slack.com/services/${process.env.SLACK_WEBHOOK}`;
const GEMINIKEY = process.env.GEMINIKEY;
const CHATGPTKEY = process.env.OPENAI_API_KEY;

// Function to send Slack notification
async function sendSlackMessage() {
  const reportPortalUrl =
    "http://localhost:8081/ui/#report_portal/launches/all"; // Replace with your Report Portal URL
  const lockFilePath = path.resolve("first-launch-name.lock");
  const reportFile = readJsonFile("reports/test-summary.json");
  const testSummaryCucumber = "reports/cucumber-report.json";
  const launchID = fs.readFileSync(lockFilePath, "utf8");

  // const reportData = await getLatestReportPortalLaunch(launchID);
  // const reportID = reportData.content[0].id;

  const testSummary = await summaryReportForAi(testSummaryCucumber);

  const analysisResult = await getAIAnalysis(testSummary, "gemini");

  await postToSlackTestJenkin(slackWebhookUrl, analysisResult.parts[0].text);

  // const message = generateSlackMessage(reportPortalUrl, reportID, testSummary);
  // postToSlack(slackWebhookUrl, message);
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

async function summaryReportForAi(testSummaryCucumber) {
  const results = JSON.parse(fs.readFileSync(testSummaryCucumber, "utf8"));

  // Extract failed scenarios
  const failedTests = [];
  results.forEach((feature) => {
    feature.elements.forEach((scenario) => {
      let scenarioStatus = "passed";
      let errorMessage = null;

      scenario.steps.forEach((step) => {
        if (step.result.status === "failed") {
          scenarioStatus = "failed";
          errorMessage =
            step.result.error_message || "No error message provided.";
        }
      });

      if (scenarioStatus === "failed") {
        failedTests.push({
          name: scenario.name,
          error: errorMessage,
        });
      }
    });
  });

  // Prepare summary
  const totalTests = results.reduce(
    (sum, feature) => sum + feature.elements.length,
    0,
  );
  const failedCount = failedTests.length;
  const passedCount = totalTests - failedCount;

  return {
    totalTests: totalTests,
    passedTests: passedCount,
    failedTests: failedCount,
    failures: failedTests,
  };
}

async function getChatGPT(chatPrompt) {
  const openai = new OpenAI({ apiKey: CHATGPTKEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert test automation analyst.",
        },
        { role: "user", content: chatPrompt },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return "⚠️ ChatGPT analysis failed.";
  }
}

async function getGeminiAI(chatPrompt) {
  const content = {
    contents: [
      {
        parts: [{ text: chatPrompt }],
      },
    ],
  };

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINIKEY}`,
      content,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    const aiResponse = response.data.candidates?.[0]?.content;
    return aiResponse;
  } catch (error) {
    console.error(
      "Error fetching the latest Report Portal launch:",
      error.message,
    );
  }
}

async function getAIAnalysis(testSummary, whichAI) {
  const chatPrompt = `
  Test Execution Summary:
  - Total Tests: ${testSummary.totalTests}
  - Passed: ${testSummary.passedCount}
  - Failed: ${testSummary.failedCount}
  
  Failed Tests:
  ${testSummary.failures.map((f) => `🔴 *${f.name}* - ${f.error}`).join("\n")}
  
  Please analyze failure trends and provide possible root causes. Format: test name - error message - root cause. Give root cause short since your response will be pushed to slack
  `;

  switch (whichAI) {
    case "chatgpt":
      return await getChatGPT(chatPrompt);
    case "gemini":
      return await getGeminiAI(chatPrompt);
    default:
      return await getChatGPT(chatPrompt);
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
