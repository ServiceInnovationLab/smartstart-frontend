/*
 * Additional utilities to facilitate Piwik actions
 */

import URLSearchParams from 'url-search-params' // polyfill

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

export function createPiwikAction (action, id, cvar, event) {
  let request = Object.assign({
    'action_name': action,
    '_id': id,
    '_cvar': JSON.stringify(cvar)
  }, piwikDefaults)

  // if event is an object, use the Event Tracking vars
  if (event && (typeof event === typeof {})) {
    request = Object.assign({
      'e_c': event.category,
      'e_a': event.action,
      'e_n': event.name,
      'e_v': 0 // piwik wants a monetary or points value here, we don't care
    }, request)
  } else if (event) {
    // if it's a string, it's an outlink destination
    request.link = event
    request.url = event
  }

  return request
}

export function piwikParams (params) {
  var searchParams = new URLSearchParams()
  Object.keys(params).forEach((key) => {
    searchParams.append(key, params[key])
  })
  return '?' + searchParams.toString()
}
