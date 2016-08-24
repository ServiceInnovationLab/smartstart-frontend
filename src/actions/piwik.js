/* globals PIWIK_SITE, URLSearchParams */
/* exported URLSearchParams */
/*
 * Additional utilities to facilitate Piwik actions
 */

const URLSearchParams = require('url-search-params') // URLSearchParams polyfill

let piwikDefaults = {
  idsite: PIWIK_SITE,
  send_image: 0,
  rec: 1,
  apiv: 1,
  rand: String(Math.random()).slice(2, 8),
  url: window.location.href,
  urlref: document.referrer,
  res: window.screen.width + 'x' + window.screen.height
}

export function createPiwikAction (actionName) {
  return Object.assign({'action_name': actionName}, piwikDefaults)
}

export function piwikParams (params) {
  var searchParams = new URLSearchParams()
  Object.keys(params).forEach((key) => {
    searchParams.append(key, params[key])
  })
  return '?' + searchParams.toString()
}
