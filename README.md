Playwright with Cucumber

librairies: Playwright, Cucumber, Allure, reportportal, dotenv

# description

this project is a template for using Playwright with Cucumber, supporting Allure and ReportPortal reporting.
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
dotenvx run -- cucumber-js: run the tests with cucumber-js

### Setup to run in jekin

The framework is configured to run in Jenkins via docker.
