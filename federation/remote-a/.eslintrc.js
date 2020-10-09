const baseConfig = require("eslint-config-react-app");

module.exports = {
  ...baseConfig,
  // remove flowtype plugin
  plugins: baseConfig.plugins.filter((plugin) => plugin !== "flowtype"),
  // remove flowtype plugin rules
  rules: Object.keys(baseConfig.rules).reduce((result, rule) => {
    return rule.startsWith("flowtype/")
      ? result
      : { ...result, [rule]: baseConfig.rules[rule] };
  }, {}),
};
