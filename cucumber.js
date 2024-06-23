const common = [
  "tests/features/**/*.feature",
  "--require-module ts-node/register",
  "--require tests/step_definitions/**/*.ts",
  "--format progress-bar",
  "--format node_modules/cucumber-pretty",
].join(" ");

module.exports = {
  default: common,
};
