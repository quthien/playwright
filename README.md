Playwright with Cucumber

librairies: Playwright, Cucumber, Allure, reportportal, dotenv

# description

This project is a template for using Playwright with Cucumber, which supports Allure and ReportPortal reporting.
The project is configured to use the dotenv library to manage the environment variables.

## Installation

1. Install Node.js
2. npm install

npm run test:sandbox:allurereport to output result with Allure reporting

npm run test:sandbox:reportportal to output result with ReportPortal reporting and notify with slack

### command line breakdown

cross-env NODE_ENV=sandbox HEADLESS=true USE_ALLURE=false USE_REPOR_PORTAL=true PARALLEL=1 dotenvx run -- cucumber-js

NODE_ENV=sandbox: set the environment to sandbox
HEADLESS=true: run the browser in headless mode
USE_ALLURE=false: disable Allure reporting
USE_REPOR_PORTAL=true: enable ReportPortal reporting
PARALLEL=1: run the tests not in parallel

### Setup to run in Jenkin

install Allure report plugin via this link: https://allurereport.org/docs/integrations-jenkins/

The framework is configured to run in Jenkins via docker.

![jenkin](https://github.com/user-attachments/assets/0b0bcc0f-f389-40ac-bfef-f39925549be3)

after trigger run you will see allure report in each run

![image](https://github.com/user-attachments/assets/a568f774-05dc-42ba-be8c-4535c8c3796a)

![image](https://github.com/user-attachments/assets/3bc19844-1879-419a-9cb0-c94924aebd40)

### Setup to run with report portal and notify on Slack

1. Setup and config report portal, you can choose the fastest way which is using docker compose via this link: https://reportportal.io/docs/installation-steps/DeployWithDocker
2. Setup a Slack API to your bot and input it in slackNotification.mjs
3. Run the cmd "npm run test"

After the run is successful your result will be pushed to report portal and notified on Slack

![image](https://github.com/user-attachments/assets/27ae36e9-89ac-4e00-980e-cd3c6c130de2)

![image](https://github.com/user-attachments/assets/20b3929a-6dd9-4787-8bab-614bffb49d1d)
