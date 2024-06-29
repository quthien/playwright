const common = [
  "features/**/*.feature",
  "--require-module ts-node/register",
  "--require features/steps/**/*.ts",
  "--require src/support/reporter.ts",
  "--format progress",
  "--format @cucumber/pretty-formatter",
  "--format json:./cucumber_report.json", // Optional: JSON format for future analysis
  "--format ./src/support/reporter.ts", // Path to your custom formatter
  "--exit", // This forces Cucumber to exit once tests are done
].join(" ");

module.exports = {
  default: common,
};

// const getWorldParams = () => {
//   const params = {
//     foo: 'bar',
//   };

//   return params;
// };

// const config = {
//   requireModule: ['ts-node/register'],
//   //require: ['src/**/*.ts'],
//   require: ['features/steps/**/*.ts', 'test_resources/**/*.ts', 'conf/**/*.ts'],
//   format: [
//     'summary',
//     'progress-bar',
//     '@cucumber/pretty-formatter',
//     'src/support/reporter.ts:OUTPUT.txt',
//     'rerun:@rerun.txt',
//   ],
//   formatOptions: { snippetInterface: 'async-await' },
//   worldParameters: getWorldParams(),
//   publishQuiet: true,
// };

// if (process.env.USE_ALLURE === 'true') {
//   config.format.push('./conf/reporters/allure-reporter.ts');
// } else {
//   config.format.push('@cucumber/pretty-formatter');
// }
// export default config;
