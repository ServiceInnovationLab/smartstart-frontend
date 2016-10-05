/* globals fetch, API_ENDPOINT, PIWIK_INSTANCE  */
import Cookie from 'react-cookie'
import { piwikParams, createPiwikAction } from 'actions/piwik'
import { checkStatus } from 'utils'

export const REQUEST_API = 'REQUEST_API'
export const RECEIVE_API = 'RECEIVE_API'
export const APPLICATION_ERROR = 'APPLICATION_ERROR'
export const CHECK_AUTHENTICATION = 'CHECK_AUTHENTICATION'
export const PIWIK_TRACK = 'PIWIK_TRACK'
export const SUPPLEMENTARY_OPEN = 'SUPPLEMENTARY_OPEN'
export const SET_DUE_DATE = 'SET_DUE_DATE'
export const REQUEST_PHASE_METADATA = 'REQUEST_PHASE_METADATA'
export const RECEIVE_PHASE_METADATA = 'RECEIVE_PHASE_METADATA'
export const SAVE_PERSONALISATION = 'SAVE_PERSONALISATION'
export const REQUEST_PERSONALISATION_DATA = 'REQUEST_PERSONALISATION_DATA'
export const RECIEVE_PERSONALISATION_DATA = 'RECIEVE_PERSONALISATION_DATA'

// Action types

function requestAPI () {
  return {
    type: REQUEST_API
  }
}

function receiveAPI (json) {
  return {
    type: RECEIVE_API,
    phases: json.phases,
    supplementary: json.supplementary,
    about: json.about
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

function requestPhaseMetadata () {
  return {
    type: REQUEST_PHASE_METADATA
  }
}

function receivePhaseMetadata (json) {
  return {
    type: RECEIVE_PHASE_METADATA,
    phaseMetadata: json
  }
}

function savePersonalisation (object) {
  return {
    type: SAVE_PERSONALISATION,
    personalisationValues: object
  }
}

function requestPersonalisationData () {
  return {
    type: REQUEST_PERSONALISATION_DATA
  }
}

function receivePersonalisationData (preferences) {
  return {
    type: RECIEVE_PERSONALISATION_DATA,
    personalisationValues: preferences
  }
}

// Action creators

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
    return Promise.resolve() // so we can chain other actions
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
  if (date) {
    return dispatch => {
      dispatch(setDueDate(new Date(date)))
    }
  } else {
    return dispatch => {
      dispatch(setDueDate(null))
    }
  }
}

export function fetchPhaseMetadata () {
  return dispatch => {
    dispatch(requestPhaseMetadata())
    return fetch('/api/phase-metadata/')
      .then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(receivePhaseMetadata(json)))
      .catch(function () {
        // a failure here is not critical enough to throw
        // an applicationError - fake an empty response
        dispatch(receivePhaseMetadata([]))
      })
  }
}

export function savePersonalisationValues (values) {
  const csrftoken = Cookie.load('csrftoken')

  return (dispatch, getState) => {
    const isLoggedIn = getState().personalisationActions.isLoggedIn
    const existingValues = getState().personalisationActions.personalisationValues
    let newValues = Object.assign({}, existingValues)

    // we need to merge the state of the old personalisationValues with the new values
    values.forEach(object => {
      if (!newValues[object.group]) {
        newValues[object.group] = {}
      }
      newValues[object.group][object.key] = object.val
    })

    // update the app state
    dispatch(savePersonalisation(newValues))

    // save to a cookie or backend here depending on login state
    if (isLoggedIn) {
      // send the info to the backend - no dispatch as we don't need the result or to put up a spinner
      return fetch('/api/preferences/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        credentials: 'same-origin',
        body: JSON.stringify(values) // the backend only needs the individual update not all the values
      })
      .then(checkStatus)
      // we don't care about the response from this request
      .catch(function () {
        // a failure here is not critical enough to throw
        // an applicationError
      })
    } else {
      Cookie.save('savedValues', JSON.stringify(newValues), { path: '/', secure: true, maxAge: 60 * 60 })
    }
  }
}

export function fetchPersonalisationValues () {
  return (dispatch, getState) => {
    if (getState().personalisationActions.isLoggedIn) {
      dispatch(requestPersonalisationData())
      return fetch('/api/users/me/', {
        credentials: 'same-origin'
      })
        .then(checkStatus)
        .then(response => response.json())
        .then(json => dispatch(receivePersonalisationData(json.preferences)))
        .catch(function (error) {
          dispatch(applicationError(error))
        })
    }
  }
}
