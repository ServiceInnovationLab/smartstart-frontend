/* globals fetch, API_ENDPOINT  */
import Cookie from 'react-cookie'

export const REQUEST_API = 'REQUEST_API'
export const RECEIVE_API = 'RECEIVE_API'
export const CHECK_AUTHENTICATION = 'CHECK_AUTHENTICATION'

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

function checkAuthentication (isLoggedIn) {
  return {
    type: CHECK_AUTHENTICATION,
    isLoggedIn: isLoggedIn
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

export function checkAuthCookie () {
  return dispatch => {
    let authResult = Cookie.load('is_authenticated')
    dispatch(checkAuthentication(authResult))
  }
}
