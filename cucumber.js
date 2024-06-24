const common = [
  "features/**/*.feature",
  "--require-module ts-node/register",
  "--require features/steps/**/*.ts",
  "--format progress",
  "--exit", // This forces Cucumber to exit once tests are done
].join(" ");

module.exports = {
  default: common,
};
