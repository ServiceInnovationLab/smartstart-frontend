import Cookie from 'react-cookie'

import { applicationError, authError } from 'actions/application'
import { checkStatus } from 'utils'

export const CHECK_AUTHENTICATION = 'CHECK_AUTHENTICATION'
export const SET_DUE_DATE = 'SET_DUE_DATE'
export const SET_SUBSCRIBED = 'SET_SUBSCRIBED'
export const SET_USER_EMAIL = 'SET_USER_EMAIL'
export const REQUEST_PHASE_METADATA = 'REQUEST_PHASE_METADATA'
export const RECEIVE_PHASE_METADATA = 'RECEIVE_PHASE_METADATA'
export const SAVE_PERSONALISATION = 'SAVE_PERSONALISATION'
export const REQUEST_PERSONALISATION_DATA = 'REQUEST_PERSONALISATION_DATA'
export const RECIEVE_PERSONALISATION_DATA = 'RECIEVE_PERSONALISATION_DATA'

function checkAuthentication (isLoggedIn) {
  return {
    type: CHECK_AUTHENTICATION,
    isLoggedIn: isLoggedIn
  }
}

function setDueDate (date) {
  return {
    type: SET_DUE_DATE,
    dueDate: date
  }
}

function setSubscribed (state) {
  return {
    type: SET_SUBSCRIBED,
    subscribed: state
  }
}

function setEmailValue (email) {
  return {
    type: SET_USER_EMAIL,
    email: email
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

export function checkAuthCookie () {
  return dispatch => {
    let authResult = Cookie.load('is_authenticated')

    if (authResult === 'true') {
      dispatch(checkAuthentication(true))
    } else {
      // not logged in
      if (typeof authResult === 'string') { // not null or undefined
        // RealMe error string
        dispatch(authError(authResult))

        // clear the cookie so the message is cleared on reload
        Cookie.remove('is_authenticated', { path: '/' })
      }
      dispatch(checkAuthentication(false))
    }

    return Promise.resolve() // so we can chain other actions
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

export function addSubscribed (subscribed) {
  return dispatch => {
    dispatch(setSubscribed(!!subscribed))
  }
}

export function saveNewEmail(email) {
  const csrftoken = Cookie.load('csrftoken')

  return (dispatch, getState) => {
    const isLoggedIn = getState().personalisation.isLoggedIn

    if (isLoggedIn) {
      // send the info to the backend - no dispatch as we don't need the result or to put up a spinner
      return fetch('/api/emailaddresses/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        credentials: 'same-origin',
        body: JSON.stringify({ email }) // the backend only needs the individual update not all the values
      })
        .then(checkStatus)
        .catch(function () {
          // a failure here is indicative that the user's session has timed out
          dispatch(authError('local-timeout'))
          dispatch(checkAuthentication(false))
        })
    }
  }
}

export function checkPendingEmails () {
  return (dispatch, getState) => {
    const isLoggedIn = getState().personalisation.isLoggedIn

    if (isLoggedIn) {
      return fetch('/api/emailaddresses/', {
        credentials: 'same-origin'
      })
      .then(checkStatus)
      .then(response => response.json())
    }
    return Promise.resolve([])
  }
}

export function fetchPhaseMetadata () {
  return dispatch => {
    dispatch(requestPhaseMetadata())
    // this is the request that is made on every page load
    // we need to set credentials: 'same-origin' to make the fetch
    // aware of the cookie sent back by Django backend
    return fetch('/api/phase-metadata/', {
      credentials: 'same-origin'
    })
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
    const isLoggedIn = getState().personalisation.isLoggedIn
    const existingValues = getState().personalisation.personalisationValues
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
    if (isLoggedIn && values.length) {
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
      .catch(function () {
        // a failure here is indicative that the user's session has timed out
        dispatch(authError('local-timeout'))
        dispatch(checkAuthentication(false))
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

function saveMeldedPersonalisationValues (data) {
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
      body: JSON.stringify(valuesToSave)
    })
    .then(checkStatus)
    .catch(function () {
      // a failure here is indicative that the user's session has timed out, although this particular action should only happen immediately on login so this is an edge case
      dispatch(authError('local-timeout'))
      dispatch(checkAuthentication(false))
    })
  }
}

export function fetchPersonalisationValues () {
  return (dispatch, getState) => {
    let oldData = Cookie.load('savedValues')

    if (getState().personalisation.isLoggedIn) {
      dispatch(requestPersonalisationData())
      return fetch('/api/users/me/', {
        credentials: 'same-origin'
      })
        .then(checkStatus)
        .then(response => response.json())
        .then(json => {
          // email
          dispatch(setEmailValue(json.email))

          // personalisation values
          let data = Object.assign({}, json.preferences)

          // clear the savedValues cookie
          Cookie.remove('savedValues', { path: '/' })

          // meld with existing values stashed in the savedValues cookie, if present
          if (oldData) {
            // for each saved value, overwrite or create a new key in the api data result
            for (var group in oldData) {
              // create the setting or checkboxes grouping if not yet present
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
