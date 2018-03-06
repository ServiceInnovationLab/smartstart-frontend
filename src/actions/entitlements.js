import { checkStatus } from 'utils'
import fetchWithRetry from 'fetch-retry'

export const REQUEST_SCHEMA = 'REQUEST_SCHEMA'
export const RECEIVE_SCHEMA = 'RECEIVE_SCHEMA'
export const FAILURE_SCHEMA = 'FAILURE_SCHEMA'
export const REQUEST_ELIGIBILITY = 'REQUEST_ELIGIBILITY'
export const RECEIVE_ELIGIBILITY = 'RECEIVE_ELIGIBILITY'
export const FAILURE_ELIGIBILITY = 'FAILURE_ELIGIBILITY'
export const REQUEST_METADATA = 'REQUEST_METADATA'
export const RECEIVE_METADATA = 'RECEIVE_METADATA'
export const FAILURE_METADATA = 'FAILURE_METADATA'

function requestSchema() {
  return {
    type: REQUEST_SCHEMA
  }
}

function receiveSchema(payload) {
  return {
    type: RECEIVE_SCHEMA,
    payload
  }
}

function failureSchema() {
  return {
    type: FAILURE_SCHEMA
  }
}

function requestEligibility(payload) {
  return {
    type: REQUEST_ELIGIBILITY,
    payload
  }
}

function receiveEligibility(payload) {
  return {
    type: RECEIVE_ELIGIBILITY,
    payload
  }
}

function failureEligibility() {
  return {
    type: FAILURE_ELIGIBILITY
  }
}

function requestMetadata() {
  return {
    type: REQUEST_METADATA
  }
}

function receiveMetadata(payload) {
  return {
    type: RECEIVE_METADATA,
    payload
  }
}

function failureMetadata() {
  return {
    type: FAILURE_METADATA
  }
}

export function fetchSchema() {
  return dispatch => {
    dispatch(requestSchema())
    return fetchWithRetry(RAAP_INSTANCE + '/schema?criteria=draft', {
      retries: 3,
      retryDelay: 500,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + RAAP_API_KEY
      }
    })
    .then(checkStatus)
    .then(response => {
      return response.json()
    })
    .then(json => dispatch(receiveSchema(json)))
    .catch(() =>  dispatch(failureSchema()))
  }
}

export function postToReasoner(body) {
  return dispatch => {
    dispatch(requestEligibility(body))
    return fetchWithRetry(RAAP_INSTANCE + '/reasoning/reason?criteria=draft', {
      retries: 3,
      retryDelay: 500,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + RAAP_API_KEY
      },
      body: JSON.stringify(body)
    })
    .then(checkStatus)
    .then(response => {
      return response.json()
    })
    .then(json => dispatch(receiveEligibility(json)))
    .catch(() => dispatch(failureEligibility()))
  }
}

export function fetchMetadata() {
  return dispatch => {
    dispatch(requestMetadata())
    return fetchWithRetry('/assets/benefits-metadata.json', {
      retries: 3,
      retryDelay: 500,
      method: 'GET'
    })
    .then(checkStatus)
    .then(response => {
      return response.json()
    })
    .then(json => dispatch(receiveMetadata(json)))
    .catch(() =>  dispatch(failureMetadata()))
  }
}
