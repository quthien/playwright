import { AllureRuntime, CucumberJSAllureFormatter } from "allure-cucumberjs";
import * as path from "path";

class Reporter extends CucumberJSAllureFormatter {
  constructor(options: Record<string, unknown>) {
    super(
      options,
      new AllureRuntime({
        resultsDir: path.resolve(__dirname, "allure-results"),
      }),
      {},
    );
  }
}

export default Reporter;
