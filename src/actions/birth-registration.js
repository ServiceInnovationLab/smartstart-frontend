import Cookie from 'react-cookie'
import { checkStatus } from 'utils'
import { applicationError } from './actions'
import fetchWithRetry from 'fetch-retry'

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
    return fetchWithRetry('/birth-registration-api/ReferenceData/birth-facilities', {
      credentials: 'same-origin',
      retries: 3,
      retryDelay: 500
    })
    .then(checkStatus)
    .then(response => {
      const csrfToken = response.headers.get('X-XSRF-TOKEN')
      dispatch(receiveCsrfToken(csrfToken))
      return response.json()
    })
    .then(json => dispatch(receiveBirthFacilities(json)))
    .catch(error => dispatch(applicationError(error)))
  }
}

export function fetchCountries() {
  return dispatch => {
    dispatch(requestCountries())
    return fetchWithRetry('/birth-registration-api/ReferenceData/countries', {
      credentials: 'same-origin',
      retries: 3,
      retryDelay: 500
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

export function retrieveBroData() {
  return fetchWithRetry('/api/sessions/bro_application/', {
    credentials: 'same-origin',
    retries: 3,
    retryDelay: 500
  })
  .then(checkStatus)
  .then(response => response.json());
}

export function rememberBroData(data) {
  const djangoCsrfToken = Cookie.load('csrftoken')

  // the api need a forward slash in the end
  return fetchWithRetry('/api/sessions/bro_application/', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': djangoCsrfToken
    },
    credentials: 'same-origin',
    retries: 3,
    retryDelay: 500,
    body: JSON.stringify(data)
  })
  .then(checkStatus)
  .then(response => response.json());
}
