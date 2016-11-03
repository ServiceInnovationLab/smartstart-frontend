/* globals fetch, API_ENDPOINT, PIWIK_INSTANCE  */
import Cookie from 'react-cookie'
import md5 from 'js-md5'
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
export const OPEN_PROFILE = 'OPEN_PROFILE'
export const CLOSE_PROFILE = 'CLOSE_PROFILE'
export const OPEN_TODO = 'OPEN_TODO'
export const CLOSE_TODO = 'CLOSE_TODO'
export const GET_PIWIK_ID = 'GET_PIWIK_ID'

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

function openTodo () {
  return {
    type: OPEN_TODO
  }
}

function closeTodo () {
  return {
    type: CLOSE_TODO
  }
}

function openProfile () {
  return {
    type: OPEN_PROFILE
  }
}

function closeProfile () {
  return {
    type: CLOSE_PROFILE
  }
}

function piwikId (id) {
  return {
    type: GET_PIWIK_ID,
    piwikID: id
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

    // not logged in
    if (authResult == null) { // null or undefined
      authResult = false
    }

    dispatch(checkAuthentication(authResult))

    return Promise.resolve() // so we can chain other actions
  }
}

export function piwikTrackPost (piwikAction, piwikEvent) {
  // action should be a string
  // event can be a string of an outlink, or an object of an event
  // with the format:
  //   {
  //     category: string,
  //     action: string,
  //     name: string
  //   }
  return (dispatch, getState) => {
    const piwikID = getState().applicationActions.piwikID
    const isLoggedIn = getState().personalisationActions.isLoggedIn
    let customVars = {
      '1': ['Logged in for last action']
    }

    if (isLoggedIn) {
      customVars['1'].push('Yes')
    } else {
      customVars['1'].push('No')
    }

    return fetch(PIWIK_INSTANCE, {
      method: 'POST',
      body: JSON.stringify({ 'requests': [
        piwikParams(createPiwikAction(piwikAction, piwikID, customVars, piwikEvent))
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

    // save to a cookie or backend depending on login state
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
      let now = new Date()
      let soon = new Date()
      soon.setUTCHours(now.getUTCHours() + 1)

      // we have to set expiry (takes a date object) for IE and maxAge (takes # of seconds) for everything else
      Cookie.save('savedValues', JSON.stringify(newValues), { path: '/', secure: true, maxAge: 60 * 60, expires: soon })
    }
  }
}

export function saveMeldedPersonalisationValues (data) {
  const csrftoken = Cookie.load('csrftoken')

  return (dispatch) => {
    let valuesToSave = []

    // update the app state
    dispatch(receivePersonalisationData(data))

    // restructure data for API save
    for (var group in data) {
      for (var key in data[group]) {
        valuesToSave.push({
          'group': group,
          'key': key,
          'val': data[group][key]
        })
      }
    }

    // send the info to the backend
    return fetch('/api/preferences/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      credentials: 'same-origin',
      body: JSON.stringify(valuesToSave) // the backend only needs the individual update not all the values
    })
    .then(checkStatus)
    // we don't care about the response from this request
    .catch(function () {
      // a failure here is not critical enough to throw
      // an applicationError
    })
  }
}

export function fetchPersonalisationValues () {
  return (dispatch, getState) => {
    let oldData = Cookie.load('savedValues')

    if (getState().personalisationActions.isLoggedIn) {
      dispatch(requestPersonalisationData())
      return fetch('/api/users/me/', {
        credentials: 'same-origin'
      })
        .then(checkStatus)
        .then(response => response.json())
        .then(json => {
          let data = json.preferences

          // clear the savedValues cookie
          Cookie.remove('savedValues', { path: '/' })

          // meld with existing values stashed in the savedValues cookie, if present
          if (oldData) {
            // for each saved value, overwrite or create a new key in the api data result
            for (var group in oldData) {
              // create the setting or checkboxes grouping if not yet preset
              if (!data[group]) {
                data[group] = {}
              }

              // loop through the individual items
              for (var key in oldData[group]) {
                if (group === 'checkboxes' && oldData[group][key] === 'false') {
                  // don't update the api record if the cookie is explicitly false
                } else {
                  data[group][key] = oldData[group][key]
                }
              }
            }

            // need to save melded data back up to b/e - this will also set isFetchingPersonalisation to false
            dispatch(saveMeldedPersonalisationValues(data))
          } else {
            // there wasn't any old data, propogate the api values to the store
            dispatch(receivePersonalisationData(data))
          }
        })
        .catch(function (error) {
          dispatch(applicationError(error))
        })
    } else {
      // not logged in, if there are existing stashed values in the savedValues cookie, ressurect them
      if (oldData) {
        dispatch(receivePersonalisationData(oldData))
      }
    }
  }
}

export function toggleSettings (pane) {
  return dispatch => {
    switch (pane) {
      case OPEN_PROFILE:
        dispatch(openProfile())
        break
      case CLOSE_PROFILE:
        dispatch(closeProfile())
        break
      case OPEN_TODO:
        dispatch(openTodo())
        break
      case CLOSE_TODO:
        dispatch(closeTodo())
        break
    }
  }
}

export function getPiwikID () {
  return (dispatch) => {
    let id = Cookie.load('piwikID')

    // if the cookie doesn't exist already, make one now
    if (!id) {
      let datetime = new Date()
      let expireDate = new Date()

      expireDate.setMonth(datetime.getMonth() + 15)
      id = md5(datetime.toString() + Math.random()).substr(0, 16)

      // the number of seconds in maxAge is a slight fudge as not all months have 31 days...
      Cookie.save('piwikID', id, { path: '/', secure: true, maxAge: 60 * 60 * 24 * 31 * 15, expires: expireDate })
    }

    dispatch(piwikId(id))

    return Promise.resolve() // so we can chain other actions
  }
}
