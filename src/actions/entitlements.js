import { checkStatus } from 'utils'
import fetchWithRetry from 'fetch-retry'

export const REQUEST_SCHEMA = 'REQUEST_SCHEMA'
export const RECEIVE_SCHEMA = 'RECEIVE_SCHEMA'
export const FAILURE_SCHEMA = 'FAILURE_SCHEMA'
export const REQUEST_ELIGIBILITY = 'REQUEST_ELIGIBILITY'
export const RECEIVE_ELIGIBILITY = 'RECEIVE_ELIGIBILITY'
export const FAILURE_ELIGIBILITY = 'FAILURE_ELIGIBILITY'

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

function requestEligibility() {
  return {
    type: REQUEST_ELIGIBILITY
  }
}

function receiveEligibility(payload) {
  return {
    type: RECEIVE_SELIGIBILITY,
    payload
  }
}

function failureEligibility() {
  return {
    type: FAILURE_ELIGIBILITY
  }
}

// TODO do we actually need the schema?
export function fetchSchema() {
  return dispatch => {
    dispatch(requestSchema())
    return fetchWithRetry('https://nz.raap.d61.io/api/v0/domain/nz-entitlements-eligibility/schema?criteria=draft', {
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
    dispatch(requestEligibility())
    return fetchWithRetry('https://nz.raap.d61.io/api/v0/domain/nz-entitlements-eligibility/reasoning/reason?criteria=draft', {
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
    .catch(() =>  dispatch(failureEligibility()))
  }
}
