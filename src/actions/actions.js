/* globals fetch, API_ENDPOINT, PIWIK_INSTANCE  */
import Cookie from 'react-cookie'
import { piwikParams, createPiwikAction } from 'actions/piwik'

export const REQUEST_API = 'REQUEST_API'
export const RECEIVE_API = 'RECEIVE_API'
export const APPLICATION_ERROR = 'APPLICATION_ERROR'
export const CHECK_AUTHENTICATION = 'CHECK_AUTHENTICATION'
export const PIWIK_TRACK = 'PIWIK_TRACK'
export const SUPPLEMENTARY_OPEN = 'SUPPLEMENTARY_OPEN'
export const SET_DUE_DATE = 'SET_DUE_DATE'

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

function applicationError (error) {
  return {
    type: APPLICATION_ERROR,
    error: error
  }
}

function checkAuthentication (isLoggedIn) {
  return {
    type: CHECK_AUTHENTICATION,
    isLoggedIn: isLoggedIn
  }
}

function piwikTrack () {
  return {
    type: PIWIK_TRACK
  }
}

function activeSupplementary (supplementaryID) {
  return {
    type: SUPPLEMENTARY_OPEN,
    activeSupplementary: supplementaryID
  }
}

function setDueDate (date) {
  return {
    type: SET_DUE_DATE,
    dueDate: date
  }
}

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export function fetchContent () {
  return dispatch => {
    dispatch(requestAPI())
    return fetch(API_ENDPOINT) // set in webpack config
      .then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(receiveAPI(json)))
      .catch(function (error) {
        dispatch(applicationError(error))
      })
  }
}

export function checkAuthCookie () {
  return dispatch => {
    let authResult = Cookie.load('is_authenticated')
    if (authResult == null) { authResult = false } // null or undefined
    dispatch(checkAuthentication(authResult))
  }
}

export function piwikTrackPost (piwikAction) {
  return dispatch => {
    return fetch(PIWIK_INSTANCE, {
      method: 'POST',
      body: JSON.stringify({ 'requests': [
        piwikParams(createPiwikAction(piwikAction))
      ]})
    })
    .then(() => {
      dispatch(piwikTrack())
    })
    .catch(() => {
      // fail silently, pretend the action happened anyhow
      dispatch(piwikTrack())
    })
  }
}

export function activateSupplementary (id) {
  return dispatch => {
    dispatch(activeSupplementary(id))
  }
}

export function addDueDate (date) {
  return dispatch => {
    dispatch(setDueDate(date))
  }
}
