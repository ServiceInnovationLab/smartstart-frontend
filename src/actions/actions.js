/* globals fetch, API_ENDPOINT  */

export const REQUEST_API = 'REQUEST_API'
export const RECEIVE_API = 'RECEIVE_API'

function requestAPI () {
  return {
    type: REQUEST_API
  }
}

function receiveAPI (json) {
  return {
    type: RECEIVE_API,
    phases: json.phases,
    supplementary: json.supplementary
  }
}

export function fetchContent () {
  return dispatch => {
    dispatch(requestAPI())
    return fetch(API_ENDPOINT)
      .then(response => response.json())
      .then(json => dispatch(receiveAPI(json)))
      // TODO handle errors
  }
}
