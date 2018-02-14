import { applicationError } from 'actions/application'
import { checkStatus } from 'utils'

export const REQUEST_API = 'REQUEST_API'
export const RECEIVE_API = 'RECEIVE_API'
export const SUPPLEMENTARY_OPEN = 'SUPPLEMENTARY_OPEN'
export const OPEN_PROFILE = 'OPEN_PROFILE'
export const CLOSE_PROFILE = 'CLOSE_PROFILE'
export const OPEN_TODO = 'OPEN_TODO'
export const CLOSE_TODO = 'CLOSE_TODO'

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

function activeSupplementary (supplementaryID) {
  return {
    type: SUPPLEMENTARY_OPEN,
    activeSupplementary: supplementaryID
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

export function activateSupplementary (id) {
  return dispatch => {
    dispatch(activeSupplementary(id))
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
