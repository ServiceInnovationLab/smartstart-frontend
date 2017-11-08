import Cookie from 'react-cookie'
import { checkStatus } from 'utils'
import fetchWithRetry from 'fetch-retry'

export const REQUEST_BIRTH_FACILITIES = 'REQUEST_BIRTH_FACILITIES'
export const RECEIVE_BIRTH_FACILITIES = 'RECEIVE_BIRTH_FACILITIES'
export const FAILURE_BIRTH_FACILITIES = 'FAILURE_BIRTH_FACILITIES'
export const REQUEST_COUNTRIES = 'REQUEST_COUNTRIES'
export const RECEIVE_COUNTRIES = 'RECEIVE_COUNTRIES'
export const FAILURE_COUNTRIES = 'FAILURE_COUNTRIES'
export const RECEIVE_CSRF_TOKEN = 'RECEIVE_CSRF_TOKEN'

export const REQUEST_BRO_DATA = 'REQUEST_BRO_DATA'
export const RECEIVE_BRO_DATA = 'RECEIVE_BRO_DATA'
export const FAILURE_BRO_DATA = 'FAILURE_BRO_DATA'

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

function failureBirthFacilities() {
  return {
    type: FAILURE_BIRTH_FACILITIES
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

function failureCountries() {
  return {
    type: FAILURE_COUNTRIES
  }
}

function requestBroData() {
  return {
    type: REQUEST_BRO_DATA
  }
}

function receiveBroData(payload) {
  return {
    type: RECEIVE_BRO_DATA,
    payload
  }
}

function failureBroData() {
  return {
    type: FAILURE_BRO_DATA
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
    .catch(() => dispatch(failureBirthFacilities()))
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
    .catch(() => dispatch(failureCountries()))
  }
}

export function retrieveBroData() {
  return fetchWithRetry('/api/bro-form/data/', {
    credentials: 'same-origin',
    retries: 3,
    retryDelay: 500
  })
  .then(checkStatus)
  .then(response => response.json());
}

export function fetchBroData() {
  return dispatch => {
    dispatch(requestBroData())

    retrieveBroData()
      .then(data => dispatch(receiveBroData(data)))
      .catch(() => dispatch(failureBroData()))
    }
}

export function rememberBroData(data) {
  const djangoCsrfToken = Cookie.load('csrftoken')

  // the api need a forward slash in the end
  return fetchWithRetry('/api/bro-form/data/', {
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
