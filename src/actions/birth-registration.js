import { checkStatus } from 'utils'
import { applicationError } from './actions'

export const REQUEST_BIRTH_FACILITIES = 'REQUEST_BIRTH_FACILITIES'
export const RECEIVE_BIRTH_FACILITIES = 'RECEIVE_BIRTH_FACILITIES'
export const RECEIVE_CSRF_TOKEN = 'RECEIVE_CSRF_TOKEN'
export const REQUEST_COUNTRIES = 'REQUEST_COUNTRIES'
export const RECEIVE_COUNTRIES = 'RECEIVE_COUNTRIES'

function requestBirthFacilities() {
  return {
    type: REQUEST_BIRTH_FACILITIES
  }
}

function receiveBirthFacilities(payload) {
  return {
    type: RECEIVE_BIRTH_FACILITIES,
    payload
  }
}

function requestCountries() {
  return {
    type: REQUEST_COUNTRIES
  }
}

function receiveCountries(payload) {
  return {
    type: RECEIVE_COUNTRIES,
    payload
  }
}

function receiveCsrfToken(token) {
  return {
    type: RECEIVE_CSRF_TOKEN,
    token
  }
}

export function fetchBirthFacilities() {
  return dispatch => {
    dispatch(requestBirthFacilities())
    return fetch('/birth-registration-api/ReferenceData/birth-facilities', {
      credentials: 'same-origin'
    })
    .then(checkStatus)
    .then(response => response.json())
    .then(json => dispatch(receiveBirthFacilities(json)))
    .catch(error => dispatch(applicationError(error)))
  }
}

export function fetchCountries() {
  return dispatch => {
    dispatch(requestCountries())
    return fetch('/birth-registration-api/ReferenceData/countries', {
      credentials: 'same-origin'
    })
    .then(checkStatus)
    .then(response => {
      const csrfToken = response.headers.get('X-XSRF-TOKEN')
      dispatch(receiveCsrfToken(csrfToken))
      return response.json()
    })
    .then(json => dispatch(receiveCountries(json)))
    .catch(error => dispatch(applicationError(error)))
  }
}
