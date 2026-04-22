module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: [
      'features/support/world.js',
      'features/support/hooks.js',
      'features/step_definitions/**/*.js',
    ],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
    ],
    formatOptions: { snippetInterface: 'async-await' },
    timeout: 60000,
    publishQuiet: true,
  },
  checkout: {
    paths: ['features/checkout.feature'],
    require: [
      'features/support/world.js',
      'features/support/hooks.js',
      'features/step_definitions/checkout.steps.js',
    ],
    format: [
      'progress-bar',
      'json:reports/checkout-report.json',
      'html:reports/checkout-report.html',
    ],
    formatOptions: { snippetInterface: 'async-await' },
    timeout: 60000,
    publishQuiet: true,
  },
  login: {
    paths: ['features/login.feature'],
    require: [
      'features/support/world.js',
      'features/support/hooks.js',
      'features/step_definitions/login.steps.js',
    ],
    format: [
      'progress-bar',
      'json:reports/login-report.json',
      'html:reports/login-report.html',
    ],
    formatOptions: { snippetInterface: 'async-await' },
    timeout: 60000,
    publishQuiet: true,
  },
};
