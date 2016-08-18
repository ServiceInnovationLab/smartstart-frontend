/*
 * APPLICATION LEVEL CONFIGURATION CONSTANTS
 * e.g. what api endpoint to use, what piwik site id
 *
 * These are picked up by the webpack configuration, which takes command line
 * options to decide which setting will be applied. Configuration is then passed
 * passed on through to the application as needed.
 *
 * Every constant that has multiple possible values must have a default option
 * specified.
 */

const apiPaths = {
  local: '/assets/test-data.json',
  testing: 'https://govtnz-test1.cwp.govt.nz/BoacAPI/v1/all',
  production: null
}

const piwikEnvs = {
  testing: 1,
  development: 2 // all dev envs share the same piwik instance
}

const piwikInstance = 'https://analytics.bundle.services.govt.nz/piwik.php'

const defaults = {
  apiPaths: 'testing', // TODO update default endpoint to production when available
  piwikEnvs: 'development'
}

const config = {
  apiPaths: apiPaths,
  piwikEnvs: piwikEnvs,
  piwikInstance: piwikInstance,
  defaults: defaults
}

module.exports = config
