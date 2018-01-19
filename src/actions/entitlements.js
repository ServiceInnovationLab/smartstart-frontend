import { checkStatus } from 'utils'
import fetchWithRetry from 'fetch-retry'

export const REQUEST_SCHEMA = 'REQUEST_SCHEMA'
export const RECEIVE_SCHEMA = 'RECEIVE_SCHEMA'
export const FAILURE_SCHEMA = 'FAILURE_SCHEMA'

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
